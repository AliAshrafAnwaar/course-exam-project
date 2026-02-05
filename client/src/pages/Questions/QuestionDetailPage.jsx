import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestion } from '@/hooks';
import { useAuth } from '@/context';
import { questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardContent, Button, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { question, loading, error } = useQuestion(id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isOwner = question?.chapter?.course?.created_by === user?.id || user?.role?.name === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await questionService.delete(id);
      navigate(`/chapters/${question.chapter_id}`);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!question) return null;

  const choices = [question.choice_1, question.choice_2, question.choice_3].filter(Boolean);
  const correctAnswerIndex = question.correct_answer - 1;

  const difficultyColors = {
    simple: 'bg-green-100 text-green-800',
    difficult: 'bg-red-100 text-red-800',
  };

  const objectiveColors = {
    reminding: 'bg-blue-100 text-blue-800',
    understanding: 'bg-purple-100 text-purple-800',
    creativity: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/chapters/${question.chapter_id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chapter
          </Button>
        </Link>
      </div>

      {deleteError && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[question.difficulty]}`}>
                  {question.difficulty}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${objectiveColors[question.objective]}`}>
                  {question.objective}
                </span>
              </div>
              <CardTitle className="text-xl">Question</CardTitle>
            </div>
            <div className="flex gap-2">
              <Link to={`/questions/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Question Text</h3>
            <p className="text-lg">{question.question_text}</p>
          </div>

          <div>
            <h3 className="font-medium mb-3">Choices</h3>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    index === correctAnswerIndex
                      ? 'bg-green-50 border-green-200'
                      : 'bg-muted/30'
                  }`}
                >
                  {index === correctAnswerIndex ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={index === correctAnswerIndex ? 'font-medium' : ''}>
                    {choice}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Chapter</p>
              <p className="font-medium">{question.chapter?.title || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{question.chapter?.course?.name || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuestionDetailPage;
