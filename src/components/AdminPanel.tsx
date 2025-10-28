import { useState, useEffect } from "react";
import { RefreshCw, Power, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { getRecords, restartSystem, ApiError } from "@/lib/api";
import { AIInsights } from "@/components/AIInsights";
import { AIInsightsChat } from "@/components/AIInsightsChat";
import { PredictionControlPanel } from "@/components/PredictionControlPanel";
import { AdminTableSkeleton } from "@/components/ParkingSessionSkeleton";
const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [records, setRecords] = useState<ParkingToken[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const recordsPerPage = 100;
  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      await fetchRecords();
      setInitialLoading(false);
    };
    initializeData();
  }, [currentPage]);
  const fetchRecords = async (vehicleNumber?: string) => {
    setLoading(true);
    try {
      const params: any = {
        limit: recordsPerPage,
        skip: currentPage * recordsPerPage
      };
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
        ? `Found ${meta.returned || recordsData.length} records for vehicle ${vehicleNumber}`
        : `Loaded ${meta.returned || recordsData.length} of ${meta.total || recordsData.length} records`;
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Parking Records</h2>
          <p className="text-muted-foreground">Monitor all active and completed parking sessions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchRecords()}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleSystemRestart}
            variant="outline"
            size="sm"
          >
            <Power className="mr-2 h-4 w-4" />
            Restart System
          </Button>
        </div>
      </div>
      <Card className="p-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        {isSearching && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
          </p>
        )}
      </Card>
      <div className="mb-6">
        <PredictionControlPanel />
      </div>
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <AIInsights />
        </div>
        <div className="h-[600px]">
          <AIInsightsChat />
        </div>
      </div>
      <Card className="overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {initialLoading ? (
            <div className="p-6">
              <AdminTableSkeleton rows={10} />
            </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Vehicle Details</TableHead>
                <TableHead className="font-semibold">Owner Info</TableHead>
                <TableHead className="font-semibold">Slot</TableHead>
                <TableHead className="font-semibold">Entry Time</TableHead>
                <TableHead className="font-semibold">Exit Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold text-right">Charge (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {isSearching ? `No records found for "${searchQuery}"` : "No records found"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-medium">{record.vehicleNumber}</div>
                      {record.vehicleType && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.vehicleType === 'car' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {record.vehicleType === 'car' ? '🚗' : '🏍️'} {record.vehicleType}
                          </span>
                          {record.vehicleCategory && (
                            <span className="text-xs text-muted-foreground">
                              ({record.vehicleCategory})
                            </span>
                          )}
                        </div>
                      )}
                      {record.classificationConfidence && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          AI: {(record.classificationConfidence * 100).toFixed(0)}% confident
                        </div>
                      )}
                      {(record.vehicleModel || record.vehicleColor) && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {record.vehicleColor && <span>{record.vehicleColor}</span>}
                          {record.vehicleColor && record.vehicleModel && <span> • </span>}
                          {record.vehicleModel && <span>{record.vehicleModel}</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.ownerName && (
                        <div className="text-sm">{record.ownerName}</div>
                      )}
                      {record.ownerPhone && (
                        <div className="text-xs text-muted-foreground">{record.ownerPhone}</div>
                      )}
                      {!record.ownerName && !record.ownerPhone && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>Slot {record.slotNumber}</TableCell>
                    <TableCell>{formatTime(record.entryTime)}</TableCell>
                    <TableCell>{formatTime(record.exitTime)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {record.status === 'active' ? '● Active' : '✓ Completed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {record.paymentMethod && (
                        <div className="text-sm capitalize">{record.paymentMethod}</div>
                      )}
                      {record.paymentStatus && (
                        <div className={`text-xs ${
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
                    <TableCell className="text-right font-semibold">
                      {record.charge !== undefined || record.currentCharge !== undefined 
                        ? (
                          <div>
                            <div className="font-semibold">
                              ₹{record.currentCharge || record.charge}
                            </div>
                            {record.vehicleType && (
                              <div className="text-xs text-muted-foreground mt-0.5">
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
      <div className="mt-6 flex items-start gap-2 p-4 bg-muted/50 rounded-lg border border-border">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Connected to Backend API</p>
          <p className="text-muted-foreground">
            Showing {records.length} of {totalRecords} records • Search enabled • Endpoints: /api/records, /api/record, /api/entry, /api/exit
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminPanel;
