import { useState, useCallback } from 'react';
import type { Chat } from '@google/genai';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, chat: Chat, errorMessage: string) => Promise<void>;
  sendMessageStream: (content: string, chat: Chat, errorMessage: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

/**
 * Custom hook for managing chat messages
 * Handles sending messages (both streaming and non-streaming) and state management
 */
export const useChatMessages = (initialMessages: Message[] = []): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send a message and wait for complete response
   */
  const sendMessage = useCallback(async (
    content: string,
    chat: Chat,
    errorMessage: string
  ) => {
    if (!content.trim() || !chat) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: content });
      const botMessage: Message = {
        role: 'assistant',
        content: response.text || errorMessage,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Send a message with streaming response
   */
  const sendMessageStream = useCallback(async (
    content: string,
    chat: Chat,
    errorMessage: string
  ) => {
    if (!content.trim() || !chat) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const responseStream = await chat.sendMessageStream({ message: content });

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunkText;
          return updated;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = errorMessage;
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    sendMessageStream,
    clearMessages,
    setMessages,
  };
};
