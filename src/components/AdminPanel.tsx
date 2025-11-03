import { useState, useEffect } from "react";
import { RefreshCw, Power, AlertCircle, Search, X, LogOut, Users, Lock, ParkingSquare, CheckCircle, XCircle } from "lucide-react";
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
      // Don't show error toast for stats, just log it
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecords = async (vehicleNumber?: string) => {
    setLoading(true);
    try {
      const params: any = {
        limit: recordsPerPage,
        skip: currentPage * recordsPerPage
      };
      
      // Add parking area filter if available
      if (areaId) {
        params.parkingAreaId = areaId;
      }
      
      if (vehicleNumber) {
        params.vehicleNumber = vehicleNumber;
      }
      
      const response = await getRecords(params);
      console.log('[AdminPanel] API Response:', response);
      const recordsData = Array.isArray(response) ? response : (response.data || []);
      const meta = response.meta || { total: recordsData.length, returned: recordsData.length };
      setRecords(recordsData);
      setTotalRecords(meta.total || 0);
      const message = vehicleNumber 
        ? `Found ${meta.returned || recordsData.length} records for vehicle ${vehicleNumber}${areaId ? ` in ${areaId}` : ''}`
        : `Loaded ${meta.returned || recordsData.length} of ${meta.total || recordsData.length} records${areaId ? ` for ${areaId}` : ''}`;
      toast.success("Records refreshed successfully", {
        description: message
      });
    } catch (error) {
      console.error("[AdminPanel] Error fetching records:", error);
      if (error instanceof ApiError) {
        toast.error("Failed to fetch records", {
          description: error.message
        });
      } else {
        toast.error("Failed to fetch records", {
          description: "Please check your connection and try again."
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
        description: "Camera and sensors will reboot..."
      });
      await restartSystem('all');
      toast.success("System restarted successfully", {
        description: "All components are restarting"
      });
    } catch (error) {
      console.error("Error restarting system:", error);
      if (error instanceof ApiError) {
        toast.error("System restart failed", {
          description: error.message
        });
      } else {
        toast.error("System restart failed", {
          description: "Please try again or contact support."
        });
      }
    }
  };
  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
            Admin Panel {areaId && <span className="text-amber-500">- {areaId}</span>}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage parking operations and employees{areaId ? ` for ${areaId}` : ''}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Button
            onClick={() => navigate('/admin/change-password')}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Lock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden md:inline">Change Password</span>
            <span className="md:hidden">Password</span>
          </Button>
          <Button
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_data');
              navigate('/login');
            }}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden md:inline">Logout</span>
            <span className="md:hidden">Logout</span>
          </Button>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="parking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="parking">Parking Records</TabsTrigger>
          <TabsTrigger value="employees">
            <Users className="mr-2 h-4 w-4" />
            Employee Management
          </TabsTrigger>
        </TabsList>

        {/* Parking Records Tab */}
        <TabsContent value="parking" className="space-y-4">
          {/* Parking Stats Cards */}
          {parkingStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <ParkingSquare className="h-4 w-4" />
                    Total Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {parkingStats.total_slots}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {parkingStats.parking_area_name}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Filled Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-100">
                    {parkingStats.filled_slots}
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Currently occupied
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Free Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">
                    {parkingStats.free_slots}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Available now
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Occupancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {parkingStats.occupancy_percentage}%
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Current utilization
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-2">
          <Button
            onClick={() => {
              fetchRecords();
              fetchParkingStats();
            }}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <RefreshCw className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Button
            onClick={handleSystemRestart}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Power className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden md:inline">Restart System</span>
            <span className="md:hidden">Restart</span>
          </Button>
        </div>

        {/* Search Section */}
        <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base h-9 sm:h-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
          >
            <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Search
          </Button>
        </div>
        {isSearching && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
          </p>
        )}
      </Card>

      {/* Prediction Control Panel */}
      <div className="mb-4 sm:mb-6">
        <PredictionControlPanel />
      </div>

      {/* AI Insights Section */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-full">
          <AIInsights />
        </div>
        <div className="h-[500px] sm:h-[600px]">
          <AIInsightsChat />
        </div>
      </div>
      {/* Records Table */}
      <Card className="overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {initialLoading ? (
            <div className="p-4 sm:p-6">
              <AdminTableSkeleton rows={10} />
            </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Vehicle Details</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Owner Info</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Slot</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Entry Time</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Exit Time</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Payment</TableHead>
                <TableHead className="font-semibold text-right text-xs sm:text-sm whitespace-nowrap">Charge (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 sm:py-8">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {isSearching ? `No records found for "${searchQuery}"` : "No records found"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-xs sm:text-sm">
                      <div className="font-medium">{record.vehicleNumber}</div>
                      {record.vehicleType && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                            record.vehicleType === 'car' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {record.vehicleType === 'car' ? '🚗' : '🏍️'} {record.vehicleType}
                          </span>
                          {record.vehicleCategory && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              ({record.vehicleCategory})
                            </span>
                          )}
                        </div>
                      )}
                      {record.classificationConfidence && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          AI: {(record.classificationConfidence * 100).toFixed(0)}% confident
                        </div>
                      )}
                      {(record.vehicleModel || record.vehicleColor) && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          {record.vehicleColor && <span>{record.vehicleColor}</span>}
                          {record.vehicleColor && record.vehicleModel && <span> • </span>}
                          {record.vehicleModel && <span>{record.vehicleModel}</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {record.ownerName && (
                        <div className="text-xs sm:text-sm">{record.ownerName}</div>
                      )}
                      {record.ownerPhone && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{record.ownerPhone}</div>
                      )}
                      {!record.ownerName && !record.ownerPhone && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">Slot {record.slotNumber}</TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatTime(record.entryTime)}</TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatTime(record.exitTime)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                        record.status === 'active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {record.status === 'active' ? '● Active' : '✓ Completed'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {record.paymentMethod && (
                        <div className="text-xs sm:text-sm capitalize">{record.paymentMethod}</div>
                      )}
                      {record.paymentStatus && (
                        <div className={`text-[10px] sm:text-xs ${
                          record.paymentStatus === 'completed' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {record.paymentStatus}
                        </div>
                      )}
                      {!record.paymentMethod && !record.paymentStatus && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm whitespace-nowrap">
                      {record.charge !== undefined || record.currentCharge !== undefined 
                        ? (
                          <div>
                            <div className="font-semibold">
                              ₹{record.currentCharge || record.charge}
                            </div>
                            {record.vehicleType && (
                              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                {record.vehicleType === 'car' 
                                  ? '₹20+₹10/hr' 
                                  : record.vehicleType === 'bike'
                                  ? '₹10+₹5/hr'
                                  : ''
                                }
                              </div>
                            )}
                          </div>
                        )
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </div>
      </Card>
          {/* Footer Info */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start gap-2 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-medium text-foreground mb-1">Connected to Backend API</p>
              <p className="text-muted-foreground">
                Showing {records.length} of {totalRecords} records • Search enabled • Endpoints: /api/records, /api/record, /api/entry, /api/exit
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Employee Management Tab */}
        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPanel;
