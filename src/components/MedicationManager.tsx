
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Medication } from '@/types/User';
import { Package, Clock, Calendar, Bell } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface MedicationManagerProps {
  medications: Medication[];
  setMedications: (medications: Medication[]) => void;
}

const MedicationManager = ({ medications, setMedications }: MedicationManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: [''],
    instructions: '',
    refillDate: ''
  });

  const handleAddMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      times: formData.times.filter(t => t.length > 0),
      startDate: new Date().toISOString().split('T')[0],
      instructions: formData.instructions,
      refillDate: formData.refillDate,
      isActive: true
    };

    setMedications([...medications, newMedication]);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      times: [''],
      instructions: '',
      refillDate: ''
    });

    toast({
      title: "Medication added successfully!",
      description: `${newMedication.name} has been added to your medication list.`,
    });
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      times: [...formData.times, '']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      times: newTimes.length > 0 ? newTimes : ['']
    });
  };

  const getNextRefillDays = (refillDate: string) => {
    const today = new Date();
    const refill = new Date(refillDate);
    const diffTime = refill.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Medications</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Package className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  placeholder="e.g., Lisinopril"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reminder Times</Label>
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.times.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addTimeSlot}
                  className="mt-2"
                >
                  Add Time
                </Button>
              </div>
              <div>
                <Label htmlFor="refill-date">Next Refill Date</Label>
                <Input
                  id="refill-date"
                  type="date"
                  value={formData.refillDate}
                  onChange={(e) => setFormData({...formData, refillDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="e.g., Take with food"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleAddMedication}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.name || !formData.dosage}
              >
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {medications.map((medication) => {
          const refillDays = medication.refillDate ? getNextRefillDays(medication.refillDate) : null;
          
          return (
            <Card key={medication.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{medication.name}</CardTitle>
                    <p className="text-gray-600 mt-1">{medication.dosage} • {medication.frequency}</p>
                  </div>
                  <Badge 
                    variant={medication.isActive ? "default" : "secondary"}
                    className={medication.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {medication.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reminder Times</p>
                      <p className="text-sm text-gray-900">{medication.times.join(', ')}</p>
                    </div>
                  </div>
                  
                  {medication.refillDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Next Refill</p>
                        <p className={`text-sm ${refillDays && refillDays <= 7 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {refillDays !== null && refillDays > 0 ? `${refillDays} days` : refillDays === 0 ? 'Today' : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Started</p>
                      <p className="text-sm text-gray-900">
                        {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {medication.instructions && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Instructions</p>
                    <p className="text-sm text-blue-800">{medication.instructions}</p>
                  </div>
                )}
                
                {refillDays !== null && refillDays <= 7 && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-900">Refill Reminder</p>
                    <p className="text-sm text-red-800">
                      {refillDays > 0 
                        ? `Your prescription needs refilling in ${refillDays} days.`
                        : refillDays === 0
                        ? "Your prescription needs refilling today."
                        : "Your prescription refill is overdue."
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {medications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first medication to track your health journey.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Your First Medication
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationManager;
