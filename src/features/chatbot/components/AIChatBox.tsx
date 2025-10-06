import React, { useState, useCallback, useMemo } from 'react';
import type { AIChatBoxProps } from '../../../shared/types';
import { useChatInitialization } from '../hooks/useChatInitialization';
import { useChatMessages } from '../hooks/useChatMessages';
import { ChatMessage } from './ChatMessage';
import { CHATBOX_STYLES, CHAT_COLORS } from '../constants';

export const AIChatBox: React.FC<AIChatBoxProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  language, 
  t
}) => {
  const [input, setInput] = useState('');
  
  const languageName = useMemo(
    () => String(t(`languageSwitcher.${language}`)) || 'English',
    [language, t]
  );
  
  const errorMessage = useMemo(
    () => t('chatbot.error') || 'An error occurred',
    [t]
  );

  const { chat, isLoading: isInitializing, error } = useChatInitialization({
    isOpen,
    language,
    languageName,
  });

  const { messages, isLoading: isSending, sendMessage } = useChatMessages();

  const colors = CHAT_COLORS[theme as keyof typeof CHAT_COLORS] || CHAT_COLORS.light;

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat || isSending) return;
    
    await sendMessage(input, chat, errorMessage);
    setInput('');
  }, [input, chat, isSending, sendMessage, errorMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!isOpen) return null;

  const isDisabled = !chat || isSending || isInitializing;
  const userLabel = t('general.you') || 'You';

  return (
    <div 
      className="chatbox-overlay"
      style={{
        ...CHATBOX_STYLES,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: '16px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, color: colors.text }}>
          {t('chatbot.title')}
        </h3>
        <button 
          onClick={onClose}
          aria-label={t('chatbot.closeAria')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: colors.text
          }}
        >
          ×
        </button>
      </div>
      
      {/* Messages */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}
      >
        {isInitializing && (
          <div style={{ textAlign: 'center', color: colors.loadingText }}>
            {t('chatbot.loadingModule')}
          </div>
        )}
        {error && (
          <div style={{ color: '#ff6b6b', padding: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg}
            theme={theme as 'light' | 'dark'}
            userLabel={userLabel}
            aiLabel="AI"
          />
        ))}
      </div>
      
      {/* Input */}
      <div 
        style={{
          padding: '16px',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: '8px'
        }}
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chatbot.placeholder')}
          disabled={isDisabled}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
            color: colors.text
          }}
        />
        <button 
          onClick={handleSend}
          disabled={isDisabled || !input.trim()}
          aria-label={t('chatbot.sendAria')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1
          }}
        >
          {t('chatbot.send')}
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;

