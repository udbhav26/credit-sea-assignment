
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const AdminPanel = () => {
  const { currentUser, addAdmin, removeAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // State to store admin users
  const [admins, setAdmins] = useState<User[]>([]);

  // Fetch all admin users
  useEffect(() => {
    // For demonstration purposes, we'll use mock data
    if (currentUser?.role === 'admin') {
      // Get all existing users that are admins
      const storedUsers = localStorage.getItem('users');
      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // If no stored users, use the currentUser as the only admin
      if (!parsedUsers.length) {
        setAdmins(currentUser ? [currentUser] : []);
      } else {
        // Filter users with admin role
        const adminUsers = parsedUsers.filter((user: User) => user.role === 'admin');
        setAdmins(adminUsers);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // Redirect if not admin
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('Access denied: Only administrators can access this page');
      navigate('/');
    } else if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admins can add other admins');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newAdmin = await addAdmin(values.name, values.email, values.password);
      
      // Add the new admin to our state to update the UI
      setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
      
      form.reset();
      toast.success(`Admin ${values.name} added successfully!`);
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error((error as Error).message || 'Failed to add admin');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveAdmin = async (id: string, name: string) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Only admins can remove admins');
      return;
    }
    
    if (id === currentUser.id) {
      toast.error('You cannot remove yourself');
      return;
    }
    
    try {
      await removeAdmin(id);
      
      // Update admin list immediately
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== id));
      
      toast.success(`Admin ${name} removed successfully`);
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error((error as Error).message || 'Failed to remove admin');
    }
  };

  // Redirect if not admin
  if (currentUser?.role !== 'admin') {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2" /> Admin Management
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Admin Form */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <PlusCircle size={20} className="mr-2" />
                Add New Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Admin'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin List */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Current Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admins.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No administrators found</p>
                ) : (
                  admins.map((admin) => (
                    <div 
                      key={admin.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3"
                    >
                      <div className="flex items-center w-full sm:w-auto">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="overflow-hidden">
                          <h3 className="font-medium">{admin.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center w-full sm:w-auto"
                        onClick={() => handleRemoveAdmin(admin.id, admin.name)}
                        disabled={admin.id === currentUser?.id}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
