
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
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/officers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OfficerManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/inmates" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InmateOverview />
              </ProtectedRoute>
            } 
          />
          
          {/* Reception routes */}
          <Route 
            path="/reception" 
            element={
              <ProtectedRoute allowedRoles={['reception']}>
                <ReceptionDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reception/register" 
            element={
              <ProtectedRoute allowedRoles={['reception']}>
                <InmateRegistration />
              </ProtectedRoute>
            } 
          />
          
          {/* Health department routes */}
          <Route 
            path="/health" 
            element={
              <ProtectedRoute allowedRoles={['health']}>
                <HealthDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/inmate/:id" 
            element={
              <ProtectedRoute allowedRoles={['health']}>
                <InmateHealth />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/inmate/:id/opd/new" 
            element={
              <ProtectedRoute allowedRoles={['health']}>
                <OPDVisitPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health/inmate/:id/opd" 
            element={
              <ProtectedRoute allowedRoles={['health']}>
                <OPDRecordsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Shared routes */}
          <Route 
            path="/inmates/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'reception', 'health']}>
                <InmateDetails />
              </ProtectedRoute>
            }
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
