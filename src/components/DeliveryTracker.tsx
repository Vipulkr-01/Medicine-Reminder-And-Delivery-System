
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DeliveryRequest } from '@/types/User';
import { Package, MapPin, Clock, User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface DeliveryTrackerProps {
  deliveryRequests: DeliveryRequest[];
  setDeliveryRequests: (requests: DeliveryRequest[]) => void;
}

const DeliveryTracker = ({ deliveryRequests, setDeliveryRequests }: DeliveryTrackerProps) => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    pharmacy: '',
    notes: ''
  });

  const handleSubmitRequest = () => {
    const newRequest: DeliveryRequest = {
      id: Date.now().toString(),
      medicationName: formData.medicationName,
      pharmacy: formData.pharmacy,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: formData.notes
    };

    setDeliveryRequests([...deliveryRequests, newRequest]);
    setIsRequestDialogOpen(false);
    setFormData({
      medicationName: '',
      pharmacy: '',
      notes: ''
    });

    toast({
      title: "Delivery request submitted!",
      description: "We'll connect you with a volunteer in your area soon.",
    });
  };

  const getStatusColor = (status: DeliveryRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: DeliveryRequest['status']) => {
    switch (status) {
      case 'pending': return 'Waiting for volunteer';
      case 'assigned': return 'Volunteer assigned';
      case 'in-transit': return 'On the way';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Requests</h2>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Package className="w-4 h-4 mr-2" />
              Request Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Medication Delivery</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input
                  id="medication-name"
                  placeholder="e.g., Lisinopril 10mg"
                  value={formData.medicationName}
                  onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="pharmacy">Pharmacy</Label>
                <Input
                  id="pharmacy"
                  placeholder="e.g., CVS Pharmacy, 123 Main St"
                  value={formData.pharmacy}
                  onChange={(e) => setFormData({...formData, pharmacy: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special delivery instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleSubmitRequest}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!formData.medicationName || !formData.pharmacy}
              >
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {deliveryRequests.map((request) => (
          <Card key={request.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gray-900">{request.medicationName}</CardTitle>
                  <p className="text-gray-600 mt-1">Requested on {new Date(request.requestDate).toLocaleDateString()}</p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusText(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pharmacy</p>
                    <p className="text-sm text-gray-900">{request.pharmacy}</p>
                  </div>
                </div>
                
                {request.deliveryDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivery Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(request.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {request.volunteerId && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Volunteer</p>
                      <p className="text-sm text-gray-900">Community Helper #{request.volunteerId}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {request.notes && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Special Instructions</p>
                  <p className="text-sm text-blue-800">{request.notes}</p>
                </div>
              )}
              
              {request.status === 'in-transit' && (
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Delivery Update</p>
                  <p className="text-sm text-purple-800">
                    Your medication is on the way! The volunteer will contact you when they arrive.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {deliveryRequests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery requests yet</h3>
            <p className="text-gray-600 mb-4">Need help getting your medication? Request delivery assistance from community volunteers.</p>
            <Button 
              onClick={() => setIsRequestDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Request Your First Delivery
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryTracker;
