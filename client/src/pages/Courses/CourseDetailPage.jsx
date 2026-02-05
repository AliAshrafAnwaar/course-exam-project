import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks';
import { useAuth } from '@/context';
import { courseService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Alert, AlertDescription } from '@/components/ui';
import { BookOpen, FileText, Plus, ArrowLeft, Edit, Trash2, ChevronRight } from 'lucide-react';

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, loading, error, refetch } = useCourse(id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isOwner = course?.created_by === user?.id || user?.role?.name === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await courseService.delete(id);
      navigate('/courses');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete course');
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
        <Link to="/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            {course.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {course.description || 'No description available'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Created by {course.creator?.full_name || 'Unknown'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/courses/${id}/edit`}>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.chapters?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {course.chapters?.reduce((sum, ch) => sum + (ch.questions?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to={`/courses/${id}/exams/new`} className="block">
              <Button size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-1" />
                Generate Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chapters</CardTitle>
            {isOwner && (
              <Link to={`/courses/${id}/chapters/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Chapter
                </Button>
              </Link>
            )}
          </div>
          <CardDescription>Manage course chapters and questions</CardDescription>
        </CardHeader>
        <CardContent>
          {course.chapters?.length > 0 ? (
            <div className="space-y-2">
              {course.chapters
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/chapters/${chapter.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {chapter.chapterNumber}
                      </span>
                      <div>
                        <p className="font-medium">{chapter.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {chapter.questions?.length || 0} questions
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No chapters yet</p>
              {isOwner && (
                <Link to={`/courses/${id}/chapters/new`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Add First Chapter
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseDetailPage;
