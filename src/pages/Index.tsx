
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();

  // Redirect to dashboard if logged in, or login if not
  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [isLoading, navigate, currentUser]);

  return null;
};

export default Index;
