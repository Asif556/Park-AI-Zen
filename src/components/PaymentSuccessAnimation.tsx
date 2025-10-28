import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, Star, CreditCard, Clock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
interface PaymentSuccessAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  vehicleNumber?: string;
  paymentMethod?: string;
  duration?: string;
}
export function PaymentSuccessAnimation({
  isOpen,
  onClose,
  amount,
  vehicleNumber,
  paymentMethod,
  duration,
}: PaymentSuccessAnimationProps) {
  const [showContent, setShowContent] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; color: string }>>([]);
  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      setShowCheckmark(false);
      const colors = ['text-green-500', 'text-yellow-500', 'text-blue-500', 'text-purple-500', 'text-pink-500', 'text-emerald-500'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 0.4,
        size: Math.random() * 2 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      const checkTimer = setTimeout(() => setShowCheckmark(true), 200);
      const contentTimer = setTimeout(() => setShowContent(true), 600);
      const closeTimer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => {
        clearTimeout(checkTimer);
        clearTimeout(contentTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, onClose]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50 p-0 shadow-2xl">
        <div className="relative flex flex-col items-center justify-center min-h-[450px] p-8">
          {}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          {}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                animation: `particle-float 2s ease-out forwards`,
                animationDelay: `${particle.delay}s`,
                '--particle-x': `${particle.x}px`,
                '--particle-y': `${particle.y}px`,
              } as React.CSSProperties}
            >
              {particle.id % 4 === 0 ? (
                <Sparkles className={`h-${particle.size} w-${particle.size} ${particle.color}`} />
              ) : particle.id % 4 === 1 ? (
                <Star className={`h-${particle.size} w-${particle.size} ${particle.color}`} fill="currentColor" />
              ) : particle.id % 4 === 2 ? (
                <div className={`w-${particle.size} h-${particle.size} rounded-full ${particle.color.replace('text-', 'bg-')}`} />
              ) : (
                <div className={`w-1 h-3 rounded-full ${particle.color.replace('text-', 'bg-')}`} />
              )}
            </div>
          ))}
          {}
          <div className="relative z-10 mb-8 animate-in zoom-in duration-700 ease-out">
            {}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-green-500/20 animate-ripple" style={{ animationDelay: '0s' }} />
              <div className="absolute w-32 h-32 rounded-full bg-green-500/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
            </div>
            {}
            <div className="relative">
              {}
              <svg className="absolute inset-0 w-36 h-36 -rotate-90 drop-shadow-2xl">
                <circle
                  cx="72"
                  cy="72"
                  r="68"
                  className="fill-none stroke-green-500/10"
                  strokeWidth="2"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="68"
                  className="fill-none stroke-green-500"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="427"
                  strokeDashoffset="427"
                  style={{
                    animation: 'draw-circle 1s ease-out forwards',
                    filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))',
                  }}
                />
              </svg>
              {}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full shadow-inner" />
                {}
                {showCheckmark && (
                  <CheckCircle2 
                    className="relative h-24 w-24 text-green-500 drop-shadow-2xl animate-in zoom-in duration-500" 
                    strokeWidth={2.5}
                    style={{
                      filter: 'drop-shadow(0 4px 16px rgba(34, 197, 94, 0.4))',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {}
          <div className={`text-center space-y-3 transition-all duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-700 delay-300">
              Payment Successful! ✓
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-green-500/50" />
              <p className="text-sm font-medium text-muted-foreground animate-in slide-in-from-bottom duration-700 delay-400">
                Transaction completed successfully
              </p>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-green-500/50" />
            </div>
          </div>
          {}
          {showContent && (
            <div className="mt-8 w-full space-y-4 animate-in slide-in-from-bottom duration-700 delay-500">
              {}
              {amount !== undefined && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-300" />
                  <div className="relative flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-2xl backdrop-blur-sm border-2 border-green-500/30 shadow-xl">
                    <div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Amount Paid</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm text-muted-foreground">₹</span>
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {amount}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                      <CreditCard className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>
              )}
              {}
              {vehicleNumber && (
                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-900/60 rounded-xl backdrop-blur-sm border border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-sm font-medium text-muted-foreground">Vehicle Number</span>
                  <span className="text-base font-bold text-foreground px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/30">
                    {vehicleNumber}
                  </span>
                </div>
              )}
              {}
              <div className="grid grid-cols-2 gap-3">
                {duration && (
                  <div className="group p-4 bg-gradient-to-br from-white/60 to-green-50/60 dark:from-gray-900/60 dark:to-green-950/60 rounded-xl backdrop-blur-sm border border-green-500/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Duration</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{duration}</p>
                  </div>
                )}
                {paymentMethod && (
                  <div className="group p-4 bg-gradient-to-br from-white/60 to-emerald-50/60 dark:from-gray-900/60 dark:to-emerald-950/60 rounded-xl backdrop-blur-sm border border-green-500/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Method</p>
                    </div>
                    <p className="text-lg font-bold text-foreground uppercase">
                      {paymentMethod}
                    </p>
                  </div>
                )}
              </div>
              {}
              <div className="text-center pt-3 animate-in fade-in duration-700 delay-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-full border border-green-500/20">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Thank you for using our service!
                  </p>
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        {}
        <style>{`
          @keyframes draw-circle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes particle-float {
            0% {
              transform: translate(0, 0) scale(0);
              opacity: 1;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translate(var(--particle-x), var(--particle-y)) scale(1);
              opacity: 0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
export default PaymentSuccessAnimation;
