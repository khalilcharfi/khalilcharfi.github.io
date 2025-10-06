import React, { memo } from 'react';
import type { Message } from '../hooks/useChatMessages';

interface ChatMessageProps {
  message: Message;
  theme?: 'light' | 'dark';
  userLabel?: string;
  aiLabel?: string;
}

/**
 * Single chat message bubble
 * Memoized to prevent unnecessary re-renders
 */
export const ChatMessage = memo<ChatMessageProps>(({
  message,
  theme = 'light',
  userLabel = 'You',
  aiLabel = 'AI',
}) => {
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: isUser
          ? (isDark ? '#2a2a2a' : '#f0f0f0')
          : (isDark ? '#1e3a5f' : '#e3f2fd'),
        borderRadius: '8px',
        color: isDark ? '#fff' : '#000',
      }}
    >
      <strong>{isUser ? userLabel : aiLabel}:</strong>
      <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>
        {message.content}
      </p>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
