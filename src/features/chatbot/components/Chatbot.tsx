import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { useChatbotAvailability } from '../hooks/useGeminiConnection';
import { useChatInitialization } from '../hooks/useChatInitialization';
import { useChatMessages, type Message as ChatMessage } from '../hooks/useChatMessages';
import { ChatMessageMarkdown } from './ChatMessageMarkdown';
import { AiChatIcon, SendIcon } from '../../../shared/components/icons';
import { ANIMATION_DELAYS } from '../constants';

// Convert between different message formats
const convertMessage = (msg: ChatMessage): { role: 'user' | 'assistant'; content: string } => ({
    role: msg.role,
    content: msg.content,
});

export const Chatbot: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { isAvailable: isChatbotAvailable, isChecking: isChatbotChecking } = useChatbotAvailability();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const languageName = useMemo(
        () => String(t(`languageSwitcher.${i18n.language}`)),
        [i18n.language, t]
    );
    
    const errorMessage = useMemo(
        () => String(t('chatbot.error')) || 'An error occurred. Please try again.',
        [t]
    );

    const { chat, isLoading: isInitializing } = useChatInitialization({
        isOpen: isChatbotAvailable,
        language: i18n.language,
        languageName,
    });

    const { messages, isLoading: isSending, sendMessageStream, setMessages } = useChatMessages();

    // Set initial message when chat is ready
    useEffect(() => {
        if (chat && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: String(t('chatbot.initialMessage'))
            }]);
        }
    }, [chat, messages.length, t, setMessages]);

    // Auto-scroll to latest message
    useEffect(() => {
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, ANIMATION_DELAYS.autoScroll);
        return () => clearTimeout(timer);
    }, [messages]);

    // Close chat when clicking outside or pressing Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
                const fabButton = document.querySelector('.chatbot-fab');
                if (fabButton && fabButton.contains(event.target as Node)) return;
                setIsOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }, ANIMATION_DELAYS.clickOutside);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const userInput = inputRef.current?.value.trim();
        if (!userInput || isSending || !chat) return;

        if (inputRef.current) inputRef.current.value = '';
        await sendMessageStream(userInput, chat, errorMessage);
        inputRef.current?.focus();
    }, [chat, isSending, sendMessageStream, errorMessage]);

    const handleOpenChat = useCallback(() => {
        setIsOpen(true);
    }, []);
    
    if (!isChatbotAvailable || isChatbotChecking) return null;

    const isDisabled = isSending || isInitializing;

    return (
        <>
            <button 
                className="chatbot-fab" 
                onClick={handleOpenChat} 
                aria-label={String(t('chatbot.openAria'))} 
                title={String(t('chatbot.openAria'))}
            >
                <AiChatIcon />
            </button>
            <div 
                ref={chatWindowRef}
                className={`chat-window ${isOpen ? 'open' : ''}`} 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="chat-window-title"
            >
                <div className="chat-header">
                    <h3 id="chat-window-title">{String(t('chatbot.title'))}</h3>
                    <button 
                        className="chat-close-btn"
                        onClick={() => setIsOpen(false)} 
                        aria-label={String(t('chatbot.closeAria'))}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.08 1.04L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <ChatMessageMarkdown
                            key={index}
                            message={convertMessage(msg)}
                        />
                    ))}
                    {isDisabled && (
                        <div className="message-bubble ai">
                           <div className="typing-indicator">
                               <span></span><span></span><span></span>
                           </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form className="message-input-area" onSubmit={handleSendMessage}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={String(t('chatbot.placeholder'))}
                        disabled={isDisabled}
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isDisabled} aria-label={String(t('chatbot.sendAria'))}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chatbot;

