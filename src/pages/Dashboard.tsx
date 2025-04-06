
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoan } from '@/contexts/LoanContext';
import { 
  Users, 
  UserRound, 
  DollarSign, 
  ArrowUpRight,
  PiggyBank,
  Repeat,
  Building2
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoanTable } from '@/components/dashboard/LoanTable';
import { LoanChart } from '@/components/dashboard/LoanChart';
import { RecoveryRateCard } from '@/components/dashboard/RecoveryRateCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    loans, 
    dashboardStats, 
    chartData, 
    verifyLoan, 
    approveLoan 
  } = useLoan();
  const [role, setRole] = useState<string>('user');
  
  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
    }
  }, [currentUser]);
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const handleVerifyLoan = async (loanId: string, isApproved: boolean) => {
    try {
      await verifyLoan(loanId, isApproved);
    } catch (error) {
      console.error('Error verifying loan:', error);
    }
  };
  
  const handleApproveLoan = async (loanId: string, isApproved: boolean) => {
    try {
      await approveLoan(loanId, isApproved);
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<Users size={24} />}
          title="ACTIVE USERS"
          value={formatNumber(dashboardStats.activeUsers)}
        />
        <StatCard 
          icon={<UserRound size={24} />}
          title="BORROWERS"
          value={formatNumber(dashboardStats.borrowers)}
        />
        <StatCard 
          icon={<DollarSign size={24} />}
          title="CASH DISBURSED"
          value={formatNumber(dashboardStats.cashDisbursed)}
        />
        <StatCard 
          icon={<ArrowUpRight size={24} />}
          title="CASH RECEIVED"
          value={formatNumber(dashboardStats.cashReceived)}
        />
      </div>
      
      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<PiggyBank size={24} />}
          title="SAVINGS"
          value={formatNumber(dashboardStats.savings)}
        />
        <StatCard 
          icon={<Repeat size={24} />}
          title="REPAID LOANS"
          value={formatNumber(dashboardStats.repaidLoans)}
        />
        <StatCard 
          icon={<Building2 size={24} />}
          title="OTHER ACCOUNTS"
          value={formatNumber(dashboardStats.otherAccounts)}
        />
        <StatCard 
          icon={<DollarSign size={24} />}
          title="LOANS"
          value={formatNumber(dashboardStats.totalLoans)}
        />
      </div>
      
      {/* Loans Table */}
      <div className="mb-6">
        <LoanTable 
          loans={loans} 
          onVerify={role === 'verifier' || role === 'admin' ? handleVerifyLoan : undefined}
          onApprove={role === 'admin' ? handleApproveLoan : undefined}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LoanChart 
          title="Loans Released Monthly" 
          data={chartData.loansReleasedMonthly} 
          color="#4CAF50" 
          type="area" 
        />
        <LoanChart 
          title="Total Outstanding Open Loans - Monthly" 
          data={chartData.outstandingLoansMonthly} 
          color="#2196F3" 
          type="bar" 
          barColor="#2196F3"
        />
      </div>
      
      {/* Recovery Rate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecoveryRateCard 
          title="Rate of Recovery (Open, Fully Paid, Default Loans)" 
          rate={chartData.recoveryRateClosed} 
          description="Percentage of the loan amount that is paid for all loans over time" 
          className="bg-orange-500" 
        />
        <RecoveryRateCard 
          title="Rate of Recovery (Open Loans)" 
          rate={chartData.recoveryRateOpen} 
          description="Percentage of the due amount that is paid for open loans until today" 
          className="bg-green-500" 
        />
      </div>
      
      {/* Repayments Chart */}
      <div className="mb-6">
        <LoanChart 
          title="Number of Repayments Collected - Monthly" 
          data={chartData.repaymentsCollectedMonthly} 
          color="#F44336" 
          type="bar" 
          barColor="#F44336"
        />
      </div>
    </div>
  );
};

export default Dashboard;
