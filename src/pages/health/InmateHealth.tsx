
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { inmateApi, healthApi } from '@/lib/api';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Home, LogOut, ThermometerIcon, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the form schema
const formSchema = z.object({
  temperature: z.string().min(1, { message: 'Temperature is required' }),
  height: z.string().min(1, { message: 'Height is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  blood_pressure: z.string().min(1, { message: 'Blood pressure is required' }),
  health_status: z.string().min(1, { message: 'Health status is required' }),
  medical_conditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InmateHealth = () => {
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inmate, setInmate] = useState<any>(null);
  const [healthRecord, setHealthRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Common medical conditions for quick selection
  const commonConditions = [
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'asthma', label: 'Asthma' },
    { id: 'hiv', label: 'HIV/AIDS' },
    { id: 'tuberculosis', label: 'Tuberculosis' },
    { id: 'depression', label: 'Depression' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'epilepsy', label: 'Epilepsy' },
  ];
  
  // Common allergies for quick selection
  const commonAllergies = [
    { id: 'penicillin', label: 'Penicillin' },
    { id: 'sulfa', label: 'Sulfa Drugs' },
    { id: 'nsaids', label: 'NSAIDs' },
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'latex', label: 'Latex' },
  ];
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: '',
      height: '',
      weight: '',
      blood_pressure: '',
      health_status: 'healthy',
      medical_conditions: [],
      medications: [],
      allergies: [],
      notes: '',
    },
  });
  
  // Fetch inmate data and health record if it exists
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch inmate basic info
        const inmateResponse = await inmateApi.getInmateDetails(id);
        if (inmateResponse.data) {
          setInmate(inmateResponse.data);
        }
        
        // Fetch health record if it exists
        const healthResponse = await healthApi.getInmateHealthRecord(id);
        if (healthResponse.data) {
          const healthData = healthResponse.data;
          setHealthRecord(healthData);
          
          // Set form values from existing record
          form.reset({
            temperature: healthData.temperature || '',
            height: healthData.height || '',
            weight: healthData.weight || '',
            blood_pressure: healthData.blood_pressure || '',
            health_status: healthData.health_status || 'healthy',
            medical_conditions: healthData.medical_conditions || [],
            medications: healthData.medications || [],
            allergies: healthData.allergies || [],
            notes: healthData.notes || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch inmate information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, form, toast]);
  
  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      let response;
      
      if (healthRecord) {
        // Update existing record
        response = await healthApi.updateHealthRecord(id, data);
      } else {
        // Create new record
        response = await healthApi.createHealthRecord(id, data);
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: 'Success',
        description: healthRecord
          ? 'Health record updated successfully'
          : 'Health record created successfully',
      });
      
      // Set or update the health record state
      setHealthRecord(response.data);
      
    } catch (error) {
      console.error('Error saving health record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save health record',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Define navigation items
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/health' },
    { icon: <Users size={20} />, label: 'Inmates', href: '/health/inmates' },
    { icon: <FileText size={20} />, label: 'OPD Records', href: '/health/opd' },
    { icon: <ThermometerIcon size={20} />, label: 'Check-ups', href: '/health/checkups' },
  ];
  
  if (isLoading) {
    return (
      <DashboardShell
        title="Inmate Health Record"
        description="Loading..."
        user={{ name: 'Health Officer', role: 'Health Department' }}
        onLogout={handleLogout}
        navItems={navItems}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mx-auto mb-4"></div>
            <p>Loading inmate information...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }
  
  if (!inmate) {
    return (
      <DashboardShell
        title="Inmate Health Record"
        description="Inmate not found"
        user={{ name: 'Health Officer', role: 'Health Department' }}
        onLogout={handleLogout}
        navItems={navItems}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-4 text-muted-foreground">The requested inmate could not be found.</p>
            <Button onClick={() => navigate('/health')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }
  
  return (
    <DashboardShell
      title={`Health Record: ${inmate.name}`}
      description={`Prison Number: ${inmate.prison_number}`}
      user={{ name: 'Health Officer', role: 'Health Department' }}
      onLogout={handleLogout}
      navItems={navItems}
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                {inmate.photo_url ? (
                  <img 
                    src={inmate.photo_url} 
                    alt={inmate.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F1F0FB]">
                    <User className="h-12 w-12 text-[#7E69AB]" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">{inmate.name}</CardTitle>
              <CardDescription>
                Prison Number: {inmate.prison_number}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Age:</span>
                  <span className="text-sm">{inmate.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Gender:</span>
                  <span className="text-sm">{inmate.gender}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Admission Date:</span>
                  <span className="text-sm">{new Date(inmate.admission_date).toLocaleDateString()}</span>
                </div>
                
                <div className="mt-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/health/inmate/${id}/opd/new`)}
                  >
                    Record OPD Visit
                  </Button>
                  
                  <Button 
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => navigate(`/inmates/${id}`)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {healthRecord ? 'Update Health Record' : 'Create Health Record'}
              </CardTitle>
              <CardDescription>
                {healthRecord
                  ? 'Update the health information for this inmate'
                  : 'Record initial health information for this inmate'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 98.6°F" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="blood_pressure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Pressure</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 120/80 mmHg" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 5'10\" or 178 cm" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 160 lbs or 72.5 kg" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="health_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Health Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthy">Healthy</SelectItem>
                            <SelectItem value="stable">Stable with Conditions</SelectItem>
                            <SelectItem value="requires_monitoring">Requires Monitoring</SelectItem>
                            <SelectItem value="requires_treatment">Requires Treatment</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Assessment of the inmate's overall health condition
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <div>
                    <FormLabel className="text-base">Medical Conditions</FormLabel>
                    <FormDescription className="mt-1 mb-3">
                      Select any diagnosed medical conditions
                    </FormDescription>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {commonConditions.map((condition) => (
                        <FormField
                          key={condition.id}
                          control={form.control}
                          name="medical_conditions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={condition.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(condition.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            condition.label,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== condition.label
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {condition.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    
                    <FormLabel className="text-base">Other Medical Conditions</FormLabel>
                    <FormField
                      control={form.control}
                      name="medical_conditions"
                      render={({ field }) => (
                        <FormItem className="mt-1">
                          <FormControl>
                            <Input
                              placeholder="Type additional condition and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  e.preventDefault();
                                  const value = e.currentTarget.value.trim();
                                  if (value) {
                                    field.onChange([...(field.value || []), value]);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Current conditions: {(field.value || []).join(', ') || 'None'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <FormLabel className="text-base">Allergies</FormLabel>
                    <FormDescription className="mt-1 mb-3">
                      Select any known allergies
                    </FormDescription>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {commonAllergies.map((allergy) => (
                        <FormField
                          key={allergy.id}
                          control={form.control}
                          name="allergies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={allergy.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(allergy.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            allergy.label,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== allergy.label
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {allergy.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    
                    <FormLabel className="text-base">Other Allergies</FormLabel>
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem className="mt-1">
                          <FormControl>
                            <Input
                              placeholder="Type additional allergy and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  e.preventDefault();
                                  const value = e.currentTarget.value.trim();
                                  if (value) {
                                    field.onChange([...(field.value || []), value]);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Current allergies: {(field.value || []).join(', ') || 'None'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Current Medications</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type medication and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (value) {
                                  field.onChange([...(field.value || []), value]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Current medications: {(field.value || []).join(', ') || 'None'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional observations or notes"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/health')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : (healthRecord ? 'Update Record' : 'Create Record')}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default InmateHealth;
