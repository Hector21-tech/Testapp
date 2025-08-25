import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FacebookResponse, FacebookError, APIRequestOptions } from '../types/common';
import { DEFAULT_CONFIG } from '../core/config';
import { RateLimiter, FACEBOOK_RATE_LIMITS } from '../utils/rateLimiter';
import { getLogger } from '../utils/logger';

export class BaseAPI {
  protected client: AxiosInstance;
  protected accessToken: string;
  protected version: string;
  protected rateLimiter: RateLimiter;
  protected logger = getLogger();

  constructor(accessToken: string, version: string = DEFAULT_CONFIG.version) {
    this.accessToken = accessToken;
    this.version = version;
    this.rateLimiter = new RateLimiter(FACEBOOK_RATE_LIMITS);

    this.client = axios.create({
      baseURL: `${DEFAULT_CONFIG.baseUrl}/${version}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add access token
    this.client.interceptors.request.use(
      (config) => {
        if (!config.params) {
          config.params = {};
        }
        config.params.access_token = this.accessToken;
        
        this.logger.debug('Making API request', 'BaseAPI', {
          url: config.url,
          method: config.method?.toUpperCase(),
          params: Object.keys(config.params).filter(key => key !== 'access_token')
        });
        
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error', 'BaseAPI', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug('API request successful', 'BaseAPI', {
          url: response.config.url,
          status: response.status,
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : undefined
        });
        return response;
      },
      (error) => {
        this.logger.error('API request failed', 'BaseAPI', {
          url: error.config?.url,
          status: error.response?.status,
          error: error.response?.data
        });

        if (error.response?.data?.error) {
          const fbError: FacebookError = error.response.data;
          const enhancedError = new Error(`Facebook API Error: ${fbError.error.message} (Code: ${fbError.error.code})`);
          (enhancedError as any).facebookCode = fbError.error.code;
          (enhancedError as any).facebookType = fbError.error.type;
          throw enhancedError;
        }
        throw error;
      }
    );
  }

  /**
   * Make a GET request to Facebook API with rate limiting
   */
  protected async get<T = any>(
    endpoint: string,
    options?: APIRequestOptions
  ): Promise<FacebookResponse<T>> {
    return this.rateLimiter.execute(async () => {
      const params: any = {};

      if (options?.fields) {
        params.fields = options.fields.join(',');
      }
      if (options?.limit) {
        params.limit = options.limit;
      }
      if (options?.after) {
        params.after = options.after;
      }
      if (options?.before) {
        params.before = options.before;
      }
      if (options?.time_range) {
        params.time_range = JSON.stringify(options.time_range);
      }

      const response: AxiosResponse<FacebookResponse<T>> = await this.client.get(endpoint, {
        params,
      });

      return response.data;
    });
  }

  /**
   * Make a POST request to Facebook API with rate limiting
   */
  protected async post<T = any>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<FacebookResponse<T>> {
    return this.rateLimiter.execute(async () => {
      this.logger.info('Creating resource', 'BaseAPI', {
        endpoint,
        dataKeys: Object.keys(data || {})
      });

      const response: AxiosResponse<FacebookResponse<T>> = await this.client.post(
        endpoint,
        data,
        config
      );

      this.logger.info('Resource created successfully', 'BaseAPI', {
        endpoint,
        resourceId: response.data?.data?.id || response.data?.id
      });

      return response.data;
    });
  }

  /**
   * Make a PATCH request to Facebook API with rate limiting
   */
  protected async patch<T = any>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<FacebookResponse<T>> {
    return this.rateLimiter.execute(async () => {
      this.logger.info('Updating resource', 'BaseAPI', {
        endpoint,
        updateKeys: Object.keys(data || {})
      });

      const response: AxiosResponse<FacebookResponse<T>> = await this.client.patch(
        endpoint,
        data,
        config
      );

      this.logger.info('Resource updated successfully', 'BaseAPI', { endpoint });

      return response.data;
    });
  }

  /**
   * Make a DELETE request to Facebook API with rate limiting
   */
  protected async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<FacebookResponse<T>> {
    return this.rateLimiter.execute(async () => {
      this.logger.warn('Deleting resource', 'BaseAPI', { endpoint });

      const response: AxiosResponse<FacebookResponse<T>> = await this.client.delete(
        endpoint,
        config
      );

      this.logger.warn('Resource deleted successfully', 'BaseAPI', { endpoint });

      return response.data;
    });
  }

  /**
   * Update access token
   */
  updateAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
    this.logger.info('Access token updated', 'BaseAPI');
  }

  /**
   * Get rate limiter status
   */
  getRateLimitStatus() {
    return this.rateLimiter.getStatus();
  }

  /**
   * Reset rate limiter
   */
  resetRateLimiter(): void {
    this.rateLimiter.reset();
    this.logger.info('Rate limiter reset', 'BaseAPI');
  }

  /**
   * Build query string from options
   */
  protected buildQueryString(options: Record<string, any>): string {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return params.toString();
  }
}