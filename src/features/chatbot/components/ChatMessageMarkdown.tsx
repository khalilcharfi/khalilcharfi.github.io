import { memo, useMemo } from 'react';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageMarkdownProps {
  message: Message;
  className?: string;
}

/**
 * Chat message with markdown rendering
 * Memoized to prevent unnecessary re-renders and markdown re-parsing
 */
export const ChatMessageMarkdown = memo<ChatMessageMarkdownProps>(({
  message,
  className = 'message-bubble',
}) => {
  const htmlContent = useMemo(() => {
    const rawMarkup = marked.parse(message.content, { 
      gfm: true, 
      breaks: true, 
      async: false 
    });
    return { __html: rawMarkup as string };
  }, [message.content]);

  // Map 'assistant' to 'ai' for CSS class compatibility
  const cssRole = message.role === 'assistant' ? 'ai' : message.role;

  return (
    <div className={`${className} ${cssRole}`}>
      <div 
        className="markdown-content" 
        dangerouslySetInnerHTML={htmlContent} 
      />
    </div>
  );
});

ChatMessageMarkdown.displayName = 'ChatMessageMarkdown';
