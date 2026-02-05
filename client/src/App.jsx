import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context';
import { Layout, ProtectedRoute } from '@/components';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  CoursesPage,
  CourseDetailPage,
  CreateCoursePage,
  EditCoursePage,
  ChapterDetailPage,
  CreateChapterPage,
  EditChapterPage,
  QuestionDetailPage,
  CreateQuestionPage,
  EditQuestionPage,
  ExamsPage,
  ExamDetailPage,
  GenerateExamPage,
  EditExamPage,
  ProfilePage,
} from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="courses" element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            } />
            
            <Route path="courses/new" element={
              <ProtectedRoute>
                <CreateCoursePage />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:id" element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:id/edit" element={
              <ProtectedRoute>
                <EditCoursePage />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:courseId/chapters/new" element={
              <ProtectedRoute>
                <CreateChapterPage />
              </ProtectedRoute>
            } />
            
            <Route path="courses/:courseId/exams/new" element={
              <ProtectedRoute>
                <GenerateExamPage />
              </ProtectedRoute>
            } />
            
            <Route path="chapters/:id" element={
              <ProtectedRoute>
                <ChapterDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="chapters/:id/edit" element={
              <ProtectedRoute>
                <EditChapterPage />
              </ProtectedRoute>
            } />
            
            <Route path="chapters/:chapterId/questions/new" element={
              <ProtectedRoute>
                <CreateQuestionPage />
              </ProtectedRoute>
            } />
            
            <Route path="questions/:id" element={
              <ProtectedRoute>
                <QuestionDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="questions/:id/edit" element={
              <ProtectedRoute>
                <EditQuestionPage />
              </ProtectedRoute>
            } />
            
            <Route path="exams" element={
              <ProtectedRoute>
                <ExamsPage />
              </ProtectedRoute>
            } />
            
            <Route path="exams/:id" element={
              <ProtectedRoute>
                <ExamDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="exams/:id/edit" element={
              <ProtectedRoute>
                <EditExamPage />
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
