import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  LogOut, 
  Car, 
  Camera, 
  ParkingCircle, 
  Upload, 
  CreditCard, 
  Truck, 
  Bike 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import CameraCapture from "@/components/CameraCapture";
import { 
  PaymentSuccessAnimation, 
  SlotAvailabilitySkeleton, 
  PricingInfoSkeleton, 
  ParkingSessionListSkeleton 
} from "@/components";
import type { ParkingToken } from "@/types/parking";
import { 
  checkSession, 
  registerEntry, 
  registerExit, 
  getFreeSlot, 
  getRecords, 
  ApiError 
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleIcons = {
  bike: Bike,
  truck: Truck,
  van: Truck,
  car: Car,
};

interface UserPanelProps {
  onNavigateToChatbot?: () => void;
  areaId?: string;
}

const UserPanel = ({ onNavigateToChatbot, areaId: propAreaId }: UserPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<ParkingToken[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [slotInfo, setSlotInfo] = useState<{ 
    slotNumber: number; 
    totalSlots: number; 
    availableSlots: number; 
  } | null>(null);
  const [exitingSession, setExitingSession] = useState<ParkingToken | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'wallet'>('upi');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount?: number;
    vehicleNumber?: string;
    paymentMethod?: string;
    duration?: string;
  }>({});
  const [parkingAreaId, setParkingAreaId] = useState<string | undefined>(propAreaId);

  useEffect(() => {
    if (propAreaId) {
      setParkingAreaId(propAreaId);
    } else {
      const employeeData = localStorage.getItem('employee_data');
      if (employeeData) {
        try {
          const employee = JSON.parse(employeeData);
          setParkingAreaId(employee.parking_area_id);
        } catch (err) {
          console.error('[UserPanel] Failed to parse employee data:', err);
        }
      }
    }
  }, [propAreaId]);

  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchActiveSessions(), fetchSlotInfo()]);
      setInitialLoading(false);
    };
    initializeData();
    const interval = setInterval(() => {
      fetchActiveSessions();
      fetchSlotInfo();
    }, 30000);
    return () => clearInterval(interval);
  }, [parkingAreaId]);

  const fetchActiveSessions = async () => {
    try {
      const params = { 
        status: 'active', 
        limit: 100, 
        ...(parkingAreaId && { parkingAreaId }) 
      };
      const response = await getRecords(params);
      setActiveSessions(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("[UserPanel] Error fetching active sessions:", error);
    }
  };

  const fetchSlotInfo = async () => {
    try {
      const info = await getFreeSlot();
      setSlotInfo(info);
    } catch (error) {
      console.error("Error fetching slot info:", error);
    }
  };

  const handleImageCapture = async (imageData: string) => {
    setShowCamera(false);
    setProcessing(true);
    try {
      const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      toast.info("Processing image...", {
        description: "Detecting vehicle number plate and type..."
      });
      
      const sessionData = await registerEntry(base64Image, parkingAreaId ? { parkingAreaId } : undefined);
      
      const vehicleTypeEmoji = {
        car: '🚗',
        bike: '🏍️',
        truck: '🚙',
      }[sessionData.vehicleType] || '🚗';
      const vehicleTypeText = sessionData.vehicleType && sessionData.vehicleCategory 
        ? ` | ${vehicleTypeEmoji} ${sessionData.vehicleType.toUpperCase()} (${sessionData.vehicleCategory})`
        : '';
      const confidenceText = sessionData.classificationConfidence 
        ? ` | Confidence: ${(sessionData.classificationConfidence * 100).toFixed(0)}%`
        : '';
      toast.success("Vehicle registered!", {
        description: `Number: ${sessionData.vehicleNumber} | Slot: ${sessionData.slotNumber}${vehicleTypeText}${confidenceText}`
      });
      fetchActiveSessions();
      fetchSlotInfo();
    } catch (error) {
      console.error("[UserPanel] Error processing image:", error);
      handleApiError(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleExitParking = async (parkingData: ParkingToken) => {
    setExitingSession(parkingData);
    setShowPaymentDialog(true);
  };

  const processExit = async () => {
    if (!exitingSession) return;
    setLoading(true);
    setShowPaymentDialog(false);
    try {
      const exitData = await registerExit({ 
        vehicleNumber: exitingSession.vehicleNumber,
        paymentMethod,
        paymentStatus: 'completed' 
      });
      const durationText = exitData.duration 
        ? `${exitData.duration.hours}h ${exitData.duration.minutes}m`
        : '';
      setSuccessData({
        amount: exitData.charge,
        vehicleNumber: exitingSession.vehicleNumber,
        paymentMethod,
        duration: durationText,
      });
      setShowSuccessAnimation(true);
      fetchActiveSessions();
      fetchSlotInfo();
      setExitingSession(null);
    } catch (error) {
      console.error("Error processing exit:", error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleApiError = (error: any) => {
    if (error instanceof ApiError) {
      const errorMessages: Record<string, string> = {
        'INVALID_REQUEST': 'Invalid image data provided',
        'OCR_FAILED': 'Could not detect number plate. Please try again with better lighting.',
        'PROCESSING_ERROR': 'Failed to process the image. Please try again.',
        'NO_SLOTS_AVAILABLE': 'No parking slots available at the moment.'
      };
      toast.error("Registration failed", {
        description: errorMessages[error.code || ''] || error.message
      });
    } else {
      toast.error("Failed to process image", {
        description: "Please try again or contact support."
      });
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleImageCapture}
        onCancel={() => setShowCamera(false)}
        isProcessing={processing}
      />
    );
  }

  return (
    // ... rest of the JSX remains the same ...
  );
};

export default UserPanel;