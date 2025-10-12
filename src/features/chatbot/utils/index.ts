/**
 * Centralized chatbot utilities
 * Export all chatbot-related utilities from a single entry point
 */

export {
    buildContext,
    generateSystemInstruction,
    formatErrorMessage,
    type ChatConfig
} from './chatConfig';

// NOTE: getModelConfig is NOT re-exported here to avoid circular dependencies
// Import it directly from '@/shared/config' instead
