import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
interface PredictionSettings {
  enabled: boolean;
  refreshInterval: number;
}
interface PredictionSettingsContextType {
  settings: PredictionSettings;
  togglePredictions: () => void;
  setRefreshInterval: (interval: number) => void;
}
const PredictionSettingsContext = createContext<PredictionSettingsContextType | undefined>(undefined);
const STORAGE_KEY = 'parking-prediction-settings';
export function PredictionSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PredictionSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
      }
    }
    return {
      enabled: true,
      refreshInterval: 30000,
    };
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);
  const togglePredictions = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };
  const setRefreshInterval = (interval: number) => {
    setSettings(prev => ({
      ...prev,
      refreshInterval: interval,
    }));
  };
  return (
    <PredictionSettingsContext.Provider value={{ settings, togglePredictions, setRefreshInterval }}>
      {children}
    </PredictionSettingsContext.Provider>
  );
}
export function usePredictionSettings() {
  const context = useContext(PredictionSettingsContext);
  if (!context) {
    throw new Error('usePredictionSettings must be used within PredictionSettingsProvider');
  }
  return context;
}
