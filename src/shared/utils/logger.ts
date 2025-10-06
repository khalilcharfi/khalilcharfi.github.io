/**
 * Centralized logging utility
 * Automatically suppresses non-error logs in production
 */

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
  enableInProduction: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enableInProduction: false,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // Always log errors
    if (level === 'error') return true;
    
    // In development, log everything
    if (isDev) return true;
    
    // In production, only log if explicitly enabled
    return this.config.enableInProduction;
  }

  private formatMessage(level: LogLevel, args: any[]): any[] {
    const timestamp = new Date().toISOString();
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const levelPrefix = `[${level.toUpperCase()}]`;
    
    if (isDev) {
      return [`${levelPrefix}${prefix}`, ...args];
    }
    
    return [`${timestamp} ${levelPrefix}${prefix}`, ...args];
  }

  log(...args: any[]): void {
    if (this.shouldLog('log')) {
      console.log(...this.formatMessage('log', args));
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', args));
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', args));
    }
  }

  error(...args: any[]): void {
    // Always log errors, even in production
    console.error(...this.formatMessage('error', args));
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.formatMessage('debug', args));
    }
  }

  /**
   * Create a scoped logger with a prefix
   */
  scope(prefix: string): Logger {
    return new Logger({ ...this.config, prefix });
  }
}

// Default logger instance
export const logger = new Logger();

// Scoped loggers for different parts of the application
export const analyticsLogger = logger.scope('Analytics');
export const i18nLogger = logger.scope('i18n');
export const performanceLogger = logger.scope('Performance');
export const chatbotLogger = logger.scope('Chatbot');
export const threeLogger = logger.scope('Three.js');

export default logger;
