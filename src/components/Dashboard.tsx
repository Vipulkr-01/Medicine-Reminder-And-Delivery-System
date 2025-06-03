
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Medication, Reminder, DeliveryRequest } from '@/types/User';
import MedicationManager from './MedicationManager';
import DeliveryTracker from './DeliveryTracker';
import { Bell, Calendar, Package, User as UserIcon, Clock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);

  useEffect(() => {
    // Load demo data
    const demoMedications: Medication[] = [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        times: ['08:00'],
        startDate: '2024-01-01',
        instructions: 'Take with food',
        refillDate: '2024-07-15',
        isActive: true
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        startDate: '2024-01-01',
        instructions: 'Take with meals',
        refillDate: '2024-07-20',
        isActive: true
      }
    ];

    const demoReminders: Reminder[] = [
      {
        id: '1',
        medicationId: '1',
        time: '08:00',
        taken: false,
        skipped: false,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        medicationId: '2',
        time: '08:00',
        taken: true,
        skipped: false,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        medicationId: '2',
        time: '20:00',
        taken: false,
        skipped: false,
        date: new Date().toISOString().split('T')[0]
      }
    ];

    setMedications(demoMedications);
    setTodayReminders(demoReminders);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markReminderTaken = (reminderId: string) => {
    setTodayReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, taken: true }
          : reminder
      )
    );
    toast({
      title: "Medication taken!",
      description: "Great job staying on track with your medication schedule.",
    });
  };

  const upcomingReminders = todayReminders.filter(r => !r.taken && !r.skipped);
  const completedToday = todayReminders.filter(r => r.taken).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedCare</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Button variant="outline" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedToday}/{todayReminders.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Medications</p>
                  <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Reminders</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingReminders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Delivery Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{deliveryRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Reminders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Today's Medication Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayReminders.map(reminder => {
                const medication = medications.find(m => m.id === reminder.medicationId);
                if (!medication) return null;

                return (
                  <div key={reminder.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    reminder.taken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        reminder.taken ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Clock className={`w-5 h-5 ${reminder.taken ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} at {reminder.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {reminder.taken ? (
                        <Badge className="bg-green-100 text-green-800">Taken</Badge>
                      ) : (
                        <Button 
                          onClick={() => markReminderTaken(reminder.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark as Taken
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="medications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="deliveries">Delivery Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <MedicationManager 
              medications={medications}
              setMedications={setMedications}
            />
          </TabsContent>

          <TabsContent value="deliveries">
            <DeliveryTracker 
              deliveryRequests={deliveryRequests}
              setDeliveryRequests={setDeliveryRequests}
            />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <p className="text-lg text-gray-900 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
