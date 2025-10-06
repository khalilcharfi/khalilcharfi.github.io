/**
 * Chatbot UI constants
 */
export const CHATBOX_STYLES = {
  width: '400px',
  maxWidth: '90vw',
  height: '500px',
  borderRadius: '12px',
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  zIndex: 1000,
} as const;

export const CHAT_COLORS = {
  light: {
    background: '#ffffff',
    border: '#e0e0e0',
    text: '#000',
    userBubble: '#f0f0f0',
    aiBubble: '#e3f2fd',
    loadingText: '#666',
  },
  dark: {
    background: '#1a1a1a',
    border: '#333',
    text: '#fff',
    userBubble: '#2a2a2a',
    aiBubble: '#1e3a5f',
    loadingText: '#888',
  },
} as const;

export const ANIMATION_DELAYS = {
  clickOutside: 100,
  autoScroll: 50,
} as const;

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  AI: 'ai',
} as const;
