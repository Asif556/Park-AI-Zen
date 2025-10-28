import { useState } from 'react';
import { OccupancyPredictionChart } from '@/components/OccupancyPredictionChart';
import { PredictionCard } from '@/components/PredictionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Clock } from 'lucide-react';
export function AnalyticsDashboard() {
  const [selectedSlots] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Parking Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          AI-powered predictions and insights for parking management
        </p>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Occupancy Trend
          </TabsTrigger>
          <TabsTrigger value="slots" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Slot Predictions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <OccupancyPredictionChart autoRefresh={true} refreshInterval={60000} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Prediction Accuracy</CardDescription>
                <CardTitle className="text-3xl">85%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Average confidence across all predictions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Peak Hour</CardDescription>
                <CardTitle className="text-3xl">2:00 PM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Highest predicted occupancy today
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Wait Time</CardDescription>
                <CardTitle className="text-3xl">12 min</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Expected wait for next available slot
                </p>
              </CardContent>
            </Card>
          </div>
          {}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How Predictions Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">1. Data Collection:</span> The system
                fetches predictions for all {selectedSlots.length} parking slots from the AI backend.
              </p>
              <p>
                <span className="font-semibold text-foreground">2. Time Series Analysis:</span> Predictions
                are calculated at 5-minute intervals (0, 5, 10, ... 60 minutes).
              </p>
              <p>
                <span className="font-semibold text-foreground">3. Occupancy Calculation:</span> For each
                time point, the system counts how many slots will still be occupied based on predicted
                free times.
              </p>
              <p>
                <span className="font-semibold text-foreground">4. Trend Visualization:</span> The chart
                displays the predicted occupancy percentage over time, helping you plan parking accordingly.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="slots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Slot Predictions</CardTitle>
              <CardDescription>
                Real-time predictions for selected parking slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSlots.map(slotId => (
                  <PredictionCard key={slotId} slotId={slotId} autoRefresh={true} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default AnalyticsDashboard;
