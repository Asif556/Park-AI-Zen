import React from 'react';
import { useParkingPrediction } from '@/hooks/use-parking-prediction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
interface PredictionCardProps {
  slotId: number;
  autoRefresh?: boolean;
}
export function PredictionCard({ slotId, autoRefresh = true }: PredictionCardProps) {
  const { prediction, loading, error, refetch } = useParkingPrediction(slotId, autoRefresh);
  if (loading && !prediction) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Slot {slotId} Prediction
          </CardTitle>
          <CardDescription>Loading prediction data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Slot {slotId} Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Slot {prediction?.slot_id || slotId} Prediction
          </span>
          <Badge variant={prediction?.current_status === 'free' ? 'default' : 'destructive'}>
            {prediction?.current_status || 'Unknown'}
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-powered availability prediction
          {autoRefresh && ' • Auto-refreshes every 30s'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Predicted Free In</p>
              <p className="text-3xl font-bold">
                {prediction?.predicted_free_in_minutes !== null 
                  ? `${prediction?.predicted_free_in_minutes} min`
                  : 'N/A'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        {}
        {prediction?.confidence !== null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold">
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(prediction.confidence * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
        )}
        {}
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
export default PredictionCard;
