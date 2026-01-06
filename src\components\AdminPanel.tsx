import { useState, useEffect } from "react";
import { RefreshCw, Power, AlertCircle, Search, X, LogOut, Users, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { ParkingToken } from "@/types/parking";
import { getRecords, restartSystem, getParkingAreaStats, ApiError } from "@/lib/api";
import { AIInsights } from "@/components/AIInsights";
import { AIInsightsChat } from "@/components/AIInsightsChat";
import { PredictionControlPanel } from "@/components/PredictionControlPanel";
import { AdminTableSkeleton } from "@/components/ParkingSessionSkeleton";
import EmployeeManagement from "@/components/EmployeeManagement";

interface ParkingStats {
  parking_area_id: string;
  parking_area_name: string;
  total_slots: number;
  filled_slots: number;
  free_slots: number;
  occupancy_percentage: number;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { areaId } = useParams<{ areaId?: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [records, setRecords] = useState<ParkingToken[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [parkingStats, setParkingStats] = useState<ParkingStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const recordsPerPage = 100;

  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchRecords(), fetchParkingStats()]);
      setInitialLoading(false);
    };
    initializeData();
  }, [currentPage, areaId]);

  const fetchParkingStats = async () => {
    setStatsLoading(true);
    try {
      const response = await getParkingAreaStats(areaId);
      if (response.success) {
        setParkingStats(response.data);
      }
    } catch (error) {
      console.error("[AdminPanel] Error fetching parking stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecords = async (vehicleNumber?: string) => {
    setLoading(true);
    try {
      const params = {
        limit: recordsPerPage,
        skip: currentPage * recordsPerPage,
        ...(areaId && { parkingAreaId: areaId }),
        ...(vehicleNumber && { vehicleNumber }),
      };

      const response = await getRecords(params);
      const recordsData = Array.isArray(response) ? response : response.data || [];
      const meta = response.meta || { total: recordsData.length, returned: recordsData.length };

      setRecords(recordsData);
      setTotalRecords(meta.total || 0);

      const message = vehicleNumber
        ? `Found ${meta.returned || recordsData.length} records for vehicle ${vehicleNumber}${areaId ? ` in ${areaId}` : ''}`
        : `Loaded ${meta.returned || recordsData.length} of ${meta.total || recordsData.length} records${areaId ? ` for ${areaId}` : ''}`;

      toast.success("Records refreshed successfully", {
        description: message,
      });
    } catch (error) {
      console.error("[AdminPanel] Error fetching records:", error);
      if (error instanceof ApiError) {
        toast.error("Failed to fetch records", {
          description: error.message,
        });
      } else {
        toast.error("Failed to fetch records", {
          description: "Please check your connection and try again.",
        });
      }
      setRecords([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setCurrentPage(0);
      fetchRecords(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(0);
    fetchRecords();
  };

  const handleSystemRestart = async () => {
    try {
      toast.info("System restart initiated", {
        description: "Camera and sensors will reboot...",
      });
      await restartSystem('all');
      toast.success("System restarted successfully", {
        description: "All components are restarting",
      });
    } catch (error) {
      console.error("Error restarting system:", error);
      if (error instanceof ApiError) {
        toast.error("System restart failed", {
          description: error.message,
        });
      } else {
        toast.error("System restart failed", {
          description: "Please try again or contact support.",
        });
      }
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    // ... (rest of the code remains the same)
  );
};

export default AdminPanel;