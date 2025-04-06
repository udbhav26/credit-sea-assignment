
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const Dashboard = () => {
  const { currentUser } = useAuth();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {currentUser.role === 'user' && (
          <Button 
            onClick={() => navigate('/apply')}
            className="bg-green-600 hover:bg-green-700"
          >
            Apply for Loan <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Loan Amount" 
          value={`₦${loanData.total.toLocaleString()}`}
          icon={PieChart}
          color="blue"
        />
        <StatCard 
          title="Approved Loans" 
          value={`₦${loanData.approved.toLocaleString()}`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard 
          title="Rejected Loans" 
          value={`₦${loanData.rejected.toLocaleString()}`}
          icon={Ban}
          color="red"
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <LoanChart />
        </div>
        <RecoveryRateCard rate={loanData.recovery} />
      </div>

      <div>
        <LoanTable 
          onApprove={handleApprove} 
          onReject={handleReject} 
          isLoading={isLoading}
          userRole={currentUser.role}
        />
      </div>
    </div>
  );
};

export default Dashboard;
