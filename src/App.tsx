
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OfficerManagement from '@/pages/admin/OfficerManagement';
import InmateOverview from '@/pages/admin/InmateOverview';
import ReceptionDashboard from '@/pages/reception/ReceptionDashboard';
import InmateRegistration from '@/pages/reception/InmateRegistration';
import HealthDashboard from '@/pages/health/HealthDashboard';
import InmateHealth from '@/pages/health/InmateHealth';
import OPDVisitPage from '@/pages/health/OPDVisitPage';
import OPDRecordsPage from '@/pages/health/OPDRecordsPage';
import InmateDetails from '@/pages/shared/InmateDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="officers" element={<OfficerManagement />} />
            <Route path="inmates" element={<InmateOverview />} />
          </Route>
          
          {/* Reception routes */}
          <Route path="/reception" element={<ProtectedRoute allowedRoles={['reception']} />}>
            <Route index element={<ReceptionDashboard />} />
            <Route path="register" element={<InmateRegistration />} />
          </Route>
          
          {/* Health department routes */}
          <Route path="/health" element={<ProtectedRoute allowedRoles={['health']} />}>
            <Route index element={<HealthDashboard />} />
            <Route path="inmate/:id" element={<InmateHealth />} />
            <Route path="inmate/:id/opd/new" element={<OPDVisitPage />} />
            <Route path="inmate/:id/opd" element={<OPDRecordsPage />} />
          </Route>
          
          {/* Shared routes */}
          <Route path="/inmates/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'reception', 'health']} />
          }>
            <Route index element={<InmateDetails />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
