import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { useChatbotAvailability } from '../hooks/useGeminiConnection';
import type { Chat } from '@google/genai';
import { marked } from 'marked';
import { translations } from '../../i18n';
import { AiChatIcon, SendIcon } from '../../../shared/components/icons';
import { loadAIModule } from '../../../shared/utils';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const Chatbot: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const { isAvailable: isChatbotAvailable, isChecking: isChatbotChecking } = useChatbotAvailability();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const createMarkup = (text: string) => {
        const rawMarkup = marked.parse(text, { gfm: true, breaks: true, async: false });
        return { __html: rawMarkup as string };
    };

    const buildContext = (lang: string) => {
        const bundle = translations[lang as keyof typeof translations];
        if (!bundle) return '{}';
        
        const data = {
            about: bundle.about,
            skills: bundle.skills,
            experience: bundle.experience,
            education: bundle.education,
            projects: bundle.projects,
            publications: bundle.publications,
            contactInfo: {
                linkedin: "https://www.linkedin.com/in/khalil-charfi/",
                github: "https://github.com/khalil-charfi"
            }
        };
        return JSON.stringify(data);
    };

    useEffect(() => {
        if (!isChatbotAvailable) return;
        
        const initializeChat = async () => {
            try {
                // Lazy load the AI module only when needed
                const aiModule = await loadAIModule();
                if (!aiModule) {
                    console.warn("AI module not available");
                    return;
                }
                
                const { GoogleGenAI } = aiModule;
                const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
                const ai = new GoogleGenAI({ apiKey: apiKey! });
                const context = buildContext(i18n.language);
                const langName = String(t(`languageSwitcher.${i18n.language}`));

                const systemInstruction = `You are a helpful and friendly AI assistant for Khalil Charfi's portfolio. Your answers must be based *only* on the provided JSON data about his skills, experience, projects, etc. Be friendly, conversational, and keep answers concise. Format responses with markdown for lists or emphasis. If asked about something outside the context, politely state you can only answer questions about Khalil's portfolio. The user is viewing the portfolio in ${langName}. Here is the portfolio data: ${context}`;
                
                const newChat = ai.chats.create({
                  model: 'gemini-2.5-flash-preview-04-17',
                  config: { systemInstruction },
                });

                setChat(newChat);
                setMessages([{
                    sender: 'ai',
                    text: String(t('chatbot.initialMessage'))
                }]);
            } catch (err) {
                console.warn("Failed to initialize chatbot:", err);
            }
        };

        initializeChat();
    }, [i18n.language, t, isChatbotAvailable]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userInput = inputRef.current?.value.trim();
        if (!userInput || isLoading || !chat) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        if (inputRef.current) inputRef.current.value = '';
        setIsLoading(true);

        setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
        
        try {
            const responseStream = await chat.sendMessageStream({ message: [userInput] });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const latestMessages = [...prev];
                    latestMessages[latestMessages.length - 1].text += chunkText;
                    return latestMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setMessages(prev => {
                 const latestMessages = [...prev];
                 latestMessages[latestMessages.length - 1].text = "Sorry, I encountered an error. Please try again.";
                 return latestMessages;
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    
    if (!isChatbotAvailable || isChatbotChecking) return null;

    return (
        <>
            <button className="chatbot-fab" onClick={() => setIsOpen(true)} aria-label={String(t('chatbot.openAria'))} title={String(t('chatbot.openAria'))}>
                <AiChatIcon />
            </button>
            <div className={`chat-window ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="chat-window-title">
                <div className="chat-header">
                    <h3 id="chat-window-title">{String(t('chatbot.title'))}</h3>
                    <button onClick={() => setIsOpen(false)} aria-label={String(t('chatbot.closeAria'))}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.08 1.04L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.sender}`}>
                            <div className="markdown-content" dangerouslySetInnerHTML={createMarkup(msg.text)} />
                        </div>
                    ))}
                    {isLoading && (
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
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isLoading} aria-label={String(t('chatbot.sendAria'))}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </>
    );
};

