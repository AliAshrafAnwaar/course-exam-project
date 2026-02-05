import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCourse } from '@/hooks';
import { chapterService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';

export function CreateChapterPage() {
  const { courseId } = useParams();
  const { course } = useCourse(courseId);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chapterNumber: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await chapterService.create(courseId, {
        title: formData.title,
        chapterNumber: parseInt(formData.chapterNumber) || 1,
      });
      if (result.success) {
        navigate(`/chapters/${result.data.chapter.id}`);
      } else {
        setError(result.message || 'Failed to create chapter');
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
        <Link to={`/courses/${courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {course?.name || 'Course'}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Chapter</CardTitle>
          <CardDescription>Add a new chapter to {course?.name || 'this course'}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="chapterNumber">Chapter Number *</Label>
              <Input
                id="chapterNumber"
                name="chapterNumber"
                type="number"
                min="1"
                placeholder="1"
                value={formData.chapterNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Chapter Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter chapter title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter chapter description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/courses/${courseId}`}>
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
                  Create Chapter
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateChapterPage;
