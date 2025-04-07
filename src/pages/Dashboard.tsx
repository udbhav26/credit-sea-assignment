
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoan } from '@/contexts/LoanContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoanChart } from '@/components/dashboard/LoanChart';
import { RecoveryRateCard } from '@/components/dashboard/RecoveryRateCard';
import { LoanTable } from '@/components/dashboard/LoanTable';
import { Button } from '@/components/ui/button';
import { ArrowRight, Ban, CheckCircle, PieChart } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration
const loanData = {
  total: 2500000,
  approved: 1750000,
  rejected: 250000,
  pending: 500000,
  recovery: 85,
};

// Mock chart data
const monthlyLoanData = [500, 300, 200, 700, 200, 300, 400, 100, 50, 600, 400, 1000];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { loans } = useLoan();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Mock functions for loan actions
  const handleApprove = (loanId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Loan #${loanId} has been approved`);
    }, 1000);
  };

  const handleReject = (loanId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.error(`Loan #${loanId} has been rejected`);
    }, 1000);
  };

  // Different dashboard based on role
  if (!currentUser) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        {currentUser.role === 'user' && (
          <Button 
            onClick={() => navigate('/apply')}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            Apply for Loan <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard 
          title="Total Loan Amount" 
          value={`₦${loanData.total.toLocaleString()}`}
          icon={<PieChart className="h-6 w-6" />}
          className="bg-blue-100"
        />
        <StatCard 
          title="Approved Loans" 
          value={`₦${loanData.approved.toLocaleString()}`}
          icon={<CheckCircle className="h-6 w-6" />}
          className="bg-green-100"
        />
        <StatCard 
          title="Rejected Loans" 
          value={`₦${loanData.rejected.toLocaleString()}`}
          icon={<Ban className="h-6 w-6" />}
          className="bg-red-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <LoanChart 
            title="Monthly Loan Disbursement" 
            data={monthlyLoanData} 
            color="#4CAF50" 
            type="area"
          />
        </div>
        <RecoveryRateCard 
          title="Recovery Rate" 
          rate={loanData.recovery} 
          description="Percentage of loans successfully recovered"
        />
      </div>

      <div>
        <LoanTable 
          loans={loans}
          onVerify={(loanId) => handleApprove(loanId)}
          onApprove={(loanId) => handleApprove(loanId)}
          title="Recent Loans"
        />
      </div>
    </div>
  );
};

export default Dashboard;
