import { TokenManager } from '../auth/TokenManager';
import { AuthManager } from '../auth/AuthManager';
import { FacebookConnectorError, TokenError, APIError } from './errors';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
};

export class ErrorRecovery {
  private tokenManager: TokenManager;
  private authManager: AuthManager;
  private retryConfig: RetryConfig;

  constructor(
    tokenManager: TokenManager,
    authManager: AuthManager,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ) {
    this.tokenManager = tokenManager;
    this.authManager = authManager;
    this.retryConfig = retryConfig;
  }

  /**
   * Execute function with automatic retry and error recovery
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    userId: string,
    context?: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }

        const shouldRetry = await this.shouldRetryError(error as Error, userId, attempt);
        
        if (!shouldRetry) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        console.log(`Attempt ${attempt + 1} failed${context ? ` (${context})` : ''}, retrying in ${delay}ms:`, error);
        
        await this.sleep(delay);
      }
    }

    throw this.enhanceError(lastError!, context);
  }

  /**
   * Determine if an error should trigger a retry
   */
  private async shouldRetryError(error: Error, userId: string, attempt: number): Promise<boolean> {
    // Rate limiting errors - always retry
    if (this.isRateLimitError(error)) {
      return true;
    }

    // Network/connection errors - retry
    if (this.isNetworkError(error)) {
      return true;
    }

    // Token errors - try to refresh token once
    if (this.isTokenError(error) && attempt === 0) {
      try {
        console.log('Token error detected, attempting refresh...');
        const refreshed = await this.tokenManager.refreshToken(userId);
        return refreshed;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return false;
      }
    }

    // Server errors (5xx) - retry
    if (this.isServerError(error)) {
      return true;
    }

    // Don't retry client errors (4xx), validation errors, etc.
    return false;
  }

  /**
   * Check if error is due to rate limiting
   */
  private isRateLimitError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') || 
           message.includes('throttled') ||
           message.includes('too many requests') ||
           (error as any).code === 429;
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('network error') ||
           message.includes('timeout') ||
           message.includes('connection') ||
           message.includes('econnreset') ||
           message.includes('enotfound');
  }

  /**
   * Check if error is token-related
   */
  private isTokenError(error: Error): boolean {
    if (error instanceof TokenError) {
      return true;
    }
    
    const message = error.message.toLowerCase();
    return message.includes('invalid access token') ||
           message.includes('token expired') ||
           message.includes('oauth') ||
           (error as any).facebookCode >= 190 && (error as any).facebookCode <= 199;
  }

  /**
   * Check if error is server error (5xx)
   */
  private isServerError(error: Error): boolean {
    const code = (error as any).status || (error as any).code;
    return code >= 500 && code < 600;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Enhance error with additional context
   */
  private enhanceError(error: Error, context?: string): Error {
    const contextInfo = context ? ` Context: ${context}.` : '';
    
    if (error instanceof FacebookConnectorError) {
      error.message = `${error.message}${contextInfo}`;
      return error;
    }

    // Convert generic errors to FacebookConnectorError
    return new FacebookConnectorError(
      `Operation failed after retries: ${error.message}${contextInfo}`,
      'RETRY_EXHAUSTED'
    );
  }
}

/**
 * Utility function to create error recovery instance
 */
export function createErrorRecovery(
  tokenManager: TokenManager,
  authManager: AuthManager,
  customConfig?: Partial<RetryConfig>
): ErrorRecovery {
  const config = { ...DEFAULT_RETRY_CONFIG, ...customConfig };
  return new ErrorRecovery(tokenManager, authManager, config);
}