
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
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
import { PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const AdminPanel = () => {
  const { currentUser, addAdmin, removeAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock admin list for demo
  const [admins] = useState([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D6832&color=fff',
    },
    {
      id: '4',
      name: 'Jane Doe',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=0D6832&color=fff',
    },
    {
      id: '5',
      name: 'Mark Smith',
      email: 'mark@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Mark+Smith&background=0D6832&color=fff',
    },
  ]);

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
      await addAdmin(values.name, values.email, values.password);
      form.reset();
      toast.success(`Admin ${values.name} added successfully!`);
    } catch (error) {
      console.error('Error adding admin:', error);
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
      toast.success(`Admin ${name} removed successfully`);
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };

  // Redirect if not admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          Only administrators can access this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Admin Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PlusCircle size={20} className="mr-2" />
              Add New Admin
            </h2>
            
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
                  className="w-full bg-app-green hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Admin'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Admin List */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Current Administrators</h2>
            
            <div className="space-y-4">
              {admins.map((admin) => (
                <div 
                  key={admin.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{admin.name}</h3>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleRemoveAdmin(admin.id, admin.name)}
                    disabled={admin.id === currentUser?.id}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
