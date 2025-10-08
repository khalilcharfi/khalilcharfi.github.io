import React, { useState, useEffect, useRef } from 'react';
import './DebugLogger.css';

interface LogEntry {
  timestamp: number;
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  data?: any[];
}

export const DebugLogger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (level: LogEntry['level'], args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [...prev, {
        timestamp: Date.now(),
        level,
        message,
        data: args
      }]);
    };

    console.log = (...args: any[]) => {
      originalLog(...args);
      addLog('log', args);
    };

    console.info = (...args: any[]) => {
      originalInfo(...args);
      addLog('info', args);
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      addLog('error', args);
    };

    // Initial log
    console.log('[DebugLogger] Logger initialized');

    // Restore original console methods on cleanup
    return () => {
      console.log = originalLog;
      console.info = originalInfo;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (!isMinimized && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  const clearLogs = () => {
    setLogs([]);
    console.log('[DebugLogger] Logs cleared');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const filterLogsByCategory = (searchTerm: string) => {
    if (!searchTerm) return logs;
    return logs.filter(log => 
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const [filter, setFilter] = useState('');
  const filteredLogs = filterLogsByCategory(filter);

  if (!isOpen) {
    return (
      <button 
        className="debug-logger-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open debug logger"
      >
        📊 Show Logs ({logs.length})
      </button>
    );
  }

  return (
    <div className={`debug-logger ${isMinimized ? 'minimized' : ''}`}>
      <div className="debug-logger-header">
        <div className="debug-logger-title">
          <span className="debug-logger-icon">📊</span>
          <span>Debug Logger</span>
          <span className="debug-logger-count">({logs.length} logs)</span>
        </div>
        <div className="debug-logger-controls">
          <input
            type="text"
            className="debug-logger-filter"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button 
            onClick={clearLogs}
            className="debug-logger-btn"
            title="Clear logs"
          >
            🗑️
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="debug-logger-btn"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="debug-logger-btn"
            title="Close"
          >
            ✖️
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="debug-logger-content" ref={logsContainerRef}>
          {filteredLogs.length === 0 ? (
            <div className="debug-logger-empty">
              {filter ? `No logs matching "${filter}"` : 'No logs yet'}
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={index} className={`debug-logger-entry debug-logger-${log.level}`}>
                <span className="debug-logger-time">{formatTime(log.timestamp)}</span>
                <span className="debug-logger-level">{getLevelIcon(log.level)}</span>
                <span className="debug-logger-message">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
};

