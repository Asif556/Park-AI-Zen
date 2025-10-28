export interface ParkingToken {
  id: string;
  vehicleNumber: string;
  slotNumber: number;
  entryTime: string;
  exitTime?: string;
  duration?: {
    hours: number;
    minutes: number;
  };
  charge?: number;
  status: 'active' | 'completed';
  vehicleType?: 'sedan' | 'suv' | 'bike' | 'truck' | 'van' | 'other' | 'car';
  ownerName?: string;
  ownerPhone?: string;
  vehicleColor?: string;
  vehicleModel?: string;
  vehicleCategory?: '4-wheeler' | '2-wheeler';
  classificationConfidence?: number;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus?: 'pending' | 'completed';
  currentDuration?: {
    hours: number;
    minutes: number;
  };
  currentCharge?: number;
}
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}
