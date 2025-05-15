
import { DashboardShell } from '@/components/DashboardShell';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, Plus, UserPlus, Users } from 'lucide-react';
import InmateForm from './components/InmateForm';

const InmateRegistration = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
        <InmateForm />
      </div>
    </DashboardShell>
  );
};

export default InmateRegistration;
