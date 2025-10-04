// Component prop types and interfaces
import { ReactNode } from 'react';
import { VisitorType } from './analytics';

export interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  language: string;
  buildContext: (lang: string) => string;
  t: (key: string) => string;
}

export interface VisitorTypeSelectorProps {
  onVisitorTypeChange?: (type: VisitorType) => void;
  className?: string;
}

export interface TranslationTestProps {
  showDebugInfo?: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export interface DynamicContentProviderProps {
  children: ReactNode;
}

export interface ProfileInsightsProps {
  chatbotOpen?: boolean;
  scrollToTopVisible?: boolean;
}

export interface CookieConsentBannerProps {
  // No props currently
}
