import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { getFreeSlot, getOverallPrediction } from '@/lib/api';
import { usePredictionSettings } from '@/contexts/PredictionSettingsContext';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
interface PredictionData {
  predicted_free_in_minutes: number | null;
  confidence: number;
  slot_id: number;
  current_status: 'occupied' | 'free';
}
interface Insight {
  type: 'slot-availability' | 'occupancy-trend';
  message: string;
  icon: 'clock' | 'trending';
  priority: number;
  slotId?: number;
  minutes?: number;
}
export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = usePredictionSettings();
  useEffect(() => {
    if (!settings.enabled) {
      setInsights([]);
      setLoading(false);
      return;
    }
    fetchInsights();
    const interval = setInterval(fetchInsights, 120000);
    return () => clearInterval(interval);
  }, [settings.enabled]);
  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const slotInfo = await getFreeSlot();
      const currentOccupied = slotInfo.totalSlots - slotInfo.availableSlots;
      const currentOccupancyPercent = Math.round((currentOccupied / slotInfo.totalSlots) * 100);
      const overallPrediction = await getOverallPrediction();
      if (!overallPrediction.success) {
        throw new Error('Prediction API returned unsuccessful response');
      }
      const prediction = overallPrediction.prediction;
      const expectedOccupancyPercent = prediction.occupancy_percentage;
      const total = prediction.total_slots;
      const predictionPromises = [];
      for (let slotId = 1; slotId <= total; slotId++) {
        predictionPromises.push(
          axios.get<any>(`${API_BASE_URL}/predict-availability`, {
            params: { slot_id: slotId },
            timeout: 10000,
          }).catch(() => null) // Ignore failed predictions
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
        })
        .filter(pred => 
          pred.current_status === 'occupied' && 
          pred.predicted_free_in_minutes !== null &&
          pred.predicted_free_in_minutes > 0
        );
      predictions.sort((a, b) => 
        (a.predicted_free_in_minutes || Infinity) - (b.predicted_free_in_minutes || Infinity)
      );
      const newInsights: Insight[] = [];
      const top3 = predictions.slice(0, 3);
      top3.forEach((pred, index) => {
        if (pred.predicted_free_in_minutes !== null) {
          newInsights.push({
            type: 'slot-availability',
            message: `Slot ${pred.slot_id} will free up in ~${pred.predicted_free_in_minutes} min`,
            icon: 'clock',
            priority: index + 1,
            slotId: pred.slot_id,
            minutes: pred.predicted_free_in_minutes,
          });
        }
      });
      newInsights.push({
        type: 'occupancy-trend',
        message: `Expected occupancy: ${expectedOccupancyPercent}% in next 30 min (currently ${currentOccupancyPercent}%)`,
        icon: 'trending',
        priority: 4,
      });
      setInsights(newInsights);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">AI Insights</CardTitle>
              <CardDescription>Intelligent predictions for parking management</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!settings.enabled ? (
          <div className="text-sm text-muted-foreground">
            AI predictions are currently disabled. Enable them in the control panel above.
          </div>
        ) : loading && insights.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>Analyzing parking data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No insights available. Waiting for occupied slots...
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className={`p-2 rounded-full ${
                  insight.icon === 'clock' 
                    ? 'bg-blue-500/10 text-blue-600' 
                    : 'bg-green-500/10 text-green-600'
                }`}>
                  {insight.icon === 'clock' ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {insight.message}
                  </p>
                  {insight.type === 'slot-availability' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Priority #{insight.priority} • Available soon
                    </p>
                  )}
                </div>
                {insight.minutes !== undefined && insight.minutes < 10 && (
                  <Badge variant="default" className="bg-green-500 text-white">
                    Soon
                  </Badge>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Auto-refreshes every 2 minutes
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default AIInsights;
