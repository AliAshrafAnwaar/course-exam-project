import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@/components/ui';
import { BookOpen, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { courses, pagination, loading, error, refetch } = useCourses({ page, limit: 9, search });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch({ page: 1, limit: 9, search });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Browse and manage your courses</p>
        </div>
        <Link to="/courses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : courses?.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {course.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.chapters?.length || 0} chapters</span>
                      <span>By {course.creator?.full_name || 'Unknown'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  setPage(p => p - 1);
                  refetch({ page: page - 1, limit: 9, search });
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.pages}
                onClick={() => {
                  setPage(p => p + 1);
                  refetch({ page: page + 1, limit: 9, search });
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? 'Try a different search term' : 'Get started by creating your first course'}
            </p>
            {!search && (
              <Link to="/courses/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CoursesPage;
