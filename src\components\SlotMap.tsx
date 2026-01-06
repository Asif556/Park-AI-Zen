import { useState, useEffect } from "react";
import { RefreshCw, Car, ParkingCircle, MapPin, Clock, Grid3x3, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ParkingLot3D } from "@/components/ParkingLot3D";
import { SlotGridSkeleton, SlotMapHeaderSkeleton } from "@/components/ParkingSessionSkeleton";
import type { ParkingToken } from "@/types/parking";
import { getRecords, getFreeSlot, ApiError } from "@/lib/api";
import { useParkingPrediction } from "@/hooks/use-parking-prediction";
import { usePredictionSettings } from "@/contexts/PredictionSettingsContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const SlotItem = ({
  slotNumber,
  session,
  formatTime,
  predictionsEnabled,
}: {
  slotNumber: number;
  session: ParkingToken | null;
  formatTime: (time: string) => string;
  predictionsEnabled: boolean;
}) => {
  const { prediction } = useParkingPrediction(slotNumber, session !== null && predictionsEnabled);
  const colors = getSlotColors(slotNumber, session, prediction, predictionsEnabled, formatTime);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-500 ease-out group ${colors.bg} ${colors.bgHover} ${colors.border} ${colors.borderHover} hover:scale-110 hover:-translate-y-1 shadow-lg ${colors.glow} ${colors.glowHover} overflow-hidden ${colors.pulse}`}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            style={{
              animation: `slot-appear 0.6s ease-out ${slotNumber * 0.02}s both`,
            }}
          >
            {/* ... */}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs backdrop-blur-xl bg-background/95 border-2 shadow-2xl">
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const getSlotColors = (
  slotNumber: number,
  session: ParkingToken | null,
  prediction: any,
  predictionsEnabled: boolean,
  formatTime: (time: string) => string
) => {
  const isOccupied = session !== null;
  const isPredictedFreeSoon =
    predictionsEnabled &&
    isOccupied &&
    prediction?.predicted_free_in_minutes !== null &&
    prediction.predicted_free_in_minutes < 10;

  if (!isOccupied) {
    return {
      bg: 'bg-gradient-to-br from-green-500/20 via-green-500/10 to-green-400/5',
      bgHover: 'hover:from-green-500/30 hover:via-green-500/20 hover:to-green-400/10',
      border: 'border-green-500/60',
      borderHover: 'hover:border-green-400',
      text: 'text-green-700 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400',
      dot: 'bg-green-500 shadow-lg shadow-green-500/50',
      glow: 'shadow-green-500/20',
      glowHover: 'hover:shadow-green-500/40',
      pulse: '',
    };
  } else if (isPredictedFreeSoon) {
    return {
      bg: 'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-400/5',
      bgHover: 'hover:from-blue-500/30 hover:via-blue-500/20 hover:to-blue-400/10',
      border: 'border-blue-500/60',
      borderHover: 'hover:border-blue-400',
      text: 'text-blue-700 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
      dot: 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse',
      glow: 'shadow-blue-500/20',
      glowHover: 'hover:shadow-blue-500/40',
      pulse: '',
    };
  } else {
    return {
      bg: 'bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-400/5',
      bgHover: 'hover:from-red-500/30 hover:via-red-500/20 hover:to-red-400/10',
      border: 'border-red-500/60',
      borderHover: 'hover:border-red-400',
      text: 'text-red-700 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400',
      dot: 'bg-red-500 shadow-lg shadow-red-500/50',
      glow: 'shadow-red-500/20',
      glowHover: 'hover:shadow-red-500/40',
      pulse: '',
    };
  }
};

interface SlotMapProps {
  onNavigateToChatbot?: () => void;
  areaId?: string;
}

const SlotMap = ({ onNavigateToChatbot, areaId }: SlotMapProps) => {
  const [loading, setLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ParkingToken[]>([]);
  const [slotInfo, setSlotInfo] = useState<{ slotNumber: number; totalSlots: number; availableSlots: number } | null>(null);
  const [view3D, setView3D] = useState(false);
  const [parkingAreaId, setParkingAreaId] = useState<string | undefined>(areaId);
  const { settings } = usePredictionSettings();

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
    };
    initializeData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [parkingAreaId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsResponse, slotResponse] = await Promise.all([
        getRecords({ status: 'active', limit: 100, parkingAreaId }),
        getFreeSlot(),
      ]);

      const sessions = sessionsResponse.data || [];
      setActiveSessions(sessions);
      setSlotInfo(slotResponse);
    } catch (error) {
      console.error("[SlotMap] Error fetching data:", error);
      if (error instanceof ApiError) {
        toast.error("Failed to fetch slot data", {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slotNumber: number) => {
    return activeSessions.find((s) => s.slotNumber === slotNumber) || null;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSlotGrid = () => {
    if (!slotInfo) return null;

    const slots = Array.from({ length: slotInfo.totalSlots }, (_, i) => i + 1);

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* ... */}
        <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 lg:gap-4">
          {slots.map((slotNumber) => (
            <SlotItem
              key={slotNumber}
              slotNumber={slotNumber}
              session={getSlotStatus(slotNumber)}
              formatTime={formatTime}
              predictionsEnabled={settings.enabled}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* ... */}
    </div>
  );
};

export default SlotMap;