import { logger } from './logger';

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface ErrorTrackingOptions {
  context?: string;
  metadata?: Record<string, unknown>;
  suppress?: boolean;
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    retryDelay,
    backoffMultiplier = 2,
    shouldRetry = () => true,
    onRetry,
  } = options;

  let lastError: Error;
  let currentDelay = retryDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if we've exhausted attempts or error is not retryable
      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Log retry attempt
      logger.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after error:`,
        lastError.message
      );

      // Call retry callback
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Wait before retrying with exponential backoff
      await sleep(currentDelay);
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

export function trackError(
  error: unknown,
  options: ErrorTrackingOptions = {}
): void {
  const { context, metadata, suppress = false } = options;

  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Log error with context
  const logMessage = context 
    ? `Error in ${context}:` 
    : 'Error occurred:';

  logger.error(logMessage, errorObj.message, metadata || '');

  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // Example: sendToSentry(errorObj, { context, metadata });
  }

  // Re-throw if not suppressed
  if (!suppress) {
    throw errorObj;
  }
}

export async function safeAsync<T>(
  fn: () => Promise<T>,
  options: ErrorTrackingOptions = {}
): Promise<[Error | null, T | null]> {
  try {
    const data = await fn();
    return [null, data];
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    trackError(errorObj, { ...options, suppress: true });
    
    return [errorObj, null];
  }
}

export function safeSync<T>(
  fn: () => T,
  options: ErrorTrackingOptions = {}
): [Error | null, T | null] {
  try {
    const data = fn();
    return [null, data];
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    trackError(errorObj, { ...options, suppress: true });
    
    return [errorObj, null];
  }
}

export function createDebouncedErrorHandler(
  delay: number
): (error: unknown, options?: ErrorTrackingOptions) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingError: unknown = null;
  let pendingOptions: ErrorTrackingOptions = {};

  return (error: unknown, options: ErrorTrackingOptions = {}) => {
    pendingError = error;
    pendingOptions = options;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (pendingError) {
        trackError(pendingError, pendingOptions);
        pendingError = null;
        pendingOptions = {};
      }
      timeoutId = null;
    }, delay);
  };
}

export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError'
  );
}

export function isTimeoutError(error: Error): boolean {
  return (
    error.message.includes('timeout') ||
    error.name === 'TimeoutError' ||
    error.message.includes('timed out')
  );
}

export function isRetryableError(error: Error): boolean {
  return isNetworkError(error) || isTimeoutError(error);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createTimeout(ms: number, message = 'Operation timed out'): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage?: string
): Promise<T> {
  return Promise.race([
    promise,
    createTimeout(timeoutMs, timeoutMessage),
  ]);
}
