import React, { useState, useEffect } from 'react';
import { loadAIModule } from '../utils/lazyLoading';
import type { GoogleGenAI, Chat } from '@google/genai';
import type { AIChatBoxProps } from '../types/components';

export const AIChatBox: React.FC<AIChatBoxProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  language, 
  buildContext, 
  t
}) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [aiModule, setAiModule] = useState<typeof GoogleGenAI | null>(null);

  // Load AI module on mount
  useEffect(() => {
    if (isOpen && !aiModule) {
      loadAIModule().then((module) => {
        if (module) {
          setAiModule(module.GoogleGenAI);
          setIsLoading(false);
        } else {
          setError('Failed to load AI module');
          setIsLoading(false);
        }
      });
    }
  }, [isOpen, aiModule]);

  // Initialize chat when AI module is loaded
  useEffect(() => {
    if (aiModule && !chat && isOpen) {
      try {
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        const ai = new aiModule({ apiKey: apiKey! });
        const context = buildContext(language);
        
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash-preview-04-17',
          config: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          },
          history: [
            {
              role: 'user',
              parts: [{ text: context }]
            },
            {
              role: 'model',
              parts: [{ text: `Understood. I'll answer questions about your professional background, projects, and expertise based on the information provided. How can I help you today?` }]
            }
          ]
        });
        
        setChat(newChat);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat');
      }
    }
  }, [aiModule, chat, isOpen, language, buildContext]);

  const handleSend = async () => {
    if (!input.trim() || !chat) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage(input);
      const botMessage = { 
        role: 'assistant', 
        content: response.text || 'No response received' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="chatbox-overlay"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '400px',
        maxWidth: '90vw',
        height: '500px',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        border: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`
      }}
    >
      <div 
        style={{
          padding: '16px',
          borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, color: theme === 'dark' ? '#fff' : '#000' }}>
          {t('chatbot.title')}
        </h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme === 'dark' ? '#fff' : '#000'
          }}
        >
          ×
        </button>
      </div>
      
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}
      >
        {isLoading && !aiModule && (
          <div style={{ textAlign: 'center', color: theme === 'dark' ? '#888' : '#666' }}>
            Loading AI module...
          </div>
        )}
        {error && (
          <div style={{ color: '#ff6b6b', padding: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            style={{
              marginBottom: '12px',
              padding: '12px',
              backgroundColor: msg.role === 'user' 
                ? (theme === 'dark' ? '#2a2a2a' : '#f0f0f0')
                : (theme === 'dark' ? '#1e3a5f' : '#e3f2fd'),
              borderRadius: '8px',
              color: theme === 'dark' ? '#fff' : '#000'
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{msg.content}</p>
          </div>
        ))}
      </div>
      
      <div 
        style={{
          padding: '16px',
          borderTop: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
          display: 'flex',
          gap: '8px'
        }}
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('chatbot.placeholder')}
          disabled={!chat || isLoading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={!chat || isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: chat && !isLoading ? 'pointer' : 'not-allowed',
            opacity: chat && !isLoading ? 1 : 0.5
          }}
        >
          {t('chatbot.send')}
        </button>
      </div>
    </div>
  );
};

export { AIChatBox as default };

