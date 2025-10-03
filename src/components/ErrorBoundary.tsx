import React, { Component, ErrorInfo } from 'react';
import type { ErrorBoundaryProps } from '../types/components';

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. The page is running in safe mode.</p>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
              <summary>Error Details (click to expand)</summary>
              <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
              <p><strong>Stack:</strong></p>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </details>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                window.location.reload();
              }}
              className="retry-button"
            >
              Reload Page
            </button>
          </div>
          
          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .error-content {
              max-width: 600px;
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 2rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .error-content h2 {
              margin: 0 0 1rem 0;
              font-size: 2rem;
              font-weight: 600;
            }
            
            .error-content p {
              margin: 0 0 1rem 0;
              font-size: 1.1rem;
              opacity: 0.9;
            }
            
            .retry-button {
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              transition: all 0.3s ease;
              margin-top: 1rem;
            }
            
            .retry-button:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
            }
            
            details {
              text-align: left;
              background: rgba(0, 0, 0, 0.2);
              padding: 1rem;
              border-radius: 8px;
              margin: 1rem 0;
            }
            
            summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            
            pre {
              font-size: 0.8rem;
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

// Analytics-specific error boundary
export class AnalyticsErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Analytics error caught, continuing with fallback:', error);
    
    // Initialize fallback analytics
    if (typeof window !== 'undefined') {
      (window as any).__analytics_fallback_mode = true;
    }
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // For analytics errors, we want to continue rendering the main content
      // but with disabled analytics functionality
      return (
        <>
          {this.props.children}
          <div className="analytics-error-notice">
            <p>Analytics running in safe mode</p>
            <style>{`
              .analytics-error-notice {
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                background: rgba(255, 193, 7, 0.9);
                color: #856404;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.8rem;
                z-index: 1000;
                opacity: 0.8;
              }
            `}</style>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary as default }; 