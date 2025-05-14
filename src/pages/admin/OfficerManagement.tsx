
import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Officer {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
}

const OfficerManagement = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getOfficers();
      if (response.data) {
        setOfficers(response.data as Officer[]);
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch officers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingOfficer) {
        await adminApi.updateOfficer(editingOfficer.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
        });
        toast({
          title: 'Success',
          description: 'Officer updated successfully',
        });
      } else {
        await adminApi.createOfficer({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          password: formData.password,
        });
        toast({
          title: 'Success',
          description: 'Officer created successfully',
        });
      }
      
      resetFormAndClose();
      fetchOfficers();
    } catch (error) {
      console.error('Error saving officer:', error);
      toast({
        title: 'Error',
        description: 'Failed to save officer',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this officer?')) {
      try {
        await adminApi.deleteOfficer(id);
        setOfficers(officers.filter(officer => officer.id !== id));
        toast({
          title: 'Success',
          description: 'Officer deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting officer:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete officer',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormData({
      name: officer.name,
      email: officer.email,
      role: officer.role,
      department: officer.department,
      password: '', // Password is not included for editing
    });
    setDialogOpen(true);
  };

  const resetFormAndClose = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      password: '',
    });
    setEditingOfficer(null);
    setDialogOpen(false);
  };

  const filteredOfficers = officers.filter(officer => 
    officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Officer Management</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingOfficer(null);
              resetFormAndClose();
              setDialogOpen(true);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOfficer ? 'Edit Officer' : 'Add New Officer'}
              </DialogTitle>
              <DialogDescription>
                {editingOfficer 
                  ? 'Update the officer details below.'
                  : 'Fill in the details to create a new officer account.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Officer Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="officer@prison.gov"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="reception">Reception Officer</SelectItem>
                    <SelectItem value="health">Health Officer</SelectItem>
                    <SelectItem value="security">Security Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingOfficer && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Create a password"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetFormAndClose}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {editingOfficer ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search officers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-4">Loading officers...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No officers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOfficers.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell className="font-medium">{officer.name}</TableCell>
                      <TableCell>{officer.email}</TableCell>
                      <TableCell className="capitalize">{officer.role}</TableCell>
                      <TableCell className="capitalize">{officer.department}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          officer.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {officer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(officer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(officer.id)}
                        >
                          <Trash className="h-4 w-4" />
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
  );
};

export default OfficerManagement;
