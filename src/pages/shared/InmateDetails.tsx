
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inmateApi, adminApi } from '@/lib/api';
import { DashboardShell } from '@/components/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, User, FileText, Calendar, Gavel, 
  ArrowRight, LogOut, Thermometer, 
  BookOpen, AlertCircle, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Inmate {
  id: string;
  prison_number: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  nationality: string;
  address: string;
  emergency_contact: string;
  admission_date: string;
  expected_release_date?: string;
  offense: string;
  sentence: string;
  classification: 'A' | 'B' | 'C' | 'D' | 'PUSOD' | 'CONDEM';
  status: 'active' | 'pending' | 'discharged' | 'transferred';
  photo_url?: string;
}

interface Offense {
  id: string;
  description: string;
  court: string;
  conviction_status: 'convicted' | 'unconvicted';
  sentence?: string;
  edr_with_restitution?: string;
  edr_without_restitution?: string;
  restitution_amount?: number;
  restitution_date?: string;
  next_court_date?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  event_type: string;
  description: string;
  recorded_by: string;
}

interface Valuable {
  id: string;
  bag_number: string;
  description: string;
  quantity: number;
  estimated_value?: number;
  storage_location: string;
}

interface HealthRecord {
  id: string;
  date: string;
  temperature: string;
  height: string;
  weight: string;
  blood_pressure: string;
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  health_status: string;
  notes: string;
}

interface OPDVisit {
  id: string;
  date: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
}

const InmateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inmate, setInmate] = useState<Inmate | null>(null);
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [valuables, setValuables] = useState<Valuable[]>([]);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [opdVisits, setOPDVisits] = useState<OPDVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInmateData(id);
    }
  }, [id]);

  const fetchInmateData = async (inmateId: string) => {
    setIsLoading(true);
    try {
      // Fetch inmate details
      const detailsResponse = await inmateApi.getInmateDetails(inmateId);
      if (detailsResponse.data) {
        setInmate(detailsResponse.data as Inmate);
      }

      // Fetch offenses
      const offensesResponse = await inmateApi.getInmateOffenses(inmateId);
      if (offensesResponse.data) {
        setOffenses(offensesResponse.data as Offense[]);
      }

      // Fetch timeline
      const timelineResponse = await inmateApi.getInmateTimeline(inmateId);
      if (timelineResponse.data) {
        setTimeline(timelineResponse.data as TimelineEvent[]);
      }

      // If user is health officer or admin, fetch health records
      if (user?.role === 'health' || user?.role === 'admin') {
        const healthResponse = await fetch(`/api/health/inmates/${inmateId}`);
        const healthData = await healthResponse.json();
        if (healthData.success) {
          setHealthRecord(healthData.data);
        }

        const opdResponse = await fetch(`/api/health/inmates/${inmateId}/opd`);
        const opdData = await opdResponse.json();
        if (opdData.success) {
          setOPDVisits(opdData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching inmate data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inmate details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApproveInmate = async () => {
    if (!id) return;
    
    try {
      await adminApi.approveInmate(id);
      setInmate(prev => prev ? { ...prev, status: 'active' } : null);
      toast({
        title: 'Success',
        description: 'Inmate approved successfully',
      });
    } catch (error) {
      console.error('Error approving inmate:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve inmate',
        variant: 'destructive',
      });
    }
  };

  const handleDischargeInmate = async () => {
    if (!id) return;
    
    // In a real app, you'd open a dialog to get the reason
    const reason = "Sentence completed";
    
    try {
      await adminApi.dischargeInmate(id, reason);
      setInmate(prev => prev ? { ...prev, status: 'discharged' } : null);
      toast({
        title: 'Success',
        description: 'Inmate discharged successfully',
      });
    } catch (error) {
      console.error('Error discharging inmate:', error);
      toast({
        title: 'Error',
        description: 'Failed to discharge inmate',
        variant: 'destructive',
      });
    }
  };

  const handleTransferInmate = async () => {
    if (!id) return;
    
    // In a real app, you'd open a dialog to get the destination
    const destination = "Central Prison";
    
    try {
      await adminApi.transferInmate(id, destination);
      setInmate(prev => prev ? { ...prev, status: 'transferred' } : null);
      toast({
        title: 'Success',
        description: 'Inmate transfer initiated successfully',
      });
    } catch (error) {
      console.error('Error transferring inmate:', error);
      toast({
        title: 'Error',
        description: 'Failed to transfer inmate',
        variant: 'destructive',
      });
    }
  };

  const handleClassifyInmate = async (classification: string) => {
    if (!id) return;
    
    try {
      await adminApi.classifyInmate(id, classification);
      setInmate(prev => prev ? { ...prev, classification: classification as any } : null);
      toast({
        title: 'Success',
        description: `Inmate classified as Class ${classification}`,
      });
    } catch (error) {
      console.error('Error classifying inmate:', error);
      toast({
        title: 'Error',
        description: 'Failed to classify inmate',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'discharged':
        return <Badge className="bg-blue-500">Discharged</Badge>;
      case 'transferred':
        return <Badge className="bg-purple-500">Transferred</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: user?.role === 'admin' ? '/admin' : user?.role === 'reception' ? '/reception' : '/health' },
    { icon: <User size={20} />, label: 'Inmates', href: user?.role === 'admin' ? '/admin/inmates' : user?.role === 'reception' ? '/reception/inmates' : '/health/inmates' },
    { icon: <FileText size={20} />, label: 'Records', href: user?.role === 'admin' ? '/admin/records' : user?.role === 'reception' ? '/reception/records' : '/health/records' },
  ];

  if (isLoading || !inmate) {
    return (
      <DashboardShell
        title="Inmate Details"
        description="Loading inmate information..."
        user={{ name: user?.name || 'User', role: user?.role || 'Officer' }}
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

  return (
    <DashboardShell
      title="Inmate Details"
      description="View comprehensive inmate information"
      user={{ name: user?.name || 'User', role: user?.role || 'Officer' }}
      onLogout={handleLogout}
      navItems={navItems}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
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
              <div className="mt-2">
                {getStatusBadge(inmate.status)}
                <Badge className="ml-2 bg-[#7E69AB]">Class {inmate.classification}</Badge>
              </div>
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
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nationality:</span>
                  <span className="text-sm">{inmate.nationality}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Admission Date:</span>
                  <span className="text-sm">{new Date(inmate.admission_date).toLocaleDateString()}</span>
                </div>
                {inmate.expected_release_date && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Expected Release:</span>
                    <span className="text-sm">{new Date(inmate.expected_release_date).toLocaleDateString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Primary Offense:</span>
                  <span className="text-sm">{inmate.offense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sentence:</span>
                  <span className="text-sm">{inmate.sentence || 'N/A'}</span>
                </div>
              </div>
              
              {/* Admin actions */}
              {user?.role === 'admin' && (
                <div className="mt-6 space-y-2">
                  {inmate.status === 'pending' && (
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleApproveInmate}
                    >
                      Approve Admission
                    </Button>
                  )}
                  {inmate.status === 'active' && (
                    <>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={handleDischargeInmate}
                      >
                        Discharge Inmate
                      </Button>
                      <Button 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                        onClick={handleTransferInmate}
                      >
                        Transfer Inmate
                      </Button>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Change Classification:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {['A', 'B', 'C', 'D', 'PUSOD', 'CONDEM'].map((cls) => (
                            <Button 
                              key={cls}
                              variant="outline"
                              size="sm"
                              className={inmate.classification === cls ? 'bg-[#9b87f5] text-white' : ''}
                              onClick={() => handleClassifyInmate(cls)}
                            >
                              {cls}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="offenses">Offenses</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-2">Personal Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <User className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p className="text-sm">{inmate.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Date of Birth</p>
                            <p className="text-sm">{new Date(inmate.dob).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm">{inmate.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Emergency Contact</p>
                            <p className="text-sm">{inmate.emergency_contact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Incarceration Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Gavel className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Primary Offense</p>
                            <p className="text-sm">{inmate.offense}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Sentence</p>
                            <p className="text-sm">{inmate.sentence || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Admission Date</p>
                            <p className="text-sm">{new Date(inmate.admission_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {inmate.expected_release_date && (
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Expected Release Date</p>
                              <p className="text-sm">{new Date(inmate.expected_release_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inmate Valuables</CardTitle>
                </CardHeader>
                <CardContent>
                  {valuables.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-medium text-sm">Bag #</th>
                          <th className="text-left font-medium text-sm">Description</th>
                          <th className="text-left font-medium text-sm">Quantity</th>
                          <th className="text-left font-medium text-sm">Value</th>
                          <th className="text-left font-medium text-sm">Storage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {valuables.map((valuable) => (
                          <tr key={valuable.id}>
                            <td className="text-sm py-2">{valuable.bag_number}</td>
                            <td className="text-sm py-2">{valuable.description}</td>
                            <td className="text-sm py-2">{valuable.quantity}</td>
                            <td className="text-sm py-2">${valuable.estimated_value || 'N/A'}</td>
                            <td className="text-sm py-2">{valuable.storage_location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No valuables recorded for this inmate.</p>
                  )}
                  
                  {user?.role === 'reception' && (
                    <Button 
                      className="mt-4"
                      variant="outline"
                      onClick={() => navigate(`/reception/inmates/${id}/valuables`)}
                    >
                      Register Valuables
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="offenses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Offense Record</CardTitle>
                  <CardDescription>
                    Complete record of offenses and sentences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {offenses.length > 0 ? (
                    <div className="space-y-6">
                      {offenses.map((offense, index) => (
                        <div key={offense.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center mb-2">
                            <Badge className={offense.conviction_status === 'convicted' ? 'bg-red-500' : 'bg-orange-500'}>
                              {offense.conviction_status === 'convicted' ? 'Convicted' : 'Unconvicted'}
                            </Badge>
                            <span className="ml-2 text-sm font-semibold">Offense #{index + 1}</span>
                          </div>
                          <p className="text-sm font-medium my-2">Description:</p>
                          <p className="text-sm mb-3">{offense.description}</p>
                          <p className="text-sm font-medium mb-1">Court:</p>
                          <p className="text-sm mb-3">{offense.court}</p>
                          
                          {offense.conviction_status === 'convicted' ? (
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium mb-1">Sentence:</p>
                                <p className="text-sm">{offense.sentence}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">EDR without Restitution:</p>
                                <p className="text-sm">
                                  {offense.edr_without_restitution 
                                    ? new Date(offense.edr_without_restitution).toLocaleDateString() 
                                    : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">Restitution Amount:</p>
                                <p className="text-sm">
                                  {offense.restitution_amount 
                                    ? `$${offense.restitution_amount.toLocaleString()}` 
                                    : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">EDR with Restitution:</p>
                                <p className="text-sm">
                                  {offense.edr_with_restitution 
                                    ? new Date(offense.edr_with_restitution).toLocaleDateString() 
                                    : 'N/A'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium mb-1">Next Court Date:</p>
                              <p className="text-sm">
                                {offense.next_court_date 
                                  ? new Date(offense.next_court_date).toLocaleDateString() 
                                  : 'Not scheduled'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No detailed offense records available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inmate Timeline</CardTitle>
                  <CardDescription>
                    Chronological record of events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {timeline.length > 0 ? (
                    <div className="relative border-l border-gray-200 pl-6 ml-3 space-y-6">
                      {timeline.map((event) => (
                        <div key={event.id} className="relative">
                          <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-[#9b87f5]"></div>
                          <div className="mb-1 flex items-center">
                            <Badge className="bg-[#7E69AB]">
                              {event.event_type}
                            </Badge>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm mb-1">{event.description}</p>
                          <p className="text-xs text-muted-foreground">Recorded by: {event.recorded_by}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No timeline events recorded.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Health Record</CardTitle>
                  <CardDescription>
                    Medical information and health status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {healthRecord ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="border rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm font-medium">{healthRecord.temperature}</span>
                          </div>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-1">Height</p>
                          <span className="text-sm font-medium">{healthRecord.height}</span>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-1">Weight</p>
                          <span className="text-sm font-medium">{healthRecord.weight}</span>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                          <span className="text-sm font-medium">{healthRecord.blood_pressure}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Health Status</h3>
                        <p className="text-sm">{healthRecord.health_status}</p>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Medical Conditions</h3>
                          {healthRecord.medical_conditions.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {healthRecord.medical_conditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">None reported</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Medications</h3>
                          {healthRecord.medications.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {healthRecord.medications.map((medication, index) => (
                                <li key={index}>{medication}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">None prescribed</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Allergies</h3>
                          {healthRecord.allergies.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {healthRecord.allergies.map((allergy, index) => (
                                <li key={index}>{allergy}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">None reported</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Notes</h3>
                        <p className="text-sm">{healthRecord.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No health record available for this inmate.
                      </p>
                      
                      {user?.role === 'health' && (
                        <Button 
                          className="mt-4"
                          onClick={() => navigate(`/health/inmate/${id}`)}
                        >
                          Create Health Record
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {healthRecord && (
                <Card>
                  <CardHeader>
                    <CardTitle>OPD Visits</CardTitle>
                    <CardDescription>
                      Out-patient department visit history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {opdVisits.length > 0 ? (
                      <div className="rounded-md border">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 text-sm font-medium">Date</th>
                              <th className="text-left p-3 text-sm font-medium">Complaint</th>
                              <th className="text-left p-3 text-sm font-medium">Diagnosis</th>
                              <th className="text-left p-3 text-sm font-medium">Doctor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {opdVisits.map((visit) => (
                              <tr key={visit.id} className="border-b last:border-0">
                                <td className="p-3 text-sm">
                                  {new Date(visit.date).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-sm">{visit.complaint}</td>
                                <td className="p-3 text-sm">{visit.diagnosis}</td>
                                <td className="p-3 text-sm">{visit.doctor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No OPD visits recorded.</p>
                    )}
                    
                    {user?.role === 'health' && (
                      <Button 
                        className="mt-4"
                        onClick={() => navigate(`/health/inmate/${id}/opd/new`)}
                      >
                        Record OPD Visit
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
};

export default InmateDetails;
