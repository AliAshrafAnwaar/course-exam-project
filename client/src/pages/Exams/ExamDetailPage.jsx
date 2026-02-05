import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useExam } from '@/hooks';
import { useAuth } from '@/context';
import { examService } from '@/services';
import { Card, CardHeader, CardTitle, CardContent, Button, Alert, AlertDescription } from '@/components/ui';
import { ArrowLeft, Trash2, Printer, CheckCircle, Edit } from 'lucide-react';

export function ExamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exam, loading, error } = useExam(id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  const isOwner = exam?.created_by === user?.id || user?.role?.name === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await examService.delete(id);
      navigate('/exams');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
        <Link to="/exams">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!exam) return null;

  const questions = exam.questions || [];

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center gap-4 print:hidden">
        <Link to="/exams">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>
        </Link>
      </div>

      {deleteError && (
        <Alert variant="destructive" className="print:hidden">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold print:text-2xl">{exam.name}</h1>
          <p className="text-muted-foreground mt-1">
            {exam.course?.name} • {questions.length} questions
          </p>
          <p className="text-sm text-muted-foreground">
            Generated on {exam.created_at || exam.createdAt ? new Date(exam.created_at || exam.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Link to={`/exams/${id}/edit`}>
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

      <div className="space-y-6 print:space-y-4">
        {questions.map((question, index) => {
          const choices = [question.choice_1, question.choice_2, question.choice_3].filter(Boolean);
          const correctAnswerIndex = question.correct_answer - 1;

          return (
            <Card key={question.id} className="print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {index + 1}. {question.question_text}
                </CardTitle>
                <div className="flex gap-2 text-xs print:hidden">
                  <span className={`px-2 py-0.5 rounded-full ${
                    question.difficulty === 'simple' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    question.objective === 'reminding' ? 'bg-blue-100 text-blue-800' :
                    question.objective === 'understanding' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {question.objective}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-muted">
                    Ch. {question.chapter?.chapterNumber || '?'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className={`flex items-center gap-3 p-2 rounded ${
                        showAnswers && choiceIndex === correctAnswerIndex
                          ? 'bg-green-50 border border-green-200'
                          : ''
                      }`}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full border text-sm">
                        {String.fromCharCode(65 + choiceIndex)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {showAnswers && choiceIndex === correctAnswerIndex && (
                        <CheckCircle className="h-4 w-4 text-green-600 print:hidden" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showAnswers && (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Answer Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {questions.map((question, index) => (
                <div key={question.id} className="text-center p-2 bg-muted rounded">
                  <div className="text-sm font-medium">{index + 1}</div>
                  <div className="text-lg font-bold text-primary">
                    {String.fromCharCode(64 + question.correct_answer)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ExamDetailPage;
