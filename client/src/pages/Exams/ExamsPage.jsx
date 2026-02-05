import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '@/hooks';
import { examService } from '@/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { FileText, Plus, ChevronRight } from 'lucide-react';

export function ExamsPage() {
  const { courses, loading: coursesLoading } = useCourses({ limit: 100 });
  const [examsByCourse, setExamsByCourse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExams() {
      if (!courses?.length) {
        setLoading(false);
        return;
      }

      const examsMap = {};
      for (const course of courses) {
        try {
          const response = await examService.getAllByCourse(course.id);
          if (response.success && response.data.exams?.length) {
            examsMap[course.id] = {
              course,
              exams: response.data.exams,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch exams for course ${course.id}`, err);
        }
      }
      setExamsByCourse(examsMap);
      setLoading(false);
    }

    if (!coursesLoading) {
      fetchExams();
    }
  }, [courses, coursesLoading]);

  const allExams = Object.values(examsByCourse).flatMap(({ course, exams }) =>
    exams.map(exam => ({ ...exam, course }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exams</h1>
          <p className="text-muted-foreground">View and manage generated exams</p>
        </div>
      </div>

      {loading || coursesLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : allExams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allExams.map((exam) => (
            <Link key={exam.id} to={`/exams/${exam.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {exam.course?.name || 'Unknown Course'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{exam.total_questions || 0} questions</span>
                    <span>{exam.created_at || exam.createdAt ? new Date(exam.created_at || exam.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No exams yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first exam from a course
            </p>
            <Link to="/courses">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Go to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {courses?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Exam</CardTitle>
            <CardDescription>Select a course to generate an exam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}/exams/new`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{course.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ExamsPage;
