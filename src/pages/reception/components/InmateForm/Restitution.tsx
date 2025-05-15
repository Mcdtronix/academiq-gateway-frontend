
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormValues } from './index';
import { DollarSign, Calendar } from 'lucide-react';

interface RestitutionProps {
  form: UseFormReturn<FormValues>;
}

const Restitution: React.FC<RestitutionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          <CardTitle>Restitution</CardTitle>
        </div>
        <CardDescription>
          Record restitution details if applicable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="restitution.offence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Offence</FormLabel>
              <FormControl>
                <Input placeholder="Offence requiring restitution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="restitution.restitutionAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restitution Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="restitution.restitutionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restitution Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="restitution.restitutionSentence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restitution Sentence</FormLabel>
              <FormControl>
                <Input placeholder="Sentence related to restitution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="restitution.restitutionStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restitution Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partially Paid</SelectItem>
                  <SelectItem value="paid">Fully Paid</SelectItem>
                  <SelectItem value="waived">Waived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5" />
          <h3 className="text-base font-medium">Release Date with Restitution</h3>
        </div>
        
        <FormField
          control={form.control}
          name="restitution.earliestDateOfReleaseWithRestitution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Earliest Date of Release with Restitution</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Date when inmate can be released if restitution is paid
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="restitution.restitutionReceipt"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Restitution Receipt</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Upload a copy of the restitution receipt if available
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default Restitution;
