import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIInsightsChat } from '@/components/AIInsightsChat';
import { Card } from '@/components/ui/card';
export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div 
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[9999] flex items-center gap-2 sm:gap-3 group animate-slide-in-bottom"
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
        >
          {/* Label */}
          <div 
            className={`
              relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
              px-3 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold shadow-2xl
              transition-all duration-500 ease-out whitespace-nowrap
              text-xs sm:text-sm
              ${showLabel ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95 pointer-events-none'}
            `}
            style={{
              boxShadow: showLabel ? '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' : 'none'
            }}
          >
            <span className="relative z-10">💬 Click to Chat</span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast" />
          </div>

          {/* Button */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse-glow" 
                 style={{ transform: 'scale(1.4)' }} />
            
            {/* Rotating Dot */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 -ml-1 -mt-1 bg-accent rounded-full shadow-lg shadow-accent/50" />
            </div>
            
            {/* Main Button */}
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="
                relative h-12 w-12 sm:h-16 sm:w-16 rounded-full
                transition-all duration-500 ease-out
                bg-gradient-to-br from-primary via-blue-500 to-primary/80
                hover:scale-125 hover:rotate-[360deg]
                animate-bounce-gentle
                shadow-[0_0_30px_rgba(59,130,246,0.5),0_0_60px_rgba(59,130,246,0.3)]
                hover:shadow-[0_0_40px_rgba(59,130,246,0.7),0_0_80px_rgba(59,130,246,0.5)]
                before:absolute before:inset-0 before:rounded-full before:bg-primary/20 before:animate-pulse-ring
                after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:animate-shimmer
                overflow-visible
                group-hover:animate-none
              "
              title="Open AI Assistant"
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
              
              {/* Icon */}
              <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7 relative z-10 animate-wiggle group-hover:animate-bounce" />
              
              {/* Notification Badge */}
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-4 w-4 sm:h-5 sm:w-5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-accent to-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-br from-accent to-green-500 shadow-lg shadow-accent/50 animate-pulse-slow"></span>
              </span>
              
              {/* Sparkle Effects */}
              <span className="absolute top-1 left-1 sm:top-2 sm:left-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '0s' }} />
              <span className="absolute bottom-2 right-1 sm:bottom-3 sm:right-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '0.5s' }} />
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '1s' }} />
            </Button>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-3 sm:p-4 md:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Card */}
          <Card className="relative w-full max-w-2xl h-[85vh] sm:h-[600px] shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-full hover:bg-destructive/10 hover:text-destructive h-8 w-8 sm:h-9 sm:w-9"
              title="Close chat"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <AIInsightsChat />
          </Card>
        </div>
      )}
    </>
  );
}
export default FloatingChatbot;
