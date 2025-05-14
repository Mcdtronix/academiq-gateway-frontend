
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import HealthDashboard from './pages/health/HealthDashboard';
import InmateRegistration from './pages/reception/InmateRegistration';
import InmateDetails from './pages/shared/InmateDetails';
import InmateHealth from './pages/health/InmateHealth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          
          {/* Reception Routes */}
          <Route path="/reception" element={<ProtectedRoute allowedRoles={['reception', 'admin']}><ReceptionDashboard /></ProtectedRoute>} />
          <Route path="/reception/register" element={<ProtectedRoute allowedRoles={['reception', 'admin']}><InmateRegistration /></ProtectedRoute>} />
          
          {/* Health Routes */}
          <Route path="/health" element={<ProtectedRoute allowedRoles={['health', 'admin']}><HealthDashboard /></ProtectedRoute>} />
          <Route path="/health/inmate/:id" element={<ProtectedRoute allowedRoles={['health', 'admin']}><InmateHealth /></ProtectedRoute>} />
          
          {/* Shared Routes */}
          <Route path="/inmates/:id" element={<ProtectedRoute allowedRoles={['admin', 'reception', 'health']}><InmateDetails /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
