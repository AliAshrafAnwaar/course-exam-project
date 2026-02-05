import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuestion } from '@/hooks';
import { questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';

export function EditQuestionPage() {
  const { id } = useParams();
  const { question, loading: questionLoading, error: questionError } = useQuestion(id);
  const [formData, setFormData] = useState({
    text: '',
    difficulty: 'simple',
    objective: 'reminding',
    choices: ['', '', ''],
    correct_answer: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.question_text || '',
        difficulty: question.difficulty || 'simple',
        objective: question.objective || 'reminding',
        choices: [
          question.choice_1 || '',
          question.choice_2 || '',
          question.choice_3 || '',
        ],
        correct_answer: (question.correct_answer || 1) - 1, // Convert to 0-indexed
      });
    }
  }, [question]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleChoiceChange = (index, value) => {
    setFormData(prev => {
      const newChoices = [...prev.choices];
      newChoices[index] = value;
      return { ...prev, choices: newChoices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emptyChoices = formData.choices.filter(c => !c.trim());
    if (emptyChoices.length > 0) {
      setError('All choices must be filled in');
      return;
    }

    setLoading(true);

    try {
      const result = await questionService.update(id, {
        questionText: formData.text,
        difficulty: formData.difficulty,
        objective: formData.objective,
        choice1: formData.choices[0],
        choice2: formData.choices[1],
        choice3: formData.choices[2],
        correctAnswer: formData.correct_answer + 1, // Backend expects 1-indexed
      });
      if (result.success) {
        navigate(`/questions/${id}`);
      } else {
        setError(result.message || 'Failed to update question');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (questionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questionError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{questionError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/questions/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Question
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Question</CardTitle>
          <CardDescription>Update question details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="text">Question Text *</Label>
              <textarea
                id="text"
                name="text"
                placeholder="Enter the question"
                value={formData.text}
                onChange={handleChange}
                required
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="simple">Simple</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Objective *</Label>
                <select
                  id="objective"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="reminding">Reminding</option>
                  <option value="understanding">Understanding</option>
                  <option value="creativity">Creativity</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Choices *</Label>
              {formData.choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={index}
                    checked={formData.correct_answer === index}
                    onChange={() => setFormData(prev => ({ ...prev, correct_answer: index }))}
                    className="h-4 w-4"
                  />
                  <Input
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Select the radio button next to the correct answer
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/questions/${id}`}>
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
                  <Save className="h-4 w-4 mr-2" />
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

export default EditQuestionPage;
