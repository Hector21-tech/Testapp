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
  appId: '667138109089952',
  appSecret: 'e1950856689c62526056aa0e0522f017'
};