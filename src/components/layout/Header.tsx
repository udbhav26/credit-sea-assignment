
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  Menu as MenuIcon 
} from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex items-center justify-between py-2 sm:py-3 px-2 sm:px-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-app-green mr-2 sm:mr-4 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon size={24} />
        </button>
        <Link to="/" className="text-app-green font-bold text-base sm:text-xl truncate">CREDIT APP</Link>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="text-app-green relative p-1" aria-label="Notifications">
          <Bell size={18} className="sm:size-20" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="text-app-green relative p-1 hidden sm:block" aria-label="Messages">
          <MessageSquare size={18} className="sm:size-20" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          {currentUser && (
            <div className="flex items-center">
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=0D6832&color=fff`} 
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-2"
              />
              <div className="hidden sm:flex items-center">
                <span className="text-app-green font-medium mr-1 text-sm">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
                <ChevronDown size={16} className="text-app-green" />
              </div>
            </div>
          )}
          
          {!currentUser && (
            <Button asChild variant="outline" className="ml-2 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
