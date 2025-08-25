import axios from 'axios';
import { AuthConfig, FacebookAuthResponse, FacebookTokenInfo, FacebookUser } from '../types/auth';
import { DEFAULT_CONFIG } from '../core/config';

export class AuthManager {
  private config: AuthConfig;
  private readonly baseUrl: string;
  private readonly oauthUrl: string;

  constructor(config: AuthConfig) {
    this.config = config;
    this.baseUrl = DEFAULT_CONFIG.baseUrl;
    this.oauthUrl = DEFAULT_CONFIG.oauthUrl;
  }

  /**
   * Generate Facebook OAuth URL for user authorization
   */
  getAuthUrl(state?: string): string {
    const scope = this.config.scope || [
      'public_profile'
    ];

    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: scope.join(','),
      response_type: 'code',
      state: state || this.config.state || ''
    });

    return `${this.oauthUrl}/v19.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<FacebookAuthResponse> {
    try {
      const params = new URLSearchParams({
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        redirect_uri: this.config.redirectUri,
        code: code
      });

      const response = await axios.get(`${this.baseUrl}/v19.0/oauth/access_token?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error}`);
    }
  }

  /**
   * Get long-lived access token (60 days)
   */
  async getLongLivedToken(shortLivedToken: string): Promise<FacebookAuthResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        fb_exchange_token: shortLivedToken
      });

      const response = await axios.get(`${this.baseUrl}/v19.0/oauth/access_token?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get long-lived token: ${error}`);
    }
  }

  /**
   * Validate access token
   */
  async validateToken(accessToken: string): Promise<FacebookTokenInfo> {
    try {
      const response = await axios.get(`${this.baseUrl}/v19.0/debug_token`, {
        params: {
          input_token: accessToken,
          access_token: `${this.config.appId}|${this.config.appSecret}`
        }
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to validate token: ${error}`);
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(accessToken: string): Promise<FacebookUser> {
    try {
      const response = await axios.get(`${this.baseUrl}/v19.0/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,email'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error}`);
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.baseUrl}/v19.0/me/permissions`, {
        params: {
          access_token: accessToken
        }
      });

      return response.data.success;
    } catch (error) {
      throw new Error(`Failed to revoke token: ${error}`);
    }
  }
}