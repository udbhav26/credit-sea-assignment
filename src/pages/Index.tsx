
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();

  // Redirect to dashboard
  useEffect(() => {
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  return null;
};

export default Index;
