
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
    <header className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-app-green mr-4 lg:hidden"
        >
          <MenuIcon size={24} />
        </button>
        <Link to="/" className="text-app-green font-bold text-xl">CREDIT APP</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-app-green relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="text-app-green relative">
          <MessageSquare size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          {currentUser && (
            <div className="flex items-center">
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=0D6832&color=fff`} 
                alt={currentUser.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="flex items-center">
                <span className="text-app-green font-medium mr-1">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
                <ChevronDown size={16} className="text-app-green" />
              </div>
            </div>
          )}
          
          {!currentUser && (
            <Button asChild variant="outline" className="ml-2">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
