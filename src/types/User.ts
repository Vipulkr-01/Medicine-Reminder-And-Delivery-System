
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'caregiver' | 'volunteer';
  phone?: string;
  address?: string;
  emergencyContact?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  refillDate?: string;
  isActive: boolean;
}

export interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  taken: boolean;
  skipped: boolean;
  date: string;
}

export interface DeliveryRequest {
  id: string;
  medicationName: string;
  pharmacy: string;
  requestDate: string;
  deliveryDate?: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  volunteerId?: string;
  notes?: string;
}
