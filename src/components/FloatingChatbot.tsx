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
      {}
      {!isOpen && (
        <div 
          className="fixed bottom-4 right-4 z-[9999] flex items-center gap-3 group animate-slide-in-bottom"
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
        >
          {}
          <div 
            className={`
              relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
              px-5 py-2.5 rounded-full font-semibold shadow-2xl
              transition-all duration-500 ease-out whitespace-nowrap
              ${showLabel ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95 pointer-events-none'}
            `}
            style={{
              boxShadow: showLabel ? '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' : 'none'
            }}
          >
            <span className="relative z-10">💬 Click to Chat</span>
            {}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast" />
          </div>
          {}
          <div className="relative">
            {}
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse-glow" 
                 style={{ transform: 'scale(1.4)' }} />
            {}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-accent rounded-full shadow-lg shadow-accent/50" />
            </div>
            {}
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="
                relative h-16 w-16 rounded-full
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
              {}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
              {}
              <MessageCircle className="h-7 w-7 relative z-10 animate-wiggle group-hover:animate-bounce" />
              {}
              <span className="absolute -top-1 -right-1 flex h-5 w-5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-accent to-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-br from-accent to-green-500 shadow-lg shadow-accent/50 animate-pulse-slow"></span>
              </span>
              {}
              <span className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '0s' }} />
              <span className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '0.5s' }} />
              <span className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full animate-sparkle opacity-0" 
                    style={{ animationDelay: '1s' }} />
            </Button>
          </div>
        </div>
      )}
      {}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
          {}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          {}
          <Card className="relative w-full max-w-2xl h-[600px] shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
              title="Close chat"
            >
              <X className="h-5 w-5" />
            </Button>
            <AIInsightsChat />
          </Card>
        </div>
      )}
    </>
  );
}
export default FloatingChatbot;
