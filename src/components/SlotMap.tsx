import { useState, useEffect } from "react";
import { RefreshCw, Car, ParkingCircle, MapPin, Clock, Grid3x3, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SplineChatbotAvatar } from "@/components/SplineChatbotAvatar";
import { ParkingLot3D } from "@/components/ParkingLot3D";
import { SlotGridSkeleton, SlotMapHeaderSkeleton } from "@/components/ParkingSessionSkeleton";
import type { ParkingToken } from "@/types/parking";
import { getRecords, getFreeSlot, ApiError } from "@/lib/api";
import { useParkingPrediction } from "@/hooks/use-parking-prediction";
import { usePredictionSettings } from "@/contexts/PredictionSettingsContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
  const [isHovered, setIsHovered] = useState(false);
  const isOccupied = session !== null;
  const { prediction } = useParkingPrediction(slotNumber, isOccupied && predictionsEnabled);
  const isPredictedFreeSoon = 
    predictionsEnabled &&
    isOccupied && 
    prediction !== null &&
    prediction !== undefined &&
    prediction.predicted_free_in_minutes !== null && 
    prediction.predicted_free_in_minutes !== undefined &&
    prediction.predicted_free_in_minutes < 10;
  const getColorClasses = () => {
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
        pulse: 'animate-pulse-slow'
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
        pulse: ''
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
        pulse: ''
      };
    }
  };
  const colors = getColorClasses();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              relative aspect-square rounded-xl border-2 cursor-pointer
              transition-all duration-500 ease-out group
              ${colors.bg} ${colors.bgHover} 
              ${colors.border} ${colors.borderHover}
              hover:scale-110 hover:-translate-y-1
              shadow-lg ${colors.glow} ${colors.glowHover}
              overflow-hidden
              ${colors.pulse}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              animation: `slot-appear 0.6s ease-out ${slotNumber * 0.02}s both`,
            }}
          >
            {}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
            {}
            <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-1 px-2 pb-1">
              <div className={`flex-1 h-0.5 ${colors.border} opacity-30`} />
              <div className={`flex-1 h-0.5 ${colors.border} opacity-30`} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
              {}
              <div className={`mb-1 transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}`}>
                {isOccupied ? (
                  <Car className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon} drop-shadow-lg`} />
                ) : (
                  <ParkingCircle className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon} drop-shadow-lg`} />
                )}
              </div>
              {}
              <span className={`text-sm sm:text-base font-bold ${colors.text} drop-shadow-md`}>
                {slotNumber}
              </span>
              {}
              {predictionsEnabled && isOccupied && prediction?.predicted_free_in_minutes !== null && prediction?.predicted_free_in_minutes !== undefined && (
                <div className={`mt-1 text-[10px] sm:text-xs font-semibold ${colors.text} flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border ${colors.border}`}>
                  <Clock className="h-3 w-3 animate-pulse" />
                  {prediction?.predicted_free_in_minutes}m
                </div>
              )}
            </div>
            {}
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <div className={`absolute w-3 h-3 rounded-full ${colors.dot.split(' ')[0]} opacity-20 animate-ping`} />
              <div className={`relative w-2.5 h-2.5 rounded-full ${colors.dot}`} />
            </div>
            {}
            {isHovered && (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                style={{
                  animation: 'shine 0.6s ease-out forwards'
                }}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs backdrop-blur-xl bg-background/95 border-2 shadow-2xl">
          {isOccupied && session ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.border} border`}>
                  <Car className={`h-4 w-4 ${colors.icon}`} />
                </div>
                <p className="font-bold text-base">
                  Slot {slotNumber} - {isPredictedFreeSoon ? '🔵 Free Soon' : '🔴 Occupied'}
                </p>
              </div>
              <div className="pl-1 space-y-1.5">
                <p className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Vehicle:</span> 
                  <span className="font-semibold">{session.vehicleNumber}</span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Entry:</span>
                  <span className="font-medium">{formatTime(session.entryTime)}</span>
                </p>
              </div>
              {predictionsEnabled && prediction && prediction.predicted_free_in_minutes !== null && (
                <>
                  <div className="border-t border-border/50 pt-2 mt-2">
                    <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      AI Prediction
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center justify-between">
                        <span className="text-muted-foreground">Free in:</span>
                        <span className="font-bold text-primary">{prediction.predicted_free_in_minutes} minutes</span>
                      </p>
                      {prediction.confidence !== null && prediction.confidence !== undefined && (
                        <p className="text-sm flex items-center justify-between">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="font-bold">{(prediction.confidence * 100).toFixed(0)}%</span>
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.border} border`}>
                  <ParkingCircle className={`h-4 w-4 ${colors.icon}`} />
                </div>
                <p className="font-bold text-base">Slot {slotNumber} - ✅ Available</p>
              </div>
              <p className="text-sm text-muted-foreground pl-1">Ready for parking</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
interface SlotMapProps {
  onNavigateToChatbot?: () => void;
}
const SlotMap = ({ onNavigateToChatbot }: SlotMapProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<ParkingToken[]>([]);
  const [slotInfo, setSlotInfo] = useState<{ slotNumber: number; totalSlots: number; availableSlots: number } | null>(null);
  const [view3D, setView3D] = useState(false);
  const { settings } = usePredictionSettings();
  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await fetchData();
      setInitialLoading(false);
    };
    initializeData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsResponse, slotResponse] = await Promise.all([
        getRecords({ status: 'active', limit: 100 }),
        getFreeSlot()
      ]);
      const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : (sessionsResponse.data || []);
      setActiveSessions(sessions);
      setSlotInfo(slotResponse);
    } catch (error) {
      console.error("[SlotMap] Error fetching data:", error);
      if (error instanceof ApiError) {
        toast.error("Failed to fetch slot data", {
          description: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const getSlotStatus = (slotNumber: number) => {
    const session = activeSessions.find(s => s.slotNumber === slotNumber);
    return session || null;
  };
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const renderSlotGrid = () => {
    if (!slotInfo) return null;
    const slots = [];
    const totalSlots = slotInfo.totalSlots;
    for (let i = 1; i <= totalSlots; i++) {
      slots.push(i);
    }
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Divider */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full border-2 border-primary/20">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-primary whitespace-nowrap">Parking Lot</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Slot Grid */}
        <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 lg:gap-4">
          {slots.map((slotNumber) => {
            const session = getSlotStatus(slotNumber);
            return (
              <SlotItem 
                key={slotNumber}
                slotNumber={slotNumber}
                session={session}
                formatTime={formatTime}
                predictionsEnabled={settings.enabled}
              />
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* Header Section */}
      {initialLoading ? (
        <SlotMapHeaderSkeleton />
      ) : (
        <>
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="truncate">Parking Slot Map</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Visual overview of all parking slots</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setView3D(!view3D)}
                variant={view3D ? "default" : "outline"}
                size="sm"
                className="gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
              >
                {view3D ? <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Box className="h-3 w-3 sm:h-4 sm:w-4" />}
                <span className="hidden xs:inline">{view3D ? "2D View" : "3D View"}</span>
                <span className="xs:hidden">{view3D ? "2D" : "3D"}</span>
              </Button>
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
              >
                <RefreshCw className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          {slotInfo && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                  <div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground">Available Slots</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-600 dark:text-green-400 tabular-nums transition-all duration-300 group-hover:scale-110">
                      {slotInfo.availableSlots}
                    </p>
                    <p className="text-[9px] sm:text-xs text-green-600/70 dark:text-green-400/70 font-medium">Ready to park</p>
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl sm:rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-500/20">
                    <ParkingCircle className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4 h-1 sm:h-1.5 bg-green-500/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 shadow-sm shadow-green-500/50"
                    style={{ width: `${(slotInfo.availableSlots / slotInfo.totalSlots) * 100}%` }}
                  />
                </div>
              </Card>

              <Card className="group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                  <div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground">Free Soon</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                      <span className="text-lg sm:text-xl lg:text-2xl">&lt;10</span>
                    </p>
                    <p className="text-[9px] sm:text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">minutes</p>
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl sm:rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/20">
                    <Clock className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 sm:h-1.5 bg-blue-500/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-1/3 shadow-sm shadow-blue-500/50 animate-pulse" />
                  </div>
                </div>
              </Card>

              <Card className="group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                  <div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground">Occupied Slots</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-600 dark:text-red-400 tabular-nums transition-all duration-300 group-hover:scale-110">
                      {slotInfo.totalSlots - slotInfo.availableSlots}
                    </p>
                    <p className="text-[9px] sm:text-xs text-red-600/70 dark:text-red-400/70 font-medium">Currently parked</p>
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl sm:rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-red-500/20">
                    <Car className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4 h-1 sm:h-1.5 bg-red-500/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 shadow-sm shadow-red-500/50"
                    style={{ width: `${((slotInfo.totalSlots - slotInfo.availableSlots) / slotInfo.totalSlots) * 100}%` }}
                  />
                </div>
              </Card>

              <Card className="group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                  <div className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tabular-nums transition-all duration-300 group-hover:scale-110">
                      {slotInfo.totalSlots}
                    </p>
                    <p className="text-[9px] sm:text-xs text-primary/70 font-medium">parking spaces</p>
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl sm:rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20">
                    <MapPin className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-primary" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4 h-1 sm:h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full w-full shadow-sm shadow-primary/50" />
                </div>
              </Card>
            </div>
          )}
        </>
      )}
      {}
      {!view3D && (
        <div className="mb-8 p-4 bg-gradient-to-r from-card/50 via-card to-card/50 backdrop-blur-sm rounded-xl border-2 border-border/50 shadow-lg">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-primary rounded-full" />
            Legend
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-400 shadow-lg shadow-green-500/30" />
              </div>
              <span className="text-sm font-medium text-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30 animate-pulse" />
              </div>
              <span className="text-sm font-medium text-foreground">Free Soon (&lt;10 min)</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-5 h-5 rounded-lg bg-gradient-to-br from-red-500 to-red-400 shadow-lg shadow-red-500/30" />
              </div>
              <span className="text-sm font-medium text-foreground">Occupied</span>
            </div>
            <div className="h-4 w-px bg-border/50 mx-2 hidden sm:block" />
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Hover over slots for details
            </div>
          </div>
        </div>
      )}
      {}
      {view3D && slotInfo ? (
        <div className="mb-8 animate-in fade-in zoom-in duration-700">
          <ParkingLot3D 
            totalSlots={slotInfo.totalSlots}
            activeSessions={activeSessions}
          />
        </div>
      ) : (
        <>
          {}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-card/80 via-card to-card/80 backdrop-blur-sm border-2 shadow-2xl relative overflow-hidden">
            {}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
              backgroundImage: `repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 20px),
                               repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 20px)`,
            }} />
            {loading && !slotInfo ? (
              <div className="relative text-center py-16">
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <RefreshCw className="relative h-12 w-12 text-primary animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">Loading slot map...</p>
                    <p className="text-sm text-muted-foreground">Please wait while we fetch the latest data</p>
                  </div>
                </div>
              </div>
            ) : initialLoading ? (
              <SlotGridSkeleton slots={50} />
            ) : (
              <div className="relative">
                {renderSlotGrid()}
              </div>
            )}
          </Card>
        </>
      )}
      {}
      {activeSessions.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Currently Parked Vehicles</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-bold text-primary">{activeSessions.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map((session, index) => (
              <Card 
                key={session.id} 
                className="group p-5 border-l-4 border-l-red-500 hover:border-l-red-400 bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-105 overflow-hidden relative"
                style={{
                  animation: `slot-appear 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md shadow-red-500/20">
                        <Car className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-bold text-base text-foreground flex items-center gap-2">
                          Slot {session.slotNumber}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30">
                            Occupied
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Active session</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                      <span className="text-xs font-medium text-muted-foreground">Vehicle Number</span>
                      <span className="text-sm font-bold text-foreground">{session.vehicleNumber}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Entry Time
                      </span>
                      <span className="text-sm font-semibold text-foreground">{formatTime(session.entryTime)}</span>
                    </div>
                  </div>
                  {}
                  <div className="absolute top-0 right-0 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {}
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
export default SlotMap;
