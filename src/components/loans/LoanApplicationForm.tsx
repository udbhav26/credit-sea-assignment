
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoan } from '@/contexts/LoanContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: 'Amount must be a positive number' }
  ),
  purpose: z.string().min(3, 'Loan purpose is required'),
  term: z.string().min(1, 'Loan term is required'),
  collateral: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const LoanApplicationForm = () => {
  const { applyForLoan } = useLoan();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      purpose: '',
      term: '',
      collateral: '',
      additionalInfo: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await applyForLoan(parseFloat(values.amount), values.purpose);
      form.reset();
    } catch (error) {
      console.error('Loan application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">APPLY FOR A LOAN</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter loan amount"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the amount you wish to borrow
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Debt Consolidation, Business Expansion" {...field} />
                </FormControl>
                <FormDescription>
                  Briefly describe what the loan will be used for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Term</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3months">3 months</SelectItem>
                    <SelectItem value="6months">6 months</SelectItem>
                    <SelectItem value="12months">12 months</SelectItem>
                    <SelectItem value="24months">24 months</SelectItem>
                    <SelectItem value="36months">36 months</SelectItem>
                    <SelectItem value="60months">60 months</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the repayment period for your loan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="collateral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collateral (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Describe any collateral you're offering" {...field} />
                </FormControl>
                <FormDescription>
                  Providing collateral may improve your chances of approval
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional details about your loan request"
                    className="resize-none"
                    {...field}
                  />
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
            {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
