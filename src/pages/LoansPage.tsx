
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoan, LoanApplication } from '@/contexts/LoanContext';
import { LoanTable } from '@/components/dashboard/LoanTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const LoansPage = () => {
  const { currentUser } = useAuth();
  const { 
    loans, 
    getUserLoans, 
    getPendingLoans, 
    getVerifiedLoans, 
    verifyLoan, 
    approveLoan 
  } = useLoan();
  
  const [displayLoans, setDisplayLoans] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!currentUser) return;
    
    let loansToDisplay: LoanApplication[];
    
    if (currentUser.role === 'admin') {
      // Admin sees all loans
      loansToDisplay = loans;
    } else if (currentUser.role === 'verifier') {
      // Verifier sees pending loans to verify
      loansToDisplay = getPendingLoans();
    } else {
      // Regular user sees their own loans
      loansToDisplay = getUserLoans(currentUser.id);
    }
    
    setDisplayLoans(loansToDisplay);
  }, [currentUser, loans, getUserLoans, getPendingLoans, getVerifiedLoans]);
  
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter loans based on search term
  const filteredLoans = displayLoans.filter(loan => 
    loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loans</h1>
        
        {currentUser?.role === 'user' && (
          <Button asChild className="bg-app-green hover:bg-green-700">
            <Link to="/apply">Apply for a Loan</Link>
          </Button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search for loans..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              Sort
            </Button>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <LoanTable 
          loans={filteredLoans} 
          title="Applied Loans"
          onVerify={currentUser?.role === 'verifier' || currentUser?.role === 'admin' ? handleVerifyLoan : undefined}
          onApprove={currentUser?.role === 'admin' ? handleApproveLoan : undefined}
        />
      </div>
    </div>
  );
};

export default LoansPage;
