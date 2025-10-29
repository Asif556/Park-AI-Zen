import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import { getFreeSlot } from '@/lib/api';
const API_BASE_URL = import.meta.env.VITE_API_URL;
interface PredictionData {
  predicted_free_in_minutes: number | null;
  confidence: number;
  slot_id: number;
  current_status: 'occupied' | 'free';
}
interface ChartDataPoint {
  time: string;
  timeMinutes: number;
  occupancyPercent: number;
  occupied: number;
  total: number;
}
interface OccupancyPredictionChartProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}
export function OccupancyPredictionChart({
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute default
}: OccupancyPredictionChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSlots, setTotalSlots] = useState<number>(0);
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(0);
  const fetchOccupancyPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const slotInfo = await getFreeSlot();
      const total = slotInfo.totalSlots;
      setTotalSlots(total);
      const currentOccupied = total - slotInfo.availableSlots;
      setCurrentOccupancy(Math.round((currentOccupied / total) * 100));
      const predictionPromises = [];
      for (let slotId = 1; slotId <= total; slotId++) {
        predictionPromises.push(
          axios.get<any>(`${API_BASE_URL}/predict-availability`, {
            params: { slot_id: slotId },
            timeout: 10000,
          }).catch(err => {
            console.warn(`Failed to fetch prediction for slot ${slotId}:`, err.message);
            return null;
          })
        );
      }
      const responses = await Promise.all(predictionPromises);
      const predictions: PredictionData[] = responses
        .filter(response => response !== null)
        .map(response => {
          const data = response.data?.data || response.data;
          return {
            predicted_free_in_minutes: data.predicted_free_in_minutes ?? null,
            confidence: data.confidence ?? 0,
            slot_id: data.slot_id,
            current_status: data.current_status || 'free',
          };
        });
      const timeIntervals = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      const occupancyData: ChartDataPoint[] = [];
      for (const timeMinutes of timeIntervals) {
        let occupiedCount = 0;
        predictions.forEach(pred => {
          if (pred.current_status === 'occupied') {
            if (
              pred.predicted_free_in_minutes === null ||
              pred.predicted_free_in_minutes > timeMinutes
            ) {
              occupiedCount++;
            }
          } else {
          }
        });
        const occupancyPercent = total > 0 ? Math.round((occupiedCount / total) * 100) : 0;
        occupancyData.push({
          time: timeMinutes === 0 ? 'Now' : `+${timeMinutes}m`,
          timeMinutes,
          occupancyPercent,
          occupied: occupiedCount,
          total,
        });
      }
      setChartData(occupancyData);
    } catch (err) {
      console.error('Error fetching occupancy predictions:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch predictions');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOccupancyPredictions();
  }, []);
  useEffect(() => {
    if (!autoRefresh) return;
    const intervalId = setInterval(() => {
      fetchOccupancyPredictions();
    }, refreshInterval);
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval]);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-1">{data.time}</p>
          <p className="text-sm text-primary">
            Occupancy: <span className="font-bold">{data.occupancyPercent}%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {data.occupied} / {data.total} slots occupied
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Predicted Occupancy Trend</CardTitle>
              <CardDescription>
                Forecasted parking occupancy over the next 60 minutes
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={fetchOccupancyPredictions}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              onClick={fetchOccupancyPredictions}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}
        {loading && chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground">Loading prediction data...</p>
          </div>
        ) : (
          <>
            {}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">Current Occupancy</p>
                </div>
                <p className="text-2xl font-bold">{currentOccupancy}%</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-sm text-muted-foreground">In 30 Minutes</p>
                </div>
                <p className="text-2xl font-bold">
                  {chartData.find(d => d.timeMinutes === 30)?.occupancyPercent || 0}%
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <p className="text-sm text-muted-foreground">In 60 Minutes</p>
                </div>
                <p className="text-2xl font-bold">
                  {chartData.find(d => d.timeMinutes === 60)?.occupancyPercent || 0}%
                </p>
              </div>
            </div>
            {}
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="time"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    unit="%"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{
                      value: 'Occupancy %',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="occupancyPercent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Predicted Occupancy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {}
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="font-medium">Total Slots:</span> {totalSlots}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <span className="font-medium">Auto-refresh:</span>{' '}
                {autoRefresh ? `Every ${refreshInterval / 1000}s` : 'Disabled'}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default OccupancyPredictionChart;
