import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useChapters } from '@/hooks';
import { examService, questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Check, Search, Edit } from 'lucide-react';

export function EditExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [examLoading, setExamLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual question selection state
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    chapter: '',
    difficulty: '',
    objective: ''
  });

  // Fetch exam data
  useEffect(() => {
    async function fetchExam() {
      try {
        const response = await examService.getById(id);
        if (response.success) {
          const examData = response.data.exam;
          setExam(examData);
          setName(examData.name || '');
          // Set selected questions from exam
          if (examData.questions) {
            setSelectedQuestions(examData.questions.map(q => q.id));
          }
        }
      } catch (err) {
        setError('Failed to load exam');
      } finally {
        setExamLoading(false);
      }
    }
    fetchExam();
  }, [id]);

  // Fetch chapters when exam is loaded
  useEffect(() => {
    async function fetchChapters() {
      if (exam?.course?.id) {
        try {
          const { chapterService } = await import('@/services');
          const response = await chapterService.getAllByCourse(exam.course.id);
          if (response.success) {
            setChapters(response.data.chapters || []);
          }
        } catch (err) {
          console.error('Failed to fetch chapters', err);
        }
      }
    }
    fetchChapters();
  }, [exam?.course?.id]);

  // Fetch all questions for the course
  useEffect(() => {
    async function fetchQuestions() {
      if (exam?.course?.id && allQuestions.length === 0) {
        setQuestionsLoading(true);
        try {
          const response = await questionService.getAllByCourse(exam.course.id);
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
  }, [exam?.course?.id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter an exam name');
      return;
    }

    setLoading(true);
    try {
      // Update exam name
      await examService.update(id, { name });

      // Update questions
      await examService.setQuestions(id, selectedQuestions);

      navigate(`/exams/${id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (examLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/exams/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            <CardTitle>Edit Exam</CardTitle>
          </div>
          <CardDescription>
            Update exam details and modify questions for {exam.course?.name}
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
              <Label htmlFor="name">Exam Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter exam name"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions ({selectedQuestions.length} selected)</Label>
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/exams/${id}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditExamPage;
