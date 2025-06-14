
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const AuthModal = ({ isOpen, onClose, mode, setMode, setIsAuthenticated }: AuthModalProps) => {
  const { user } = useAuth();

  // Redirect to auth page instead of modal
  if (isOpen && !user) {
    return <Navigate to="/auth" replace />;
  }

  return null;
};
