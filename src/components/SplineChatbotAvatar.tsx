import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Bot, MessageCircle } from 'lucide-react';
import { SplineLoader } from '@/components/SplineLoader';
interface SplineChatbotAvatarProps {
  onClickNavigate?: () => void;
  position?: 'fixed' | 'absolute';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}
export function SplineChatbotAvatar({ 
  onClickNavigate, 
  position = 'fixed',
  size = 'medium',
  showLabel = true 
}: SplineChatbotAvatarProps) {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-28 h-28 md:w-32 md:h-32',
    large: 'w-40 h-40 md:w-48 md:h-48',
  };
  const positionClasses = position === 'fixed' 
    ? 'fixed bottom-20 right-6 md:bottom-24 md:right-8 z-40' 
    : 'absolute bottom-4 right-4 z-10';
  return (
    <div 
      className={`${positionClasses} ${sizeClasses[size]} group ${onClickNavigate ? 'cursor-pointer' : ''}`}
      onClick={onClickNavigate}
      title={onClickNavigate ? 'Click to open AI Assistant' : undefined}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/10 via-background/50 to-transparent backdrop-blur-sm shadow-2xl transition-all duration-300 group-hover:shadow-primary/30 group-hover:scale-105">
        {!splineLoaded && !splineError && (
          <div className="absolute inset-0 z-20">
            <SplineLoader />
          </div>
        )}
        {splineError ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <Bot className="h-12 w-12 text-primary/50 animate-pulse" />
              <p className="text-xs text-muted-foreground">3D Avatar unavailable</p>
            </div>
          </div>
        ) : (
          <Spline 
            scene="https://prod.spline.design/x732KsVWBgk6qr0T/scene.splinecode"
            className="w-full h-full transition-transform duration-500 group-hover:scale-110 spline-no-watermark"
            onLoad={() => setSplineLoaded(true)}
            onError={() => {
              setSplineError(true);
              console.error('Failed to load Spline scene');
            }}
          />
        )}
        {}
        {showLabel && (
          <div className="absolute bottom-4 left-2 right-2 z-30 transition-opacity duration-300">
            <div className="bg-primary/95 backdrop-blur-md rounded-full px-3 py-1.5 border border-primary/30 shadow-lg">
              <p className="text-xs font-medium text-primary-foreground text-center flex items-center justify-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {onClickNavigate ? 'Click to Chat' : 'AI Assistant'}
              </p>
            </div>
          </div>
        )}
        {}
        {onClickNavigate && (
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default SplineChatbotAvatar;
