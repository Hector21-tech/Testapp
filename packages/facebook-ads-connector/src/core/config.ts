export interface FacebookConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
  version?: string;
  sandbox?: boolean;
}

export const DEFAULT_CONFIG = {
  version: 'v19.0',
  sandbox: false,
  baseUrl: 'https://graph.facebook.com',
  oauthUrl: 'https://www.facebook.com'
};

export const FACEBOOK_CREDENTIALS = {
  appId: '1265970594722150',
  appSecret: 'bd18a84e81bc4baad8fd8c1a98ac2849'
};