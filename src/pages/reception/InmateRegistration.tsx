
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { receptionApi } from '@/lib/api';
import { DashboardShell } from '@/components/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Check, Home, LogOut, Plus, UserPlus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const offenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  court: z.string().min(1, 'Court is required'),
  conviction_status: z.enum(['convicted', 'unconvicted']),
  
  // Optional fields depending on conviction status
  sentence: z.string().optional(),
  edr_with_restitution: z.string().optional(),
  edr_without_restitution: z.string().optional(),
  restitution_amount: z.string().optional(),
  restitution_date: z.string().optional(),
  next_court_date: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  dob: z.string().min(1, {
    message: 'Date of birth is required.',
  }),
  gender: z.string().min(1, {
    message: 'Gender is required.',
  }),
  nationality: z.string().min(1, {
    message: 'Nationality is required.',
  }),
  address: z.string().min(1, {
    message: 'Address is required.',
  }),
  emergency_contact: z.string().min(1, {
    message: 'Emergency contact is required.',
  }),
  offense: z.string().min(1, {
    message: 'Primary offense is required.',
  }),
  classification: z.enum(['A', 'B', 'C', 'D', 'PUSOD', 'CONDEM'], {
    message: 'Classification is required.',
  }),
  offenses: z.array(offenseSchema).min(1, {
    message: 'At least one offense must be added.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

type OffenseFormValues = z.infer<typeof offenseSchema>;

const InmateRegistration = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offenses, setOffenses] = useState<OffenseFormValues[]>([]);
  const [currentOffense, setCurrentOffense] = useState<OffenseFormValues>({
    description: '',
    court: '',
    conviction_status: 'unconvicted',
    sentence: '',
    edr_with_restitution: '',
    edr_without_restitution: '',
    restitution_amount: '',
    restitution_date: '',
    next_court_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: '',
      gender: '',
      nationality: '',
      address: '',
      emergency_contact: '',
      offense: '',
      classification: 'D', // Default to lowest classification
      offenses: [],
    },
  });

  const handleOffenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOffense(prev => ({ ...prev, [name]: value }));
  };

  const handleOffenseSelectChange = (field: string, value: string) => {
    setCurrentOffense(prev => ({ ...prev, [field]: value }));
  };

  const addOffense = () => {
    // Basic validation
    if (!currentOffense.description || !currentOffense.court) {
      toast({
        title: 'Error',
        description: 'Please complete the offense details',
        variant: 'destructive',
      });
      return;
    }

    if (
      currentOffense.conviction_status === 'convicted' && !currentOffense.sentence
    ) {
      toast({
        title: 'Error',
        description: 'Please provide sentence details for convicted offense',
        variant: 'destructive',
      });
      return;
    }

    if (
      currentOffense.conviction_status === 'unconvicted' && !currentOffense.next_court_date
    ) {
      toast({
        title: 'Error',
        description: 'Please provide next court date for unconvicted offense',
        variant: 'destructive',
      });
      return;
    }

    // Add the offense to the list
    const newOffenses = [...offenses, currentOffense];
    setOffenses(newOffenses);
    form.setValue('offenses', newOffenses);
    
    // Clear the form for next offense
    setCurrentOffense({
      description: '',
      court: '',
      conviction_status: 'unconvicted',
      sentence: '',
      edr_with_restitution: '',
      edr_without_restitution: '',
      restitution_amount: '',
      restitution_date: '',
      next_court_date: '',
    });

    toast({
      title: 'Offense Added',
      description: 'The offense has been added to the registration',
    });
  };

  const removeOffense = (index: number) => {
    const newOffenses = [...offenses];
    newOffenses.splice(index, 1);
    setOffenses(newOffenses);
    form.setValue('offenses', newOffenses);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ensure the primary offense is set to the first offense description if not explicitly set
      if (!data.offense && data.offenses.length > 0) {
        data.offense = data.offenses[0].description;
      }
      
      const response = await receptionApi.registerInmate(data);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: 'Registration Successful',
        description: 'The inmate has been registered and is pending approval.',
      });
      
      setTimeout(() => {
        navigate('/reception');
      }, 1500);
      
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardShell
      title="Register New Inmate"
      description="Enter inmate details for initial registration"
      user={{ name: 'Reception Officer', role: 'Reception Department' }}
      onLogout={handleLogout}
      navItems={[
        { icon: <Home size={20} />, label: 'Dashboard', href: '/reception' },
        { icon: <Plus size={20} />, label: 'Register Inmate', href: '/reception/register' },
        { icon: <Users size={20} />, label: 'Inmate Records', href: '/reception/inmates' },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Enter the inmate's basic personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter nationality" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter home address" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Name and phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Offenses and Classification</CardTitle>
                <CardDescription>
                  Record offense details and inmate classification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Classification</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">Class A</SelectItem>
                          <SelectItem value="B">Class B</SelectItem>
                          <SelectItem value="C">Class C</SelectItem>
                          <SelectItem value="D">Class D</SelectItem>
                          <SelectItem value="PUSOD">PUSOD</SelectItem>
                          <SelectItem value="CONDEM">CONDEM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Initial classification based on offense severity and risk assessment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Offense Record</h3>
                  
                  {/* List of already added offenses */}
                  {offenses.length > 0 && (
                    <div className="mb-6 border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted text-left">
                            <th className="p-2 text-sm font-medium">Description</th>
                            <th className="p-2 text-sm font-medium">Court</th>
                            <th className="p-2 text-sm font-medium">Status</th>
                            <th className="p-2 text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offenses.map((offense, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2 text-sm">{offense.description}</td>
                              <td className="p-2 text-sm">{offense.court}</td>
                              <td className="p-2 text-sm capitalize">{offense.conviction_status}</td>
                              <td className="p-2 text-sm">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeOffense(index)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Add new offense form */}
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-4 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Offense
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <FormLabel htmlFor="description">Offense Description</FormLabel>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe the offense"
                          value={currentOffense.description}
                          onChange={handleOffenseInputChange}
                          className="resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormLabel htmlFor="court">Court</FormLabel>
                        <Input
                          id="court"
                          name="court"
                          placeholder="Name of court"
                          value={currentOffense.court}
                          onChange={handleOffenseInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <FormLabel htmlFor="conviction_status">Conviction Status</FormLabel>
                      <Select 
                        value={currentOffense.conviction_status}
                        onValueChange={(value) => handleOffenseSelectChange('conviction_status', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="convicted">Convicted</SelectItem>
                          <SelectItem value="unconvicted">Unconvicted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Conditional fields based on conviction status */}
                    {currentOffense.conviction_status === 'convicted' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel htmlFor="sentence">Sentence</FormLabel>
                            <Input
                              id="sentence"
                              name="sentence"
                              placeholder="e.g., 5 years imprisonment"
                              value={currentOffense.sentence}
                              onChange={handleOffenseInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel htmlFor="edr_without_restitution">EDR without Restitution</FormLabel>
                            <Input
                              id="edr_without_restitution"
                              name="edr_without_restitution"
                              type="date"
                              value={currentOffense.edr_without_restitution}
                              onChange={handleOffenseInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="space-y-2">
                            <FormLabel htmlFor="restitution_amount">Restitution Amount ($)</FormLabel>
                            <Input
                              id="restitution_amount"
                              name="restitution_amount"
                              type="number"
                              placeholder="0.00"
                              value={currentOffense.restitution_amount}
                              onChange={handleOffenseInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel htmlFor="restitution_date">Restitution Date</FormLabel>
                            <Input
                              id="restitution_date"
                              name="restitution_date"
                              type="date"
                              value={currentOffense.restitution_date}
                              onChange={handleOffenseInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel htmlFor="edr_with_restitution">EDR with Restitution</FormLabel>
                            <Input
                              id="edr_with_restitution"
                              name="edr_with_restitution"
                              type="date"
                              value={currentOffense.edr_with_restitution}
                              onChange={handleOffenseInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FormLabel htmlFor="next_court_date">Next Court Date</FormLabel>
                        <Input
                          id="next_court_date"
                          name="next_court_date"
                          type="date"
                          value={currentOffense.next_court_date}
                          onChange={handleOffenseInputChange}
                        />
                      </div>
                    )}
                    
                    <Button 
                      type="button"
                      className="mt-4"
                      onClick={addOffense}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Offense
                    </Button>
                  </div>
                  
                  {form.formState.errors.offenses && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.offenses.message}
                    </p>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="offense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Offense (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Main offense if different from the list" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to use the first offense from the list as primary
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/reception')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Inmate
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
};

export default InmateRegistration;
