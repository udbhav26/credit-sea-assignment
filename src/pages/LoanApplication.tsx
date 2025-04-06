
import { useAuth } from '@/contexts/AuthContext';
import { LoanApplicationForm } from '@/components/loans/LoanApplicationForm';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const LoanApplication = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Apply for a Loan</h1>
      <LoanApplicationForm />
    </div>
  );
};

export default LoanApplication;
