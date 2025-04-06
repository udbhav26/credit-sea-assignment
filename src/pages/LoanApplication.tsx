
import { useAuth } from '@/contexts/AuthContext';
import { LoanApplicationForm } from '@/components/loans/LoanApplicationForm';

const LoanApplication = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      {currentUser ? (
        <LoanApplicationForm />
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600">
            You need to be logged in to apply for a loan.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanApplication;
