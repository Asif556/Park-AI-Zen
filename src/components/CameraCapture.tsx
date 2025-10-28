import { useState, useRef, useEffect } from "react";
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}
const CameraCapture = ({ onCapture, onCancel, isProcessing }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
      toast.error("Camera access denied", {
        description: "Please allow camera access to capture vehicle image"
      });
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };
  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };
  if (error) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </Card>
    );
  }
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Capture Vehicle Image
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured vehicle"
                className="w-full h-full object-cover"
              />
            )}
            {}
            {!capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-primary border-dashed rounded-lg w-3/4 h-2/3 flex items-center justify-center">
                  <p className="text-white bg-black/50 px-4 py-2 rounded-lg text-sm">
                    Align vehicle number plate here
                  </p>
                </div>
              </div>
            )}
          </div>
          {}
          <canvas ref={canvasRef} className="hidden" />
          {}
          <div className="flex gap-2 justify-center">
            {!capturedImage ? (
              <Button
                onClick={capturePhoto}
                size="lg"
                className="w-full max-w-xs"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture Photo
              </Button>
            ) : (
              <>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                  disabled={isProcessing}
                >
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  size="lg"
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Confirm & Process
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Make sure the vehicle number plate is clearly visible and well-lit
          </p>
        </div>
      </Card>
    </div>
  );
};
export default CameraCapture;
