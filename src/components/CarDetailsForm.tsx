import { useState } from "react";
import { Car, User, Phone, Palette, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface CarDetailsFormProps {
  onSubmit: (details: CarDetails) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}
export interface CarDetails {
  vehicleType?: 'sedan' | 'suv' | 'bike' | 'truck' | 'van' | 'other';
  ownerName?: string;
  ownerPhone?: string;
  vehicleColor?: string;
  vehicleModel?: string;
}
const CarDetailsForm = ({ onSubmit, onCancel, isProcessing = false }: CarDetailsFormProps) => {
  const [details, setDetails] = useState<CarDetails>({});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };
  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
          <Car className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Add Vehicle Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Optional - These details will be stored with the parking entry
        </p>
        <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Vehicle type (Car/Bike) will be automatically detected by AI
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Vehicle Type
          </Label>
          <Select
            value={details.vehicleType}
            onValueChange={(value: any) => setDetails({ ...details, vehicleType: value })}
          >
            <SelectTrigger id="vehicleType">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {}
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Owner Name
          </Label>
          <Input
            id="ownerName"
            type="text"
            placeholder="Enter owner name"
            value={details.ownerName || ''}
            onChange={(e) => setDetails({ ...details, ownerName: e.target.value })}
          />
        </div>
        {}
        <div className="space-y-2">
          <Label htmlFor="ownerPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Owner Phone
          </Label>
          <Input
            id="ownerPhone"
            type="tel"
            placeholder="+1234567890"
            value={details.ownerPhone || ''}
            onChange={(e) => setDetails({ ...details, ownerPhone: e.target.value })}
          />
        </div>
        {}
        <div className="space-y-2">
          <Label htmlFor="vehicleColor" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Vehicle Color
          </Label>
          <Input
            id="vehicleColor"
            type="text"
            placeholder="e.g., Blue, Red, Black"
            value={details.vehicleColor || ''}
            onChange={(e) => setDetails({ ...details, vehicleColor: e.target.value })}
          />
        </div>
        {}
        <div className="space-y-2">
          <Label htmlFor="vehicleModel" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Vehicle Model
          </Label>
          <Input
            id="vehicleModel"
            type="text"
            placeholder="e.g., Honda Civic, Toyota Camry"
            value={details.vehicleModel || ''}
            onChange={(e) => setDetails({ ...details, vehicleModel: e.target.value })}
          />
        </div>
        {}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            type="submit"
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? "Processing..." : "Submit"}
          </Button>
        </div>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-4">
        You can skip this step - the vehicle number will be detected from the image automatically
      </p>
    </Card>
  );
};
export default CarDetailsForm;
