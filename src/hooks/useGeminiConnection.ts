import { useState, useEffect } from 'react';
import { validateApiKey, testGeminiConnection } from '../utils/api';
import { ENABLE_CHATBOT } from '../components/DynamicContent';

type ConnectionStatus = 'checking' | 'connected' | 'failed' | 'disabled';

interface UseGeminiConnectionReturn {
    connectionStatus: ConnectionStatus;
    errorMessage: string;
    retryCount: number;
    retryConnection: () => void;
    isAvailable: boolean;
    isChecking: boolean;
}

export const useGeminiConnectionCheck = (): UseGeminiConnectionReturn => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
    const [errorMessage, setErrorMessage] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const checkConnection = async () => {
        setConnectionStatus('checking');
        setErrorMessage('');
        
        // First check if chatbot is enabled via environment variable
        if (!ENABLE_CHATBOT) {
            setConnectionStatus('disabled');
            setErrorMessage('Chatbot is disabled via environment variable');
            return;
        }
        
        // Check if API key exists and validate format
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        const keyValidation = validateApiKey(apiKey);
        
        if (!keyValidation.isValid) {
            setConnectionStatus('failed');
            setErrorMessage(keyValidation.error || 'Invalid API key');
            return;
        }
        
        // Skip API validation in development for faster startup
        if (window.location.hostname === 'localhost' && process.env.NODE_ENV === 'development') {
            console.log('Development mode: Skipping API connection test');
            setConnectionStatus('connected');
            return;
        }
        
        // Test actual API connection
        const connectionResult = await testGeminiConnection(apiKey!);
        
        if (connectionResult.success) {
            setConnectionStatus('connected');
            setErrorMessage('');
            setRetryCount(0);
        } else {
            setConnectionStatus('failed');
            setErrorMessage(connectionResult.error || 'Connection failed');
            setRetryCount(prev => prev + 1);
        }
    };

    const retryConnection = () => {
        checkConnection();
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return { 
        connectionStatus, 
        errorMessage, 
        retryCount, 
        retryConnection,
        isAvailable: connectionStatus === 'connected',
        isChecking: connectionStatus === 'checking'
    };
};

// Legacy hook for backward compatibility
export const useChatbotAvailability = () => {
    const { isAvailable, isChecking } = useGeminiConnectionCheck();
    return { isAvailable, isChecking };
};

