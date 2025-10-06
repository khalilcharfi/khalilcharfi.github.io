import { GoogleGenAI } from '@google/genai';

export const validateApiKey = (apiKey: string | undefined): { isValid: boolean; error?: string } => {
    if (!apiKey) {
        return { isValid: false, error: 'No API key provided' };
    }
    
    if (typeof apiKey !== 'string') {
        return { isValid: false, error: 'API key must be a string' };
    }
    
    if (apiKey.trim().length === 0) {
        return { isValid: false, error: 'API key cannot be empty' };
    }
    
    // Basic format validation for Gemini API keys
    if (!apiKey.startsWith('AI') || apiKey.length < 20) {
        return { isValid: false, error: 'Invalid API key format' };
    }
    
    return { isValid: true };
};

export const testGeminiConnection = async (apiKey: string): Promise<{ success: boolean; error?: string }> => {
    const maxRetries = 2;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                config: { 
                    systemInstruction: 'You are a test assistant. Respond with "OK".' 
                },
            });
            
            await chat.sendMessage({ message: ['Test'] });
            
            return { success: true };
        } catch (error: any) {
            console.warn(`Connection test attempt ${attempt + 1} failed:`, error);
            
            if (attempt === maxRetries - 1) {
                let errorMsg = 'Unknown error';
                
                if (error?.message) {
                    if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid')) {
                        errorMsg = 'Invalid API key';
                    } else if (error.message.includes('PERMISSION_DENIED')) {
                        errorMsg = 'Permission denied';
                    } else if (error.message.includes('RATE_LIMIT')) {
                        errorMsg = 'Rate limit exceeded';
                    } else if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMsg = 'Network error';
                    } else {
                        errorMsg = error.message || 'Connection failed';
                    }
                }
                
                return { success: false, error: errorMsg };
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    
    return { success: false, error: 'Max retries exceeded' };
};

