import { AuthManager } from './AuthManager';
import { TokenStorage, TokenData, createTokenData } from './TokenStorage';
import { FacebookAuthResponse } from '../types/auth';

export interface TokenManagerConfig {
  authManager: AuthManager;
  tokenStorage: TokenStorage;
  autoRefresh?: boolean;
  refreshThresholdMinutes?: number;
}

export class TokenManager {
  private authManager: AuthManager;
  private tokenStorage: TokenStorage;
  private autoRefresh: boolean;
  private refreshThresholdMinutes: number;
  private refreshTimer?: NodeJS.Timeout;

  constructor(config: TokenManagerConfig) {
    this.authManager = config.authManager;
    this.tokenStorage = config.tokenStorage;
    this.autoRefresh = config.autoRefresh ?? true;
    this.refreshThresholdMinutes = config.refreshThresholdMinutes ?? 30;
  }

  /**
   * Store access token for a user
   */
  async storeToken(
    userId: string, 
    authResponse: FacebookAuthResponse
  ): Promise<void> {
    const tokenData = createTokenData(authResponse, userId);
    
    // If it's a short-lived token, try to get long-lived version
    if (authResponse.expires_in && authResponse.expires_in < 86400) { // Less than 24 hours
      try {
        const longLivedResponse = await this.authManager.getLongLivedToken(
          authResponse.access_token
        );
        const longLivedTokenData = createTokenData(longLivedResponse, userId);
        await this.tokenStorage.store(userId, longLivedTokenData);
      } catch (error) {
        console.warn('Failed to get long-lived token, storing short-lived:', error);
        await this.tokenStorage.store(userId, tokenData);
      }
    } else {
      await this.tokenStorage.store(userId, tokenData);
    }

    // Start auto-refresh if enabled
    if (this.autoRefresh) {
      this.scheduleTokenRefresh(userId);
    }
  }

  /**
   * Get valid access token for a user
   */
  async getValidToken(userId: string): Promise<string | null> {
    const tokenData = await this.tokenStorage.retrieve(userId);
    
    if (!tokenData) {
      return null;
    }

    // Check if token is expired
    if (this.tokenStorage.isExpired(tokenData)) {
      console.log(`Token expired for user ${userId}, attempting refresh...`);
      await this.tokenStorage.remove(userId);
      return null;
    }

    // Check if token needs refresh soon
    if (this.shouldRefreshToken(tokenData)) {
      console.log(`Token needs refresh for user ${userId}`);
      try {
        await this.refreshToken(userId);
        const refreshedToken = await this.tokenStorage.retrieve(userId);
        return refreshedToken?.accessToken || null;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Return current token if refresh fails
        return tokenData.accessToken;
      }
    }

    return tokenData.accessToken;
  }

  /**
   * Refresh token for a user
   */
  async refreshToken(userId: string): Promise<boolean> {
    const tokenData = await this.tokenStorage.retrieve(userId);
    
    if (!tokenData) {
      throw new Error(`No token found for user ${userId}`);
    }

    try {
      // Validate current token first
      await this.authManager.validateToken(tokenData.accessToken);
      
      // For long-lived tokens, we can't refresh them directly
      // We need the user to re-authenticate
      // But we can try to extend if it's still valid
      const longLivedResponse = await this.authManager.getLongLivedToken(
        tokenData.accessToken
      );
      
      const newTokenData = createTokenData(longLivedResponse, userId);
      await this.tokenStorage.store(userId, newTokenData);
      
      return true;
    } catch (error) {
      console.error(`Token refresh failed for user ${userId}:`, error);
      // Remove invalid token
      await this.tokenStorage.remove(userId);
      return false;
    }
  }

  /**
   * Remove token for a user (logout)
   */
  async removeToken(userId: string): Promise<void> {
    const tokenData = await this.tokenStorage.retrieve(userId);
    
    if (tokenData) {
      // Revoke token on Facebook
      try {
        await this.authManager.revokeToken(tokenData.accessToken);
      } catch (error) {
        console.warn('Failed to revoke token on Facebook:', error);
      }
    }

    await this.tokenStorage.remove(userId);
    this.clearRefreshTimer();
  }

  /**
   * Check if user has valid token
   */
  async hasValidToken(userId: string): Promise<boolean> {
    const token = await this.getValidToken(userId);
    return token !== null;
  }

  /**
   * Get token info (for debugging)
   */
  async getTokenInfo(userId: string): Promise<TokenData | null> {
    return await this.tokenStorage.retrieve(userId);
  }

  /**
   * Validate token with Facebook
   */
  async validateTokenWithFacebook(userId: string): Promise<boolean> {
    const tokenData = await this.tokenStorage.retrieve(userId);
    
    if (!tokenData) {
      return false;
    }

    try {
      const tokenInfo = await this.authManager.validateToken(tokenData.accessToken);
      return tokenInfo.is_valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Check if token should be refreshed
   */
  private shouldRefreshToken(tokenData: TokenData): boolean {
    if (!tokenData.expiresAt) {
      return false; // Long-lived tokens don't need refresh
    }

    const now = new Date();
    const refreshTime = new Date(
      tokenData.expiresAt.getTime() - this.refreshThresholdMinutes * 60 * 1000
    );

    return now >= refreshTime;
  }

  /**
   * Schedule token refresh
   */
  private scheduleTokenRefresh(userId: string): void {
    this.clearRefreshTimer();
    
    // Check every hour if token needs refresh
    this.refreshTimer = setInterval(async () => {
      try {
        const tokenData = await this.tokenStorage.retrieve(userId);
        if (tokenData && this.shouldRefreshToken(tokenData)) {
          await this.refreshToken(userId);
        }
      } catch (error) {
        console.error('Scheduled token refresh failed:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Clear refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clearRefreshTimer();
  }
}