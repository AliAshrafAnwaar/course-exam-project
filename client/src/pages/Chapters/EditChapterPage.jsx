import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useChapter } from '@/hooks';
import { chapterService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';

export function EditChapterPage() {
  const { id } = useParams();
  const { chapter, loading: chapterLoading, error: chapterError } = useChapter(id);
  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        chapterNumber: chapter.chapterNumber?.toString() || '',
      });
    }
  }, [chapter]);

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
      const result = await chapterService.update(id, {
        title: formData.title,
        chapterNumber: parseInt(formData.chapterNumber) || 1,
      });
      if (result.success) {
        navigate(`/chapters/${id}`);
      } else {
        setError(result.message || 'Failed to update chapter');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/chapters/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chapter
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Chapter</CardTitle>
          <CardDescription>Update chapter information for {chapter?.course?.name}</CardDescription>
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link to={`/chapters/${id}`}>
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

export default EditChapterPage;
