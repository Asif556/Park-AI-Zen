import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Clock, Settings2 } from 'lucide-react';
import { usePredictionSettings } from '@/contexts/PredictionSettingsContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export function PredictionControlPanel() {
  const { settings, togglePredictions, setRefreshInterval } = usePredictionSettings();
  const [isAnimating, setIsAnimating] = useState(false);
  const handleToggle = () => {
    setIsAnimating(true);
    togglePredictions();
    setTimeout(() => setIsAnimating(false), 600);
  };
  const refreshOptions = [
    { value: '15000', label: '15 seconds' },
    { value: '30000', label: '30 seconds' },
    { value: '60000', label: '1 minute' },
    { value: '120000', label: '2 minutes' },
  ];
  return (
    <Card className={`
      border-2 transition-all duration-500 
      ${settings.enabled 
        ? 'border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg shadow-primary/5' 
        : 'border-border/50 bg-muted/30'
      }
      ${isAnimating ? 'scale-[1.02]' : 'scale-100'}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`
              p-2 rounded-lg transition-all duration-500
              ${settings.enabled 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              <Sparkles className={`h-5 w-5 transition-transform duration-500 ${settings.enabled ? 'rotate-0' : 'rotate-180'}`} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Predictions
                {settings.enabled && (
                  <Badge variant="default" className="animate-pulse bg-green-500">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {settings.enabled 
                  ? 'Intelligent predictions are active' 
                  : 'Enable to see parking predictions'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="ai-predictions-toggle" className="text-sm font-medium cursor-pointer">
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id="ai-predictions-toggle"
              checked={settings.enabled}
              onCheckedChange={handleToggle}
              className={`transition-all duration-300 ${settings.enabled ? 'shadow-lg shadow-primary/30' : ''}`}
            />
          </div>
        </div>
      </CardHeader>
      {settings.enabled && (
        <CardContent className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="refresh-interval" className="text-sm font-medium">
                Auto-refresh Interval
              </Label>
            </div>
            <Select
              value={settings.refreshInterval.toString()}
              onValueChange={(value) => setRefreshInterval(parseInt(value))}
            >
              <SelectTrigger id="refresh-interval" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {refreshOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Settings2 className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">How it works</p>
              <p className="text-muted-foreground text-xs">
                When enabled, AI predictions update automatically every {refreshOptions.find(o => o.value === settings.refreshInterval.toString())?.label.toLowerCase()}.
                Slot colors and occupancy data will animate smoothly on each update.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
export default PredictionControlPanel;
