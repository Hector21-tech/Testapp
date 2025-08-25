export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: any;
  userId?: string;
}

export interface Logger {
  error(message: string, context?: string, data?: any): void;
  warn(message: string, context?: string, data?: any): void;
  info(message: string, context?: string, data?: any): void;
  debug(message: string, context?: string, data?: any): void;
}

export class FacebookConnectorLogger implements Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private userId?: string;

  constructor(
    logLevel: LogLevel = LogLevel.INFO,
    maxLogs: number = 1000,
    userId?: string
  ) {
    this.logLevel = logLevel;
    this.maxLogs = maxLogs;
    this.userId = userId;
  }

  error(message: string, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data);
    console.error(`[FacebookConnector] ${context ? `[${context}] ` : ''}${message}`, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(`[FacebookConnector] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
    if (this.logLevel >= LogLevel.INFO) {
      console.log(`[FacebookConnector] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
    if (this.logLevel >= LogLevel.DEBUG) {
      console.debug(`[FacebookConnector] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data,
      userId: this.userId
    };

    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get all logs or filter by level
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level === undefined) {
      return [...this.logs];
    }

    return this.logs.filter(log => log.level <= level);
  }

  /**
   * Get logs for specific context
   */
  getLogsForContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context === context);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set user ID for future logs
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global logger instance
let globalLogger: FacebookConnectorLogger;

/**
 * Get or create global logger
 */
export function getLogger(): FacebookConnectorLogger {
  if (!globalLogger) {
    globalLogger = new FacebookConnectorLogger();
  }
  return globalLogger;
}

/**
 * Set global logger instance
 */
export function setLogger(logger: FacebookConnectorLogger): void {
  globalLogger = logger;
}

/**
 * Create logger for specific user
 */
export function createUserLogger(userId: string, logLevel: LogLevel = LogLevel.INFO): FacebookConnectorLogger {
  return new FacebookConnectorLogger(logLevel, 1000, userId);
}