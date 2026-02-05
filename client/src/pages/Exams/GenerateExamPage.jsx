import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCourse, useChapters } from '@/hooks';
import { examService, questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Zap, Settings, BookOpen, Search, Check, Filter } from 'lucide-react';

export function GenerateExamPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, loading: courseLoading } = useCourse(courseId);
  const { chapters, loading: chaptersLoading } = useChapters(courseId);
  
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [formData, setFormData] = useState({
    title: '',
    total_questions: 12,
    chapter_requirements: [],
    difficulty_distribution: { simple: 50, difficult: 50 },
    objective_distribution: { reminding: 34, understanding: 33, creativity: 33 },
    algorithm_params: {
      populationSize: 50,
      generations: 100,
      mutationRate: 0.1,
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Manual mode state
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    chapter: '',
    difficulty: '',
    objective: ''
  });

  useEffect(() => {
    if (chapters?.length && formData.chapter_requirements.length === 0) {
      const perChapter = Math.floor(formData.total_questions / chapters.length);
      const remainder = formData.total_questions % chapters.length;
      
      setFormData(prev => ({
        ...prev,
        chapter_requirements: chapters.map((ch, idx) => ({
          chapter_id: ch.id,
          question_count: perChapter + (idx < remainder ? 1 : 0),
        })),
      }));
    }
  }, [chapters]);

  // Fetch all questions when switching to manual mode
  useEffect(() => {
    async function fetchQuestions() {
      if (mode === 'manual' && courseId && allQuestions.length === 0) {
        setQuestionsLoading(true);
        try {
          const response = await questionService.getAllByCourse(courseId);
          if (response.success) {
            setAllQuestions(response.data.questions || []);
          }
        } catch (err) {
          console.error('Failed to fetch questions', err);
        } finally {
          setQuestionsLoading(false);
        }
      }
    }
    fetchQuestions();
  }, [mode, courseId]);

  // Filter questions based on filters
  const filteredQuestions = allQuestions.filter(q => {
    if (filters.search && !q.question_text?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.chapter && q.chapter?.id?.toString() !== filters.chapter) {
      return false;
    }
    if (filters.difficulty && q.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.objective && q.objective !== filters.objective) {
      return false;
    }
    return true;
  });

  const toggleQuestion = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChapterCountChange = (chapterId, count) => {
    setFormData(prev => ({
      ...prev,
      chapter_requirements: prev.chapter_requirements.map(req =>
        req.chapter_id === chapterId
          ? { ...req, question_count: parseInt(count) || 0 }
          : req
      ),
    }));
  };

  const handleDistributionChange = (type, key, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: parseInt(value) || 0,
      },
    }));
  };

  const handleAlgorithmParamChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      algorithm_params: {
        ...prev.algorithm_params,
        [key]: key === 'mutationRate' ? parseFloat(value) : parseInt(value),
      },
    }));
  };

  const totalChapterQuestions = formData.chapter_requirements.reduce(
    (sum, req) => sum + req.question_count, 0
  );

  const difficultyTotal = Object.values(formData.difficulty_distribution).reduce((a, b) => a + b, 0);
  const objectiveTotal = Object.values(formData.objective_distribution).reduce((a, b) => a + b, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'manual') {
      // Manual mode validation
      if (selectedQuestions.length === 0) {
        setError('Please select at least one question');
        return;
      }

      setLoading(true);
      try {
        // Create exam
        const createResult = await examService.create(courseId, {
          name: formData.title || `${course?.name} Exam`,
          chapterRequirements: [],
          difficultyRequirements: { simple: 0, difficult: 0 },
          objectiveRequirements: { reminding: 0, understanding: 0, creativity: 0 },
        });

        if (!createResult.success) {
          setError(createResult.message || 'Failed to create exam');
          return;
        }

        const examId = createResult.data.exam.id;

        // Set questions manually
        const setResult = await examService.setQuestions(examId, selectedQuestions);
        if (setResult.success) {
          navigate(`/exams/${examId}`);
        } else {
          setError(setResult.message || 'Failed to set exam questions');
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Auto mode validation
    if (totalChapterQuestions !== parseInt(formData.total_questions)) {
      setError(`Chapter question counts (${totalChapterQuestions}) must equal total questions (${formData.total_questions})`);
      return;
    }

    if (difficultyTotal !== 100) {
      setError(`Difficulty distribution must sum to 100% (currently ${difficultyTotal}%)`);
      return;
    }

    if (objectiveTotal !== 100) {
      setError(`Objective distribution must sum to 100% (currently ${objectiveTotal}%)`);
      return;
    }

    setLoading(true);

    try {
      // Calculate actual counts from percentages
      const totalQ = parseInt(formData.total_questions);
      const simpleCount = Math.round(totalQ * formData.difficulty_distribution.simple / 100);
      const difficultCount = totalQ - simpleCount;
      const remindingCount = Math.round(totalQ * formData.objective_distribution.reminding / 100);
      const understandingCount = Math.round(totalQ * formData.objective_distribution.understanding / 100);
      const creativityCount = totalQ - remindingCount - understandingCount;

      // Step 1: Create the exam with requirements
      const createResult = await examService.create(courseId, {
        name: formData.title || `${course?.name} Exam`,
        chapterRequirements: formData.chapter_requirements.map(req => ({
          chapterId: req.chapter_id,
          questionCount: req.question_count,
        })),
        difficultyRequirements: {
          simple: simpleCount,
          difficult: difficultCount,
        },
        objectiveRequirements: {
          reminding: remindingCount,
          understanding: understandingCount,
          creativity: creativityCount,
        },
      });

      if (!createResult.success) {
        setError(createResult.message || 'Failed to create exam');
        return;
      }

      const examId = createResult.data.exam.id;

      // Step 2: Generate questions using genetic algorithm
      const generateResult = await examService.generate(examId, {
        populationSize: formData.algorithm_params.populationSize,
        generations: formData.algorithm_params.generations,
        mutationRate: formData.algorithm_params.mutationRate,
      });

      if (generateResult.success) {
        navigate(`/exams/${examId}`);
      } else {
        setError(generateResult.message || 'Failed to generate exam questions');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred during exam generation');
    } finally {
      setLoading(false);
    }
  };

  if (courseLoading || chaptersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/courses/${courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {course?.name || 'Course'}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Create Exam</CardTitle>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                type="button"
                size="sm"
                variant={mode === 'auto' ? 'default' : 'ghost'}
                onClick={() => setMode('auto')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Auto
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === 'manual' ? 'default' : 'ghost'}
                onClick={() => setMode('manual')}
              >
                <Check className="h-4 w-4 mr-1" />
                Manual
              </Button>
            </div>
          </div>
          <CardDescription>
            {mode === 'auto' 
              ? 'Use the genetic algorithm to generate an optimized exam'
              : 'Manually select questions for your exam'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                name="title"
                placeholder={`${course?.name} Exam`}
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {mode === 'auto' && (
              <div className="space-y-2">
                <Label htmlFor="total_questions">Total Questions</Label>
                <Input
                  id="total_questions"
                  name="total_questions"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.total_questions}
                  onChange={handleChange}
                />
              </div>
            )}

            {mode === 'auto' && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Questions per Chapter</Label>
                    <span className={`text-sm ${totalChapterQuestions !== parseInt(formData.total_questions) ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Total: {totalChapterQuestions} / {formData.total_questions}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {chapters?.map((chapter) => {
                      const req = formData.chapter_requirements.find(r => r.chapter_id === chapter.id);
                      return (
                        <div key={chapter.id} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Ch. {chapter.chapterNumber}: {chapter.title}</span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={req?.question_count || 0}
                            onChange={(e) => handleChapterCountChange(chapter.id, e.target.value)}
                            className="w-20"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Difficulty Distribution</Label>
                    <span className={`text-sm ${difficultyTotal !== 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Total: {difficultyTotal}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="w-24 text-sm">Simple</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.difficulty_distribution.simple}
                        onChange={(e) => handleDistributionChange('difficulty_distribution', 'simple', e.target.value)}
                      />
                      <span className="text-sm">%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-24 text-sm">Difficult</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.difficulty_distribution.difficult}
                        onChange={(e) => handleDistributionChange('difficulty_distribution', 'difficult', e.target.value)}
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Objective Distribution</Label>
                    <span className={`text-sm ${objectiveTotal !== 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Total: {objectiveTotal}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm">Reminding</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.objective_distribution.reminding}
                          onChange={(e) => handleDistributionChange('objective_distribution', 'reminding', e.target.value)}
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Understanding</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.objective_distribution.understanding}
                          onChange={(e) => handleDistributionChange('objective_distribution', 'understanding', e.target.value)}
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Creativity</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.objective_distribution.creativity}
                          onChange={(e) => handleDistributionChange('objective_distribution', 'creativity', e.target.value)}
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4" />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                  </Button>

                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm">Population Size</Label>
                          <Input
                            type="number"
                            min="10"
                            max="200"
                            value={formData.algorithm_params.populationSize}
                            onChange={(e) => handleAlgorithmParamChange('populationSize', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">Generations</Label>
                          <Input
                            type="number"
                            min="10"
                            max="500"
                            value={formData.algorithm_params.generations}
                            onChange={(e) => handleAlgorithmParamChange('generations', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">Mutation Rate</Label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                            value={formData.algorithm_params.mutationRate}
                            onChange={(e) => handleAlgorithmParamChange('mutationRate', e.target.value)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Higher population and generations increase quality but take longer. Mutation rate controls exploration vs exploitation.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {mode === 'manual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Select Questions ({selectedQuestions.length} selected)</Label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.chapter}
                    onChange={(e) => setFilters(f => ({ ...f, chapter: e.target.value }))}
                  >
                    <option value="">All Chapters</option>
                    {chapters?.map(ch => (
                      <option key={ch.id} value={ch.id}>Ch. {ch.chapterNumber}: {ch.title}</option>
                    ))}
                  </select>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.difficulty}
                    onChange={(e) => setFilters(f => ({ ...f, difficulty: e.target.value }))}
                  >
                    <option value="">All Difficulties</option>
                    <option value="simple">Simple</option>
                    <option value="difficult">Difficult</option>
                  </select>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filters.objective}
                    onChange={(e) => setFilters(f => ({ ...f, objective: e.target.value }))}
                  >
                    <option value="">All Objectives</option>
                    <option value="reminding">Reminding</option>
                    <option value="understanding">Understanding</option>
                    <option value="creativity">Creativity</option>
                  </select>
                </div>

                {questionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-2">
                    {filteredQuestions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No questions found</p>
                    ) : (
                      filteredQuestions.map(q => (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestion(q.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedQuestions.includes(q.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                              selectedQuestions.includes(q.id) ? 'bg-primary border-primary text-primary-foreground' : ''
                            }`}>
                              {selectedQuestions.includes(q.id) && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm line-clamp-2">{q.question_text}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                                  Ch. {q.chapter?.chapterNumber}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  q.difficulty === 'simple' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                  {q.objective}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/courses/${courseId}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {mode === 'auto' ? 'Generating...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center">
                  {mode === 'auto' ? <Zap className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  {mode === 'auto' ? 'Generate Exam' : `Create Exam (${selectedQuestions.length})`}
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default GenerateExamPage;
