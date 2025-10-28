import { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Send, Sparkles, Bot, User, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { getChatbotResponse, enhancePrompt } from '@/lib/api';
import { SplineLoader } from '@/components/SplineLoader';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
export function AIInsightsChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showEnhanceHint, setShowEnhanceHint] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [isSplineMinimized, setIsSplineMinimized] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enhanceButtonRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  useEffect(() => {
    if (enhanceButtonRef.current && showEnhanceHint) {
      setButtonRect(enhanceButtonRef.current.getBoundingClientRect());
    }
  }, [showEnhanceHint]);
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setShowEnhanceHint(false);
    if (inputValue.trim().length > 0 && !loading && !enhancing) {
      typingTimeoutRef.current = setTimeout(() => {
        setShowEnhanceHint(true);
      }, 1000);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputValue, loading, enhancing]);
  useEffect(() => {
    const handleScroll = () => {
      if (showEnhanceHint) {
        setShowEnhanceHint(false);
      }
    };
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showEnhanceHint]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) {
      return;
    }
    setShowEnhanceHint(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    try {
      const response = await getChatbotResponse(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleEnhancePrompt = async () => {
    if (!inputValue.trim() || enhancing || loading) {
      return;
    }
    setShowEnhanceHint(false);
    setEnhancing(true);
    try {
      const result = await enhancePrompt(inputValue.trim());
      if (inputRef.current) {
        inputRef.current.style.transition = 'opacity 0.2s ease-out';
        inputRef.current.style.opacity = '0';
        setTimeout(() => {
          setInputValue(result.enhancedPrompt);
          if (inputRef.current) {
            inputRef.current.style.opacity = '1';
          }
        }, 200);
      }
      toast.success('Prompt enhanced successfully! ✨', {
        description: 'Your query has been improved with AI.',
        duration: 3000,
      });
      inputRef.current?.focus();
    } catch (error: any) {
      console.error('Error enhancing prompt:', error);
      toast.error('Enhancement Failed', {
        description: error.message || 'Could not enhance prompt. Please try again.',
      });
    } finally {
      setEnhancing(false);
    }
  };
  const handleClearChat = () => {
    setMessages([]);
    toast.success('Chat history cleared');
    inputRef.current?.focus();
  };
  const suggestedQueries = [
    'What are the parking rules?',
    'How do I reserve a parking slot?',
    'What are the payment options?',
    'Tell me about parking availability',
  ];
  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
    inputRef.current?.focus();
  };
  return (
    <>
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background h-full flex flex-col overflow-hidden shadow-2xl">
      <CardHeader className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-md border border-primary/20">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                AI Parking Assistant
              </CardTitle>
              <CardDescription className="text-xs font-medium flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                Online • Ready to help
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300 shadow-sm"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSplineMinimized(!isSplineMinimized)}
              className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm"
              title={isSplineMinimized ? 'Show 3D Avatar' : 'Minimize 3D Avatar'}
            >
              {isSplineMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isSplineMinimized ? 'Show' : 'Hide'} 3D</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-0 relative overflow-hidden">
        {}
        {!isSplineMinimized && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            {!splineLoaded && !splineError && (
              <div className="absolute inset-0 z-20">
                <SplineLoader />
              </div>
            )}
            {!splineError && (
              <Spline 
                scene="https://prod.spline.design/x732KsVWBgk6qr0T/scene.splinecode"
                className="w-full h-full scale-150 spline-no-watermark"
                onLoad={() => setSplineLoaded(true)}
                onError={() => {
                  setSplineError(true);
                  console.error('Failed to load Spline scene');
                }}
              />
            )}
          </div>
        )}
        {}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 relative z-10">
          <div className="space-y-4 pb-4 pt-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="relative mb-6">
                  {}
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <div className="w-20 h-20 rounded-full bg-primary/30" />
                  </div>
                  <div className="relative p-5 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/20 shadow-2xl animate-pulse-slow">
                    <Sparkles className="h-10 w-10 text-primary drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Welcome to AI Assistant!
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed backdrop-blur-sm bg-background/50 px-6 py-3 rounded-2xl border border-border/50 shadow-sm">
                  I'm here to help you with parking-related questions. Ask me about rules, availability, reservations, and more!
                </p>
                {}
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <p className="text-xs font-semibold text-muted-foreground backdrop-blur-sm bg-background/70 px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
                      💡 Try asking
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-3 px-4 whitespace-normal hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm bg-card/90 border-2 hover:shadow-lg hover:scale-105 group rounded-xl"
                        onClick={() => handleSuggestedQuery(query)}
                      >
                        <div className="flex items-start gap-2 w-full">
                          <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                          <span className="text-xs font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-lg backdrop-blur-sm animate-pulse-slow hover:scale-110 transition-transform duration-300">
                      <Bot className="h-5 w-5 text-primary drop-shadow-sm" />
                    </div>
                  )}
                  <div
                    className={`group max-w-[75%] rounded-2xl px-5 py-3.5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] backdrop-blur-lg relative ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground rounded-tr-md border-2 border-primary/40 shadow-primary/20'
                        : 'bg-gradient-to-br from-card/95 via-card/90 to-card/85 border-2 border-border/60 rounded-tl-md shadow-lg hover:border-primary/30'
                    }`}
                  >
                    {}
                    {message.type === 'ai' && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary/40 rounded-full animate-ping opacity-50" />
                    )}
                    {}
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.type === 'user' 
                        ? 'font-medium' 
                        : 'text-foreground/90 font-normal'
                    }`}>
                      {message.content}
                    </p>
                    {}
                    <div className={`flex items-center gap-1.5 mt-2 ${
                      message.type === 'user' 
                        ? 'opacity-80 text-primary-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      <div className="w-1 h-1 rounded-full bg-current opacity-60" />
                      <p className="text-xs font-medium tracking-wide">
                        {(() => {
                          try {
                            return message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          } catch {
                            return 'Just now';
                          }
                        })()}
                      </p>
                    </div>
                    {}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-primary/20 to-transparent'
                        : 'bg-gradient-to-br from-primary/10 to-transparent'
                    }`} />
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300 border-2 border-primary-foreground/20">
                      <User className="h-5 w-5 text-primary-foreground drop-shadow-sm" />
                    </div>
                  )}
                </div>
              ))
            )}
            {}
            {loading && (
              <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-lg backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-md px-5 py-4 bg-gradient-to-br from-card/95 via-card/90 to-card/85 border-2 border-border/60 shadow-xl backdrop-blur-lg relative overflow-hidden">
                  {}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                  {}
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce shadow-sm" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce shadow-sm" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce shadow-sm" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium ml-1">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        {}
        <div className="flex-shrink-0 border-t border-border/50 p-4 bg-gradient-to-b from-card/80 to-card/90 backdrop-blur-lg relative z-10 overflow-visible">
          <form onSubmit={handleSubmit} className="flex gap-2 relative overflow-visible">
            <div className="relative flex-1 group">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything about parking..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || enhancing}
                className="w-full bg-background/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 pr-10 shadow-sm hover:shadow-md focus:shadow-lg rounded-xl h-11"
                autoFocus
              />
              {}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Sparkles className="h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors duration-300" />
              </div>
            </div>
            {}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    ref={enhanceButtonRef}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleEnhancePrompt}
                      disabled={!inputValue.trim() || loading || enhancing}
                      className="flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 h-11 w-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {enhancing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                      {}
                      {enhancing && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-blue-400/50 rounded-xl"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400/20">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    Enhance your query with AI ✨
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || loading || enhancing}
              className="flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-gradient-to-br from-primary to-primary/80 h-11 w-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="font-medium">RAG AI</span>
              </div>
              <span className="opacity-60">•</span>
              <span>Press Enter to send</span>
            </p>
            {inputValue.length > 0 && (
              <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-right-2 duration-300">
                {inputValue.length} characters
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    {}
    <AnimatePresence>
      {showEnhanceHint && buttonRect && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
          }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 20 
          }}
          style={{
            position: 'fixed',
            top: `${buttonRect.top - 60}px`,
            left: `${buttonRect.left + buttonRect.width / 2 - 100}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div className="relative">
            {}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-md"
            />
            {}
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 rounded-lg shadow-2xl border-2 border-purple-400/30 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <span className="text-sm font-bold text-white">
                  Enhance the prompt
                </span>
              </div>
              {}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-purple-600" />
            </div>
            {}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 0
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-3 w-3 text-yellow-300" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 0.5
              }}
              className="absolute -top-2 -left-2"
            >
              <Sparkles className="h-3 w-3 text-blue-300" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
export default AIInsightsChat;
