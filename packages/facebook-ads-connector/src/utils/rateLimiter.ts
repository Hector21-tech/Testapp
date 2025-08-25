export interface RateLimitConfig {
  maxRequestsPerHour: number;
  maxRequestsPerMinute: number;
  maxConcurrentRequests: number;
}

export const FACEBOOK_RATE_LIMITS: RateLimitConfig = {
  maxRequestsPerHour: 200, // Conservative limit for Facebook Marketing API
  maxRequestsPerMinute: 50,
  maxConcurrentRequests: 10
};

export class RateLimiter {
  private config: RateLimitConfig;
  private requestTimestamps: number[] = [];
  private activeRequests = 0;
  private waitingQueue: Array<{ resolve: Function; reject: Function }> = [];

  constructor(config: RateLimitConfig = FACEBOOK_RATE_LIMITS) {
    this.config = config;
  }

  /**
   * Wait for permission to make a request
   */
  async acquirePermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if we can proceed immediately
      if (this.canMakeRequest()) {
        this.recordRequest();
        resolve();
        return;
      }

      // Add to queue
      this.waitingQueue.push({ resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Record that a request has completed
   */
  releasePermission(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.processQueue();
  }

  /**
   * Execute function with rate limiting
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    await this.acquirePermission();
    
    try {
      const result = await operation();
      this.releasePermission();
      return result;
    } catch (error) {
      this.releasePermission();
      throw error;
    }
  }

  /**
   * Check if we can make a request now
   */
  private canMakeRequest(): boolean {
    this.cleanupOldTimestamps();

    // Check concurrent requests
    if (this.activeRequests >= this.config.maxConcurrentRequests) {
      return false;
    }

    // Check hourly limit
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const requestsInLastHour = this.requestTimestamps.filter(t => t > hourAgo).length;
    if (requestsInLastHour >= this.config.maxRequestsPerHour) {
      return false;
    }

    // Check minute limit
    const minuteAgo = Date.now() - 60 * 1000;
    const requestsInLastMinute = this.requestTimestamps.filter(t => t > minuteAgo).length;
    if (requestsInLastMinute >= this.config.maxRequestsPerMinute) {
      return false;
    }

    return true;
  }

  /**
   * Record a new request
   */
  private recordRequest(): void {
    this.requestTimestamps.push(Date.now());
    this.activeRequests++;
  }

  /**
   * Process the waiting queue
   */
  private processQueue(): void {
    if (this.waitingQueue.length === 0) {
      return;
    }

    // Try to process queue in next tick to avoid blocking
    setTimeout(() => {
      while (this.waitingQueue.length > 0 && this.canMakeRequest()) {
        const { resolve } = this.waitingQueue.shift()!;
        this.recordRequest();
        resolve();
      }
    }, 0);
  }

  /**
   * Remove timestamps older than 1 hour
   */
  private cleanupOldTimestamps(): void {
    const hourAgo = Date.now() - 60 * 60 * 1000;
    this.requestTimestamps = this.requestTimestamps.filter(t => t > hourAgo);
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    activeRequests: number;
    queueLength: number;
    requestsInLastHour: number;
    requestsInLastMinute: number;
  } {
    this.cleanupOldTimestamps();
    
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const minuteAgo = Date.now() - 60 * 1000;

    return {
      activeRequests: this.activeRequests,
      queueLength: this.waitingQueue.length,
      requestsInLastHour: this.requestTimestamps.filter(t => t > hourAgo).length,
      requestsInLastMinute: this.requestTimestamps.filter(t => t > minuteAgo).length
    };
  }

  /**
   * Reset rate limiter state
   */
  reset(): void {
    this.requestTimestamps = [];
    this.activeRequests = 0;
    
    // Reject all waiting requests
    this.waitingQueue.forEach(({ reject }) => {
      reject(new Error('Rate limiter was reset'));
    });
    this.waitingQueue = [];
  }
}