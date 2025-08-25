import { FacebookAuthResponse } from '../types/auth';

export interface TokenData {
  accessToken: string;
  tokenType: string;
  expiresAt?: Date;
  userId?: string;
  createdAt: Date;
}

export interface TokenStorage {
  store(userId: string, tokenData: TokenData): Promise<void>;
  retrieve(userId: string): Promise<TokenData | null>;
  remove(userId: string): Promise<void>;
  isExpired(tokenData: TokenData): boolean;
}

/**
 * In-memory token storage (for development)
 * In production, use database or secure storage
 */
export class MemoryTokenStorage implements TokenStorage {
  private tokens: Map<string, TokenData> = new Map();

  async store(userId: string, tokenData: TokenData): Promise<void> {
    this.tokens.set(userId, tokenData);
  }

  async retrieve(userId: string): Promise<TokenData | null> {
    return this.tokens.get(userId) || null;
  }

  async remove(userId: string): Promise<void> {
    this.tokens.delete(userId);
  }

  isExpired(tokenData: TokenData): boolean {
    if (!tokenData.expiresAt) {
      return false; // Long-lived tokens don't have expiry
    }
    return new Date() >= tokenData.expiresAt;
  }
}

/**
 * LocalStorage token storage (for browser)
 */
export class LocalStorageTokenStorage implements TokenStorage {
  private keyPrefix = 'facebook_token_';

  async store(userId: string, tokenData: TokenData): Promise<void> {
    const key = this.keyPrefix + userId;
    localStorage.setItem(key, JSON.stringify({
      ...tokenData,
      expiresAt: tokenData.expiresAt?.toISOString(),
      createdAt: tokenData.createdAt.toISOString()
    }));
  }

  async retrieve(userId: string): Promise<TokenData | null> {
    const key = this.keyPrefix + userId;
    const stored = localStorage.getItem(key);
    
    if (!stored) return null;

    const data = JSON.parse(stored);
    return {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdAt: new Date(data.createdAt)
    };
  }

  async remove(userId: string): Promise<void> {
    const key = this.keyPrefix + userId;
    localStorage.removeItem(key);
  }

  isExpired(tokenData: TokenData): boolean {
    if (!tokenData.expiresAt) {
      return false;
    }
    return new Date() >= tokenData.expiresAt;
  }
}

/**
 * Helper to create TokenData from Facebook response
 */
export function createTokenData(
  authResponse: FacebookAuthResponse,
  userId?: string
): TokenData {
  const expiresAt = authResponse.expires_in 
    ? new Date(Date.now() + authResponse.expires_in * 1000)
    : undefined;

  return {
    accessToken: authResponse.access_token,
    tokenType: authResponse.token_type,
    expiresAt,
    userId,
    createdAt: new Date()
  };
}