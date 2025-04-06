
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Loan status types
export type LoanStatus = 'pending' | 'verified' | 'approved' | 'rejected';

// Loan application interface
export interface LoanApplication {
  id: string;
  userId: string;
  userName: string;
  loanOfficer: string;
  amount: number;
  purpose: string;
  status: LoanStatus;
  dateApplied: string;
  timeApplied: string;
  verifiedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  activeUsers: number;
  borrowers: number;
  cashDisbursed: number;
  cashReceived: number;
  savings: number;
  repaidLoans: number;
  otherAccounts: number;
  totalLoans: number;
}

// Chart data interface
export interface ChartData {
  loansReleasedMonthly: number[];
  outstandingLoansMonthly: number[];
  repaymentsCollectedMonthly: number[];
  recoveryRateOpen: number;
  recoveryRateClosed: number;
}

// Loan context interface
interface LoanContextType {
  loans: LoanApplication[];
  dashboardStats: DashboardStats;
  chartData: ChartData;
  applyForLoan: (amount: number, purpose: string) => Promise<void>;
  verifyLoan: (loanId: string, isApproved: boolean, notes?: string) => Promise<void>;
  approveLoan: (loanId: string, isApproved: boolean, notes?: string) => Promise<void>;
  getUserLoans: (userId: string) => LoanApplication[];
  getPendingLoans: () => LoanApplication[];
  getVerifiedLoans: () => LoanApplication[];
  isLoading: boolean;
}

// Mock loans for demo purposes
const generateMockLoans = (): LoanApplication[] => {
  const statuses: LoanStatus[] = ['pending', 'verified', 'approved', 'rejected'];
  const mockLoans: LoanApplication[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    mockLoans.push({
      id: i.toString(),
      userId: (Math.floor(Math.random() * 3) + 1).toString(),
      userName: 'John Okoh',
      loanOfficer: 'John Okoh',
      amount: Math.floor(Math.random() * 100000) * 500,
      purpose: ['Net Debt Set', 'Not Debt Net', 'Loan Fully Repaid'].at(Math.floor(Math.random() * 3)) || 'Net Debt Set',
      status: randomStatus,
      dateApplied: `June 0${Math.floor(Math.random() * 9) + 1}, 2021`,
      timeApplied: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 6)}0 PM`,
    });
  }
  
  return mockLoans;
};

// Create the loan context
const LoanContext = createContext<LoanContextType | undefined>(undefined);

// Loan provider component
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>(generateMockLoans());
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock dashboard stats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUsers: 200,
    borrowers: 100,
    cashDisbursed: 550000,
    cashReceived: 1000000,
    savings: 450000,
    repaidLoans: 30,
    otherAccounts: 10,
    totalLoans: 50
  });
  
  // Mock chart data
  const [chartData, setChartData] = useState<ChartData>({
    loansReleasedMonthly: [500, 300, 200, 700, 200, 300, 400, 100, 50, 600, 400, 1000],
    outstandingLoansMonthly: [50, 500, 600, 900, 100, 450, 200, 900, 550, 100, 450, 350],
    repaymentsCollectedMonthly: [0.5, 5, 6, 9, 1, 4.5, 2, 9, 5.5, 1, 4, 3],
    recoveryRateOpen: 35,
    recoveryRateClosed: 45
  });
  
  // Function to apply for a loan
  const applyForLoan = async (amount: number, purpose: string) => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to apply for a loan');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      const newLoan: LoanApplication = {
        id: (loans.length + 1).toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        loanOfficer: 'John Okoh',
        amount,
        purpose,
        status: 'pending',
        dateApplied: dateString,
        timeApplied: timeString,
      };
      
      setLoans([newLoan, ...loans]);
      
      // Update stats
      setDashboardStats({
        ...dashboardStats,
        totalLoans: dashboardStats.totalLoans + 1,
      });
      
      toast.success('Loan application submitted successfully!');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to apply for loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to verify a loan (for verifiers)
  const verifyLoan = async (loanId: string, isApproved: boolean, notes?: string) => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to verify a loan');
      }
      
      if (currentUser.role !== 'verifier' && currentUser.role !== 'admin') {
        throw new Error('Only verifiers can verify loans');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoans(loans.map(loan => 
        loan.id === loanId 
          ? {
              ...loan,
              status: isApproved ? 'verified' : 'rejected',
              verifiedBy: currentUser.name,
              notes: notes || loan.notes,
            }
          : loan
      ));
      
      toast.success(`Loan ${isApproved ? 'verified' : 'rejected'} successfully!`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to verify loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to approve or reject a loan (for admins)
  const approveLoan = async (loanId: string, isApproved: boolean, notes?: string) => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to approve a loan');
      }
      
      if (currentUser.role !== 'admin') {
        throw new Error('Only admins can approve loans');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoans(loans.map(loan => 
        loan.id === loanId 
          ? {
              ...loan,
              status: isApproved ? 'approved' : 'rejected',
              approvedBy: isApproved ? currentUser.name : undefined,
              rejectedBy: !isApproved ? currentUser.name : undefined,
              notes: notes || loan.notes,
            }
          : loan
      ));
      
      // Update stats
      if (isApproved) {
        const loanAmount = loans.find(loan => loan.id === loanId)?.amount || 0;
        setDashboardStats({
          ...dashboardStats,
          cashDisbursed: dashboardStats.cashDisbursed + loanAmount,
          borrowers: dashboardStats.borrowers + 1,
        });
      }
      
      toast.success(`Loan ${isApproved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to process loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get loans for a specific user
  const getUserLoans = (userId: string) => {
    return loans.filter(loan => loan.userId === userId);
  };
  
  // Get all pending loans
  const getPendingLoans = () => {
    return loans.filter(loan => loan.status === 'pending');
  };
  
  // Get all verified loans
  const getVerifiedLoans = () => {
    return loans.filter(loan => loan.status === 'verified');
  };
  
  // Context value
  const value = {
    loans,
    dashboardStats,
    chartData,
    applyForLoan,
    verifyLoan,
    approveLoan,
    getUserLoans,
    getPendingLoans,
    getVerifiedLoans,
    isLoading,
  };
  
  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

// Hook to use the loan context
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};
