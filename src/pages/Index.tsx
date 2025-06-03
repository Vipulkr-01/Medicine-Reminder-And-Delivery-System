
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Package, User as UserIcon } from 'lucide-react';
import AuthDialog from '@/components/AuthDialog';
import Dashboard from '@/components/Dashboard';
import { User } from '@/types/User';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('medcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('medcare_user', JSON.stringify(userData));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medcare_user');
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MedCare</h1>
            </div>
            <Button 
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Never Miss Your <span className="text-blue-600">Medicine</span> Again
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Community-based medicine reminder and delivery system designed for elderly and chronically ill patients. 
            Get timely reminders, manage prescriptions, and connect with local volunteers for delivery help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowAuth(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Manage Your Health
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Smart Reminders</h4>
              <p className="text-gray-600">
                Get personalized medication reminders via browser notifications, SMS, or email. 
                Never forget to take your medicine on time.
              </p>
            </Card>

            <Card className="p-6 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Prescription Management</h4>
              <p className="text-gray-600">
                Track all your medications in one place. Set up automatic refill reminders 
                and manage your prescription schedule easily.
              </p>
            </Card>

            <Card className="p-6 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h4>
              <p className="text-gray-600">
                Connect with local volunteers and pharmacies for delivery assistance. 
                Get the help you need from your community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust MedCare for their medication management.
          </p>
          <Button 
            onClick={() => setShowAuth(true)}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg"
          >
            Start Your Free Account
          </Button>
        </div>
      </section>

      <AuthDialog 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
