
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  FileText,
  Repeat,
  Sliders,
  Calculator,
  Book,
  AlignJustify,
  PiggyBank,
  Building2,
  CreditCard,
  BarChart,
  LogOut,
  Settings,
  Calendar,
  Clipboard,
  BadgeDollarSign,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  // Define navigation items
  const navItems = [
    { 
      path: "/", 
      name: "Dashboard", 
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "verifier", "user"] 
    },
    { 
      path: "/borrowers", 
      name: "Borrowers", 
      icon: <Users size={20} />,
      roles: ["admin", "verifier"] 
    },
    { 
      path: "/loans", 
      name: "Loans", 
      icon: <FileText size={20} />,
      roles: ["admin", "verifier", "user"] 
    },
    { 
      path: "/repayments", 
      name: "Repayments", 
      icon: <Repeat size={20} />,
      roles: ["admin", "verifier"] 
    },
    { 
      path: "/parameters", 
      name: "Loan Parameters", 
      icon: <Sliders size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/accounting", 
      name: "Accounting", 
      icon: <Calculator size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/reports", 
      name: "Reports", 
      icon: <Book size={20} />,
      roles: ["admin", "verifier"] 
    },
    { 
      path: "/collateral", 
      name: "Collateral", 
      icon: <AlignJustify size={20} />,
      roles: ["admin", "verifier"] 
    },
    { 
      path: "/admin", 
      name: "Admin Management", 
      icon: <Shield size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/access", 
      name: "Access Configuration", 
      icon: <Users size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/savings", 
      name: "Savings", 
      icon: <PiggyBank size={20} />,
      roles: ["admin", "verifier", "user"] 
    },
    { 
      path: "/incomes", 
      name: "Other Incomes", 
      icon: <Building2 size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/payroll", 
      name: "Payroll", 
      icon: <BadgeDollarSign size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/expenses", 
      name: "Expenses", 
      icon: <CreditCard size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/signature", 
      name: "E-signature", 
      icon: <Clipboard size={20} />,
      roles: ["admin", "verifier", "user"] 
    },
    { 
      path: "/investor", 
      name: "Investor Accounts", 
      icon: <BarChart size={20} />,
      roles: ["admin"] 
    },
    { 
      path: "/calendar", 
      name: "Calendar", 
      icon: <Calendar size={20} />,
      roles: ["admin", "verifier"] 
    },
    { 
      path: "/settings", 
      name: "Settings", 
      icon: <Settings size={20} />,
      roles: ["admin"] 
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = currentUser
    ? navItems.filter(item => item.roles.includes(currentUser.role))
    : [];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-app-green transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Close button - Mobile only */}
        <div className="lg:hidden flex justify-end p-2">
          <button 
            onClick={onClose} 
            className="text-white hover:bg-green-700 p-2 rounded-full"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* User profile */}
        {currentUser && (
          <div className="px-4 py-3 sm:py-5 flex items-center">
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=d4d4d8&color=0D6832`}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full bg-yellow-400"
            />
            <div className="ml-3 text-white">
              <p className="font-medium text-sm sm:text-base truncate max-w-[160px]">{currentUser.name}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-2 sm:py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 sm:py-3 text-gray-100 hover:bg-green-700 transition-colors text-sm sm:text-base",
                    location.pathname === item.path && "bg-green-700 font-medium"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign out button */}
        {currentUser && (
          <div className="p-4 border-t border-green-700">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start text-white hover:bg-green-700 text-sm sm:text-base"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              <LogOut size={20} className="mr-3" />
              <span>Sign Out</span>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
