
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gavel, Shield, Users, LogIn } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#1A1F2C] text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-[#9b87f5]" />
            <h1 className="text-2xl font-bold">Prison Management System</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            className="text-white border-white hover:bg-white hover:text-[#1A1F2C]"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-[#1A1F2C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Prison Management Solution</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Streamline operations, enhance security, and improve inmate management with our integrated system.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-[#9b87f5]" />}
              title="Inmate Management"
              description="Comprehensive inmate record management including admission, discharge, classification, and transfers."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-[#9b87f5]" />}
              title="Officer Administration"
              description="Manage prison staff, assign roles, and track performance across different departments."
            />
            <FeatureCard 
              icon={<Gavel className="h-10 w-10 text-[#9b87f5]" />}
              title="Health Monitoring"
              description="Track inmate health records, manage OPD visits, and maintain medical history."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Prison Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
