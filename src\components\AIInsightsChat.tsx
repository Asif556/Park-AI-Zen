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
    scrollToBottom(scrollAreaRef.current);
  }, [messages]);

  useEffect(() => {
    if (enhanceButtonRef.current && showEnhanceHint) {
      setButtonRect(enhanceButtonRef.current.getBoundingClientRect());
    }
  }, [showEnhanceHint]);

  useEffect(() => {
    const timeoutId = typingTimeoutRef.current;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (inputValue.trim().length > 0 && !loading && !enhancing) {
      typingTimeoutRef.current = setTimeout(() => {
        setShowEnhanceHint(true);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
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
    // ... (rest of the JSX remains the same)
  );
}

const scrollToBottom = (scrollAreaRef: HTMLDivElement | null) => {
  if (scrollAreaRef) {
    const scrollContainer = scrollAreaRef.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }
};