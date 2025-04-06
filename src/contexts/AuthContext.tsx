
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'admin' | 'verifier' | 'user';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  addAdmin: (name: string, email: string, password: string) => Promise<void>;
  removeAdmin: (id: string) => Promise<void>;
  isLoading: boolean;
}

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D6832&color=fff',
  },
  {
    id: '2',
    name: 'John Okoh',
    email: 'verifier@example.com',
    role: 'verifier',
    avatar: 'https://ui-avatars.com/api/?name=John+Okoh&background=0D6832&color=fff',
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=0D6832&color=fff',
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you would verify the password here
      // For demo purposes, we're just checking the email
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      toast.error((error as Error).message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out');
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D6832&color=fff`,
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      toast.success('Registration successful!');
    } catch (error) {
      toast.error((error as Error).message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add admin function (only for admins)
  const addAdmin = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Ensure current user is admin
      if (currentUser?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can add other admins');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already in use');
      }
      
      // Create new admin
      const newAdmin: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0D6832&color=fff`,
      };
      
      setUsers([...users, newAdmin]);
      toast.success(`Admin ${name} added successfully!`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add admin');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove admin function (only for admins)
  const removeAdmin = async (id: string) => {
    setIsLoading(true);
    try {
      // Ensure current user is admin
      if (currentUser?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can remove admins');
      }
      
      // Prevent removing self
      if (id === currentUser.id) {
        throw new Error('You cannot remove yourself as admin');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const adminToRemove = users.find(u => u.id === id && u.role === 'admin');
      
      if (!adminToRemove) {
        throw new Error('Admin not found');
      }
      
      setUsers(users.filter(u => u.id !== id));
      toast.success(`Admin ${adminToRemove.name} removed successfully`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to remove admin');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    register,
    addAdmin,
    removeAdmin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
