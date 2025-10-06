import { useState, useEffect } from 'react';
import { loadAIModule } from '../../../shared/utils';
import type { Chat } from '@google/genai';
import { buildContext, generateSystemInstruction, getModelConfig } from '../utils/chatConfig';

interface UseChatInitializationProps {
  isOpen: boolean;
  language: string;
  languageName: string;
}

interface UseChatInitializationReturn {
  chat: Chat | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for initializing AI chat
 * Handles loading AI module, creating chat instance, and error states
 */
export const useChatInitialization = ({
  isOpen,
  language,
  languageName,
}: UseChatInitializationProps): UseChatInitializationReturn => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load AI module and initialize chat in one effect
  useEffect(() => {
    if (!isOpen || chat) return;

    let mounted = true;

    const initializeChat = async () => {
      try {
        // Load AI module
        const module = await loadAIModule();
        if (!mounted) return;

        if (!module) {
          setError('Failed to load AI module');
          setIsLoading(false);
          return;
        }

        // Check API key
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          setError('API key not configured');
          setIsLoading(false);
          return;
        }

        // Create AI instance
        const { GoogleGenAI } = module;
        const ai = new GoogleGenAI({ apiKey });

        // Build chat configuration
        const context = buildContext(language);
        const systemInstruction = generateSystemInstruction(language, languageName, context);
        const { model, config } = getModelConfig();

        // Create chat
        const newChat = ai.chats.create({
          model,
          config: {
            systemInstruction,
            ...config,
          },
        });

        if (mounted) {
          setChat(newChat);
          setIsLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to initialize chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
    };
  }, [isOpen, chat, language, languageName]);

  return { chat, isLoading, error };
};
