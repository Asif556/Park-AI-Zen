import { Loader2 } from 'lucide-react';
export function SplineLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/5 to-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D Avatar...</p>
      </div>
    </div>
  );
}
export default SplineLoader;
