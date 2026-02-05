import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button } from '@/components/ui';
import { BookOpen, FileText, LogOut, User, Home } from 'lucide-react';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold">Course Exam</span>
          </Link>

          <nav className="flex items-center space-x-6 ml-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/courses" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Courses
                </Link>
                <Link to="/exams" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Exams
                </Link>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user?.full_name || user?.username}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
