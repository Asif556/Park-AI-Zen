import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, DollarSign, LogOut, Car, Camera, ParkingCircle, Upload, CreditCard, Truck, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import CameraCapture from "@/components/CameraCapture";
import { SplineChatbotAvatar } from "@/components/SplineChatbotAvatar";
import { PaymentSuccessAnimation } from "@/components/PaymentSuccessAnimation";
import { 
  SlotAvailabilitySkeleton, 
  PricingInfoSkeleton, 
  ParkingSessionListSkeleton 
} from "@/components/ParkingSessionSkeleton";
import type { ParkingToken } from "@/types/parking";
import { checkSession, registerEntry, registerExit, getFreeSlot, getRecords, ApiError } from "@/lib/api";
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
const getVehicleIcon = (vehicleType?: string) => {
  switch (vehicleType) {
    case 'bike':
      return Bike;
    case 'truck':
    case 'van':
      return Truck;
    default:
      return Car;
  }
};
interface UserPanelProps {
  onNavigateToChatbot?: () => void;
}
const UserPanel = ({ onNavigateToChatbot }: UserPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<ParkingToken[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [slotInfo, setSlotInfo] = useState<{ slotNumber: number; totalSlots: number; availableSlots: number } | null>(null);
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
  }, []);
  const fetchActiveSessions = async () => {
    try {
      const response = await getRecords({ status: 'active', limit: 100 });
      const sessions = Array.isArray(response) ? response : (response.data || []);
      setActiveSessions(sessions);
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
      const base64Image = imageData.includes(',') 
        ? imageData.split(',')[1] 
        : imageData;
      toast.info("Processing image...", {
        description: "Detecting vehicle number plate and type..."
      });
      const sessionData = await registerEntry(base64Image);
      console.log('[UserPanel] Received session data:', sessionData);
      const vehicleTypeEmoji = sessionData.vehicleType === 'car' ? '🚗' : sessionData.vehicleType === 'bike' ? '🏍️' : '🚙';
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
        paymentMethod: paymentMethod,
        paymentStatus: 'completed' // Always mark as completed (dummy implementation)
      });
      const durationText = exitData.duration 
        ? `${exitData.duration.hours}h ${exitData.duration.minutes}m`
        : '';
      setSuccessData({
        amount: exitData.charge,
        vehicleNumber: exitingSession.vehicleNumber,
        paymentMethod: paymentMethod,
        duration: durationText,
      });
      setShowSuccessAnimation(true);
      fetchActiveSessions();
      fetchSlotInfo();
      setExitingSession(null);
    } catch (error) {
      console.error("Error processing exit:", error);
      if (error instanceof ApiError) {
        const errorMessages: Record<string, string> = {
          'INVALID_REQUEST': 'Invalid session data',
          'SESSION_NOT_FOUND': 'Parking session not found. Please contact support.'
        };
        toast.error("Exit failed", {
          description: errorMessages[error.code || ''] || error.message
        });
      } else {
        toast.error("Failed to process exit", {
          description: "Please try again or contact support."
        });
      }
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
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* Payment Success Animation */}
      <PaymentSuccessAnimation
        isOpen={showSuccessAnimation}
        onClose={() => setShowSuccessAnimation(false)}
        amount={successData.amount}
        vehicleNumber={successData.vehicleNumber}
        paymentMethod={successData.paymentMethod}
        duration={successData.duration}
      />

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Select Payment Method</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Choose how you want to pay for parking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="payment" className="text-xs sm:text-sm">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger id="payment" className="text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {exitingSession && (
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="font-semibold text-sm sm:text-base">{exitingSession.vehicleNumber}</p>
                {/* Vehicle Type */}
                {exitingSession.vehicleType && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      exitingSession.vehicleType === 'car' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {exitingSession.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'}
                    </span>
                  </div>
                )}
                {exitingSession.charge && (
                  <>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-3 mb-1">Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₹{exitingSession.charge}</p>
                    {/* Pricing Info */}
                    {exitingSession.vehicleType && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Rate: {exitingSession.vehicleType === 'car' 
                          ? '₹20 base + ₹10/hour' 
                          : exitingSession.vehicleType === 'bike'
                          ? '₹10 base + ₹5/hour'
                          : 'Standard rates'
                        }
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDialog(false);
                setExitingSession(null);
              }}
              className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={processExit}
              disabled={loading}
              className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
            >
              <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {loading ? "Processing..." : "Pay & Exit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Slot Availability Card */}
        {initialLoading ? (
          <SlotAvailabilitySkeleton />
        ) : slotInfo && (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ParkingCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-base sm:text-lg">Slot Availability</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{slotInfo.availableSlots}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{slotInfo.totalSlots}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-accent">{slotInfo.slotNumber}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Next Slot</p>
              </div>
            </div>
          </Card>
        )}

        {/* Capture Image Card */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-full">
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            <Button
              onClick={() => setShowCamera(true)}
              className="w-full text-xs sm:text-sm h-9 sm:h-10"
              disabled={slotInfo?.availableSlots === 0}
            >
              <Camera className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Capture Image
            </Button>
          </div>
        </Card>

        {/* Upload Image Card */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full">
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <Button
              variant="outline"
              className="w-full text-xs sm:text-sm h-9 sm:h-10"
              disabled={slotInfo?.availableSlots === 0}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleImageCapture(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Upload Image
            </Button>
          </div>
        </Card>
      </div>

      {/* Pricing Information */}
      {initialLoading ? (
        <PricingInfoSkeleton />
      ) : (
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
            <h3 className="font-semibold text-base sm:text-lg">Pricing Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xl sm:text-2xl flex-shrink-0">🚗</div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm">Cars (4-wheelers)</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">₹20 base charge + ₹10 per hour</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-xl sm:text-2xl flex-shrink-0">🏍️</div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm">Bikes (2-wheelers)</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">₹10 base charge + ₹5 per hour</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
            💡 Vehicle type is automatically detected using AI when you capture the entry photo
          </p>
        </Card>
      )}
      {/* Active Sessions Header */}
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Active Parking Sessions</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {initialLoading ? 'Loading sessions...' : `Currently parked vehicles (${activeSessions.length})`}
        </p>
      </div>

      {/* Active Sessions List */}
      {initialLoading ? (
        <ParkingSessionListSkeleton count={3} />
      ) : activeSessions.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full mb-3 sm:mb-4">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No Active Sessions</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            There are no vehicles currently parked. Use the capture or upload option above to register a new vehicle.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {activeSessions.map((session) => {
            const VehicleIcon = getVehicleIcon(session.vehicleType);
            return (
              <Card key={session.id} className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full mb-2 sm:mb-3">
                    <VehicleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  {/* Vehicle Type Badge */}
                  {session.vehicleType && session.vehicleCategory && (
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                        session.vehicleType === 'car' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {session.vehicleType === 'car' ? '🚗 Car' : '🏍️ Bike'} 
                        {session.classificationConfidence && 
                          ` (${(session.classificationConfidence * 100).toFixed(0)}%)`
                        }
                      </span>
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {session.vehicleType ? session.vehicleType.toUpperCase() : 'Vehicle'}
                  </h3>
                  {session.ownerName && (
                    <p className="text-xs sm:text-sm text-muted-foreground">{session.ownerName}</p>
                  )}
                </div>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Vehicle Number</p>
                      <p className="font-semibold text-xs sm:text-sm truncate">{session.vehicleNumber}</p>
                    </div>
                  </div>
                  {session.vehicleModel && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                      <Car className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Model</p>
                        <p className="font-semibold text-xs sm:text-sm truncate">{session.vehicleModel}</p>
                      </div>
                    </div>
                  )}
                  {session.vehicleColor && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-primary flex-shrink-0" style={{ backgroundColor: session.vehicleColor.toLowerCase() }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Color</p>
                        <p className="font-semibold text-xs sm:text-sm truncate">{session.vehicleColor}</p>
                      </div>
                    </div>
                  )}
                  {session.ownerPhone && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Contact</p>
                        <p className="font-semibold text-xs sm:text-sm truncate">{session.ownerPhone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Slot Number</p>
                      <p className="font-semibold text-xs sm:text-sm">Slot {session.slotNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary rounded-lg">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Entry Time</p>
                      <p className="font-semibold text-[10px] sm:text-xs truncate">{formatTime(session.entryTime)}</p>
                    </div>
                  </div>
                </div>
                {session.status === 'active' && (
                  <Button
                    onClick={() => handleExitParking(session)}
                    disabled={loading}
                    className="w-full text-xs sm:text-sm h-8 sm:h-9"
                    size="sm"
                  >
                    <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {loading ? "Processing..." : "Exit Parking"}
                  </Button>
                )}
                {(session.charge !== undefined || session.currentCharge !== undefined) && (
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-accent/10 rounded-lg border border-accent">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {session.status === 'active' ? 'Current Charge' : 'Total Charge'}
                      </span>
                      <span className="font-bold text-base sm:text-lg text-accent">
                        ₹{session.currentCharge || session.charge}
                      </span>
                    </div>
                    {/* Rate Info */}
                    {session.vehicleType && (
                      <div className="mt-2 pt-2 border-t border-accent/20">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {session.vehicleType === 'car' 
                            ? '₹20 base + ₹10/hour' 
                            : session.vehicleType === 'bike'
                            ? '₹10 base + ₹5/hour'
                            : 'Standard rates apply'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {/* Chatbot Avatar */}
      {onNavigateToChatbot && (
        <SplineChatbotAvatar 
          onClickNavigate={onNavigateToChatbot}
          position="fixed"
          size="medium"
          showLabel={true}
        />
      )}
    </div>
  );
};
export default UserPanel;
