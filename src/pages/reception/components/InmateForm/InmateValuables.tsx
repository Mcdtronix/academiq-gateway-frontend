
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormValues } from './index';
import { Textarea } from '@/components/ui/textarea';
import { 'baggage-claim' as BaggageClaim } from 'lucide-react';

interface InmateValuablesProps {
  form: UseFormReturn<FormValues>;
}

const InmateValuables: React.FC<InmateValuablesProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <BaggageClaim className="mr-2 h-5 w-5" />
          <CardTitle>Inmate Valuables</CardTitle>
        </div>
        <CardDescription>
          Record items in the inmate's possession
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="inmateValuables.bagNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bag Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bag number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inmateValuables.cash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cash</FormLabel>
                <FormControl>
                  <Input placeholder="Amount of cash" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Clothing Items</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <FormField
              control={form.control}
              name="inmateValuables.tShirt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>T-Shirts</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.shorts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shorts</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.belt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Belts</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.shoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoes</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.socks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Socks</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.jersey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jerseys</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inmateValuables.wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallets</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="inmateValuables.others"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Other Items</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List any other items not mentioned above"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default InmateValuables;
