
import { useState } from 'react';
import { 
  MoreVertical, 
  ArrowUpDown, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LoanApplication } from '@/contexts/LoanContext';
import { useAuth } from '@/contexts/AuthContext';

interface LoanTableProps {
  loans: LoanApplication[];
  onVerify?: (loanId: string, isApproved: boolean) => void;
  onApprove?: (loanId: string, isApproved: boolean) => void;
  title?: string;
}

export const LoanTable = ({ loans, onVerify, onApprove, title = "Recent Loans" }: LoanTableProps) => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  
  // Calculate pagination
  const indexOfLastLoan = currentPage * rowsPerPage;
  const indexOfFirstLoan = indexOfLastLoan - rowsPerPage;
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan);
  const totalPages = Math.ceil(loans.length / rowsPerPage);
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let className = "px-3 py-1 rounded-full text-xs font-semibold text-white";
    
    switch(status.toLowerCase()) {
      case 'pending':
        className += " bg-app-yellow";
        break;
      case 'verified':
        className += " bg-green-500";
        break;
      case 'approved':
        className += " bg-app-blue";
        break;
      case 'rejected':
        className += " bg-app-red";
        break;
      default:
        className += " bg-gray-500";
    }
    
    return <span className={className}>{status.toUpperCase()}</span>;
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown size={16} className="mr-2" />
            Sort
          </Button>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">User details</th>
              <th className="px-4 py-3 text-left">Customer name</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentLoans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${loan.userName.replace(' ', '+')}&background=0D6832&color=fff`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{loan.purpose}</div>
                      <div className="text-xs text-gray-500">Updated {Math.floor(Math.random() * 3) + 1} day ago</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">{loan.userName}</div>
                  <div className="text-xs text-gray-500">ID: {loan.id}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">{loan.dateApplied}</div>
                  <div className="text-xs text-gray-500">{loan.timeApplied}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={loan.status} />
                  
                  {currentUser?.role === 'verifier' && loan.status === 'pending' && onVerify && (
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => onVerify(loan.id, true)}
                      >
                        <Check size={14} className="mr-1" /> Verify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => onVerify(loan.id, false)}
                      >
                        <X size={14} className="mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                  
                  {currentUser?.role === 'admin' && loan.status === 'verified' && onApprove && (
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => onApprove(loan.id, true)}
                      >
                        <Check size={14} className="mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => onApprove(loan.id, false)}
                      >
                        <X size={14} className="mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 flex items-center justify-between border-t">
        <div className="text-sm text-gray-500">
          Rows per page:{' '}
          <select
            className="ml-1 bg-transparent"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={10}>10</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-500">
          {indexOfFirstLoan + 1}-{Math.min(indexOfLastLoan, loans.length)} of {loans.length}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
