import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Car,
  DollarSign,
  Clock,
  Save,
  ArrowLeft,
  Settings,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getToken } from '@/lib/auth';

const SYSTEM_NAME = import.meta.env.VITE_SYSTEM_NAME || 'AI Smart Parking System';
const API_URL = import.meta.env.VITE_API_URL;

interface ParkingSettings {
  totalSlots: number;
  basePrice: number;
  hourlyRate: number;
}

export default function EditInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [settings, setSettings] = useState<ParkingSettings>({
    totalSlots: 100,
    basePrice: 5,
    hourlyRate: 2,
  });

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminEmail(payload.email || 'Admin');
      } catch (error) {
        setAdminEmail('Admin');
      }
    }

    // Fetch current settings
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/parking-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          totalSlots: data.totalSlots || 100,
          basePrice: data.basePrice || 5,
          hourlyRate: data.hourlyRate || 2,
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load current settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (settings.totalSlots <= 0) {
      toast.error('Total slots must be greater than 0');
      return;
    }
    if (settings.basePrice < 0) {
      toast.error('Base price cannot be negative');
      return;
    }
    if (settings.hourlyRate < 0) {
      toast.error('Hourly rate cannot be negative');
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/parking-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Settings updated successfully!');
        setTimeout(() => {
          navigate('/admin-view');
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ParkingSettings, value: string) => {
    // Allow empty string or valid numbers
    if (value === '') {
      setSettings((prev) => ({
        ...prev,
        [field]: 0,
      }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setSettings((prev) => ({
          ...prev,
          [field]: numValue,
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Blobs - Same as User View */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/95 border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">{SYSTEM_NAME}</h1>
                <p className="text-muted-foreground text-sm">Parking Configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-foreground text-sm font-medium">{adminEmail}</p>
                <p className="text-muted-foreground text-xs">Administrator</p>
              </div>
              <Button
                onClick={() => navigate('/admin-view')}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                Parking Settings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure parking lot capacity and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {/* Total Slots */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSlots" className="text-foreground flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      Total Parking Slots
                    </Label>
                    <Input
                      id="totalSlots"
                      type="number"
                      value={settings.totalSlots || ''}
                      onChange={(e) => handleInputChange('totalSlots', e.target.value)}
                      className="bg-background border-input text-foreground"
                      placeholder="Enter total number of slots"
                      min="1"
                    />
                    <p className="text-sm text-muted-foreground">
                      Total number of parking slots available in the parking lot
                    </p>
                  </div>

                  {/* Base Price */}
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Base Price (₹)
                    </Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={settings.basePrice || ''}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                      className="bg-background border-input text-foreground"
                      placeholder="Enter base price"
                      min="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Initial parking fee charged when entering the parking lot
                    </p>
                  </div>

                  {/* Hourly Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      Hourly Rate (₹/hr)
                    </Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      value={settings.hourlyRate || ''}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      className="bg-background border-input text-foreground"
                      placeholder="Enter hourly rate"
                      min="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Additional charge per hour of parking
                    </p>
                  </div>

                  {/* Preview Card */}
                  <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Pricing Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-foreground">
                        <span>Entry Fee:</span>
                        <span className="font-bold">₹{settings.basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-foreground">
                        <span>1 Hour Total:</span>
                        <span className="font-bold">
                          ₹{(settings.basePrice + settings.hourlyRate).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-foreground">
                        <span>3 Hours Total:</span>
                        <span className="font-bold">
                          ₹{(settings.basePrice + settings.hourlyRate * 3).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-foreground">
                        <span>24 Hours Total:</span>
                        <span className="font-bold">
                          ₹{(settings.basePrice + settings.hourlyRate * 24).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => navigate('/admin-view')}
                      variant="outline"
                      className="border-border"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <Car className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">{settings.totalSlots}</p>
                <p className="text-sm text-muted-foreground">Total Slots</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">₹{settings.basePrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Base Price</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <CardContent className="pt-6">
                <Clock className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">₹{settings.hourlyRate.toFixed(2)}/hr</p>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
