export interface FacebookAuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
}

export interface FacebookTokenInfo {
  app_id: string;
  type: string;
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  issued_at: number;
  scopes: string[];
  user_id: string;
}

export interface AuthConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}