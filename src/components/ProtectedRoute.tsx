import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { clearJustLoggedIn } from '../store/authSlice';
import LoginPage from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, justLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // After login, always redirect to main chat page to show empty state and chat history
  useEffect(() => {
    if (isAuthenticated && justLoggedIn) {
      // Clear the flag so this only happens once after login
      dispatch(clearJustLoggedIn());
      // Always navigate to /chat (not specific chat) after login
      if (location.pathname !== '/chat') {
        navigate('/chat', { replace: true });
      }
    }
  }, [isAuthenticated, justLoggedIn, location.pathname, navigate, dispatch]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
