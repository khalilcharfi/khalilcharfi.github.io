/**
 * Chatbot Model Configuration
 * Moved here to avoid circular dependencies with shared/utils/api.ts
 * 
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

