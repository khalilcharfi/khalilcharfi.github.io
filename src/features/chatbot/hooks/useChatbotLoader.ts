import { useState, useEffect, useCallback, useRef } from 'react';

interface ChatbotLoaderState {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface ChatbotLoaderActions {
  loadChatbot: () => void;
  reset: () => void;
}

export function useChatbotLoader(): ChatbotLoaderState & ChatbotLoaderActions {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadPromise = useRef<Promise<any> | null>(null);

  const loadChatbot = useCallback(async () => {
    if (isLoaded || isLoading || loadPromise.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load chatbot only when needed
      loadPromise.current = import('@/shared/components').then(module => {
        setIsLoaded(true);
        setIsLoading(false);
        return module;
      });

      await loadPromise.current;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load chatbot');
      setError(error);
      setIsLoading(false);
      loadPromise.current = null;
    }
  }, [isLoaded, isLoading]);

  const reset = useCallback(() => {
    setIsLoaded(false);
    setIsLoading(false);
    setError(null);
    loadPromise.current = null;
  }, []);

  // Auto-load chatbot based on user behavior
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let scrollTimeoutId: NodeJS.Timeout;
    let hasLoaded = false;

    const handleUserInteraction = () => {
      if (!hasLoaded) {
        hasLoaded = true;
        loadChatbot();
      }
    };

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 50 && !hasLoaded) {
        hasLoaded = true;
        loadChatbot();
      }
    };

    // Load chatbot on user click anywhere
    document.addEventListener('click', handleUserInteraction, { once: true });
    
    // Load chatbot after 5 seconds of idle time
    timeoutId = setTimeout(() => {
      if (!hasLoaded) {
        hasLoaded = true;
        loadChatbot();
      }
    }, 5000);

    // Load chatbot when user scrolls past 50% of page
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      clearTimeout(scrollTimeoutId);
    };
  }, [loadChatbot]);

  return {
    isLoaded,
    isLoading,
    error,
    loadChatbot,
    reset
  };
}
