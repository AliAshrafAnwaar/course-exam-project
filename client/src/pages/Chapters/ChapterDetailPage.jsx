import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useChapter, useQuestions } from '@/hooks';
import { useAuth } from '@/context';
import { chapterService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Alert, AlertDescription } from '@/components/ui';
import { BookOpen, Plus, ArrowLeft, Edit, Trash2, HelpCircle } from 'lucide-react';

export function ChapterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chapter, loading: chapterLoading, error: chapterError } = useChapter(id);
  const { questions, loading: questionsLoading, refetch: refetchQuestions } = useQuestions(id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isOwner = chapter?.course?.created_by === user?.id || user?.role?.name === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this chapter? All questions will be deleted.')) {
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await chapterService.delete(id);
      navigate(`/courses/${chapter.course_id}`);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete chapter');
    } finally {
      setDeleting(false);
    }
  };

  if (chapterLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (chapterError) {
    return (
      <div className="space-y-4">
        <Link to="/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{chapterError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!chapter) return null;

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/courses/${chapter.course_id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>
      </div>

      {deleteError && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <BookOpen className="h-4 w-4" />
            {chapter.course?.name || 'Course'}
          </div>
          <h1 className="text-3xl font-bold">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </h1>
          {chapter.description && (
            <p className="text-muted-foreground mt-2">{chapter.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/chapters/${id}/edit`}>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Simple</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {questions?.filter(q => q.difficulty === 'simple').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Difficult</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {questions?.filter(q => q.difficulty === 'difficult').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 per combo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Link to={`/chapters/${id}/questions/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </Link>
          </div>
          <CardDescription>Manage chapter questions</CardDescription>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : questions?.length > 0 ? (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <Link
                  key={question.id}
                  to={`/questions/${question.id}`}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Question {index + 1}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[question.difficulty]}`}>
                          {question.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${objectiveColors[question.objective]}`}>
                          {question.objective}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {question.question_text}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No questions yet</p>
              <Link to={`/chapters/${id}/questions/new`}>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Question
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ChapterDetailPage;
