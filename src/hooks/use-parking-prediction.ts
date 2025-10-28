import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { usePredictionSettings } from '@/contexts/PredictionSettingsContext';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
interface PredictionData {
  predicted_free_in_minutes: number | null;
  confidence: number | null;
  slot_id: number;
  current_status?: 'occupied' | 'free';
}
interface ApiResponse {
  data?: PredictionData;
  predicted_free_in_minutes?: number;
  confidence?: number;
  slot_id?: number;
  current_status?: 'occupied' | 'free';
}
interface UseParkingPredictionReturn {
  prediction: PredictionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
export function useParkingPrediction(
  slotId: number,
  autoRefresh: boolean = true
): UseParkingPredictionReturn {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = usePredictionSettings();
  const fetchPrediction = useCallback(async () => {
    if (!slotId || slotId < 1) {
      setError('Invalid slot ID');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/predict-availability`,
        {
          params: { slot_id: slotId },
          timeout: 10000,
        }
      );
      const data = response.data?.data || response.data;
      setPrediction({
        predicted_free_in_minutes: data.predicted_free_in_minutes ?? null,
        confidence: data.confidence ?? null,
        slot_id: data.slot_id || slotId,
        current_status: data.current_status,
      });
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data?.message || err.response.data?.error || 'Failed to fetch prediction';
          setError(errorMessage);
        } else if (err.request) {
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(`Request error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  }, [slotId]);
  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);
  useEffect(() => {
    if (!autoRefresh || !settings.enabled) return;
    const intervalId = setInterval(() => {
      fetchPrediction();
    }, settings.refreshInterval);
    return () => clearInterval(intervalId);
  }, [autoRefresh, settings.enabled, settings.refreshInterval, fetchPrediction]);
  return {
    prediction,
    loading,
    error,
    refetch: fetchPrediction,
  };
}
export default useParkingPrediction;
