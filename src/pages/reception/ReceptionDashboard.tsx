
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Home, LogOut, Plus, Search, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { receptionApi } from '@/lib/api';
import { DashboardShell } from '@/components/DashboardShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PendingInmate {
  id: string;
  prison_number: string;
  name: string;
  admission_date: string;
  offense: string;
  status: 'pending';
}

const ReceptionDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingInmates, setPendingInmates] = useState<PendingInmate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingInmates();
  }, []);

  const fetchPendingInmates = async () => {
    try {
      setIsLoading(true);
      const response = await receptionApi.getPendingInmates();
      if (response.data) {
        setPendingInmates(response.data as PendingInmate[]);
      }
    } catch (error) {
      console.error('Error fetching pending inmates:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending inmates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const filteredInmates = pendingInmates.filter(inmate =>
    inmate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inmate.prison_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inmate.offense.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell
      title="Reception Dashboard"
      description="Register new inmates and manage their valuables"
      user={{ name: 'Reception Officer', role: 'Reception Department' }}
      onLogout={handleLogout}
      navItems={[
        { icon: <Home size={20} />, label: 'Dashboard', href: '/reception' },
        { icon: <Plus size={20} />, label: 'Register Inmate', href: '/reception/register' },
        { icon: <Users size={20} />, label: 'Inmate Records', href: '/reception/inmates' },
        { icon: <FileText size={20} />, label: 'Valuables Registry', href: '/reception/valuables' },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Admissions</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInmates.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Admissions</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              New inmates today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valuables Processed</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Items registered today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Discharges</CardTitle>
            <div className="h-4 w-4 rounded-full bg-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Admissions</CardTitle>
              <CardDescription>
                Inmates awaiting administrative approval
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate('/reception/register')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Register New Inmate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pending inmates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-4">Loading pending inmates...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prison #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Offense</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInmates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No pending inmates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInmates.map((inmate) => (
                        <TableRow key={inmate.id}>
                          <TableCell className="font-medium">{inmate.prison_number}</TableCell>
                          <TableCell>{inmate.name}</TableCell>
                          <TableCell>{new Date(inmate.admission_date).toLocaleDateString()}</TableCell>
                          <TableCell>{inmate.offense}</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500">Pending</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/inmates/${inmate.id}`)}
                              className="mr-2"
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/reception/inmates/${inmate.id}/valuables`)}
                            >
                              Register Valuables
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default ReceptionDashboard;
