import { translations } from '../../i18n';

/**
 * Centralized chat configuration utility
 * Builds context and system instructions for the AI chatbot
 */

export interface ChatConfig {
    systemInstruction: string;
    context: string;
    initialMessage: string;
}

/**
 * Build portfolio context from translations
 */
export const buildContext = (lang: string): string => {
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

/**
 * Language-specific instruction templates
 * This ensures the AI responds in the user's language
 */
const getLanguageInstruction = (lang: string): string => {
    const instructions: Record<string, string> = {
        'en': 'Respond in English',
        'en-GB': 'Respond in English',
        'de': 'Antworte auf Deutsch (Respond in German)',
        'fr': 'Réponds en français (Respond in French)',
        'ar': 'أجب باللغة العربية (Respond in Arabic)'
    };
    return instructions[lang] || 'Respond in English';
};

/**
 * Generate system instruction for the AI
 * Centralized to avoid duplication across components
 */
export const generateSystemInstruction = (lang: string, langName: string, context: string): string => {
    const languageInstruction = getLanguageInstruction(lang);
    
    return `You are a helpful and friendly AI assistant for Khalil Charfi's professional portfolio. 

IMPORTANT INSTRUCTIONS:
1. ${languageInstruction}. All your responses must be in this language.
2. Base your answers ONLY on the provided JSON data about his skills, experience, projects, education, and publications.
3. Be friendly, professional, and conversational.
4. Keep answers concise but informative.
5. Format responses with markdown for lists, emphasis, or code when appropriate.
6. If asked about something outside the provided context, politely state you can only answer questions about Khalil's portfolio.
7. The user is viewing the portfolio in ${langName}.

PORTFOLIO DATA:
${context}`;
};

/**
 * Get model configuration from environment variables
 * Optimized for cost efficiency
 * 
 * Cost-Optimized Model: gemini-1.5-flash (most reliable)
 * - $0.075 per million input tokens
 * - $0.30 per million output tokens
 * - Deterministic responses (temperature=0, top-p=0, top-k=0)
 * - Limited output (512 tokens) to minimize costs
 * 
 * Valid Google Gemini models:
 * - 'gemini-1.5-flash' - Most cost-effective & reliable (recommended)
 * - 'gemini-1.5-pro' - Best quality, higher cost
 * - 'gemini-pro' - Legacy model
 * 
 * ⚠️ Cost Optimization:
 * - Avoid "thinking" mode (increases output tokens significantly)
 * - Keep max tokens low (512 recommended for chatbot)
 * - Use temperature=0 for deterministic responses
 * - Disable top-k sampling (set to 0)
 */
export const getModelConfig = () => {
    const model = import.meta.env.VITE_CHATBOT_MODEL || 'gemini-1.5-flash';
    const temperature = parseFloat(import.meta.env.VITE_CHATBOT_TEMPERATURE || '0.0');
    const topP = parseFloat(import.meta.env.VITE_CHATBOT_TOP_P || '0.0');
    const topK = parseInt(import.meta.env.VITE_CHATBOT_TOP_K || '0', 10);
    const maxOutputTokens = parseInt(import.meta.env.VITE_CHATBOT_MAX_TOKENS || '512', 10);

    return {
        model,
        config: {
            temperature,
            topP,
            topK,
            maxOutputTokens,
        }
    };
};

/**
 * Format error message based on error type
 */
export const formatErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error occurred';
};
