import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context';
import { useCourses } from '@/hooks';
import { examService, chapterService, questionService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { BookOpen, FileText, Plus, Users, HelpCircle } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { courses, loading } = useCourses({ limit: 100 });
  const [stats, setStats] = useState({ exams: 0, questions: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!courses?.length) {
        setStatsLoading(false);
        return;
      }

      let totalExams = 0;
      let totalQuestions = 0;

      for (const course of courses) {
        // Fetch exams for each course
        try {
          const examResponse = await examService.getAllByCourse(course.id);
          if (examResponse.success) {
            totalExams += examResponse.data.exams?.length || 0;
          }
        } catch (err) {
          console.error('Failed to fetch exams', err);
        }

        // Fetch chapters and count questions
        if (course.chapters) {
          for (const chapter of course.chapters) {
            try {
              const questionResponse = await questionService.getAllByChapter(chapter.id);
              if (questionResponse.success) {
                totalQuestions += questionResponse.data.questions?.length || 0;
              }
            } catch (err) {
              console.error('Failed to fetch questions', err);
            }
          }
        }
      }

      setStats({ exams: totalExams, questions: totalQuestions });
      setStatsLoading(false);
    }

    if (!loading) {
      fetchStats();
    }
  }, [courses, loading]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.full_name || user?.username}!</h1>
          <p className="text-muted-foreground">Manage your courses and exams</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.exams}
            </div>
            <p className="text-xs text-muted-foreground">Generated exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats.questions}
            </div>
            <p className="text-xs text-muted-foreground">Total questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role?.name || 'User'}</div>
            <p className="text-xs text-muted-foreground">Your role</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Courses</CardTitle>
              <Link to="/courses">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Your recently accessed courses</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : courses?.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapters?.length || 0} chapters
                      </p>
                    </div>
                    <Link to={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No courses found
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/courses/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
            <Link to="/courses" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
            <Link to="/exams" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Exams
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
