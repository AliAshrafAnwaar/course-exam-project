import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useChapter } from '@/hooks';
import { questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export function CreateQuestionPage() {
  const { chapterId } = useParams();
  const { chapter } = useChapter(chapterId);
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

  const addChoice = () => {
    if (formData.choices.length < 5) {
      setFormData(prev => ({
        ...prev,
        choices: [...prev.choices, '']
      }));
    }
  };

  const removeChoice = (index) => {
    if (formData.choices.length > 2) {
      setFormData(prev => {
        const newChoices = prev.choices.filter((_, i) => i !== index);
        let newCorrect = prev.correct_answer;
        if (index === prev.correct_answer) {
          newCorrect = 0;
        } else if (index < prev.correct_answer) {
          newCorrect = prev.correct_answer - 1;
        }
        return { ...prev, choices: newChoices, correct_answer: newCorrect };
      });
    }
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
      const result = await questionService.create(chapterId, {
        questionText: formData.text,
        difficulty: formData.difficulty,
        objective: formData.objective,
        choice1: formData.choices[0],
        choice2: formData.choices[1],
        choice3: formData.choices[2],
        correctAnswer: formData.correct_answer + 1,
      });
      if (result.success) {
        navigate(`/chapters/${chapterId}`);
      } else {
        setError(result.message || 'Failed to create question');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/chapters/${chapterId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {chapter?.title || 'Chapter'}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Question</CardTitle>
          <CardDescription>Add a new question to {chapter?.title || 'this chapter'}</CardDescription>
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
              <div className="flex items-center justify-between">
                <Label>Choices *</Label>
                {formData.choices.length < 5 && (
                  <Button type="button" variant="outline" size="sm" onClick={addChoice}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Choice
                  </Button>
                )}
              </div>
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
                  {formData.choices.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChoice(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Select the radio button next to the correct answer
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/chapters/${chapterId}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Create Question
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateQuestionPage;
