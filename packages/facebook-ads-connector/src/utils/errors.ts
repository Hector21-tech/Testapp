export class FacebookConnectorError extends Error {
  public code: string;
  public facebookCode?: number;
  
  constructor(message: string, code: string, facebookCode?: number) {
    super(message);
    this.name = 'FacebookConnectorError';
    this.code = code;
    this.facebookCode = facebookCode;
  }
}

export class AuthenticationError extends FacebookConnectorError {
  constructor(message: string, facebookCode?: number) {
    super(message, 'AUTHENTICATION_ERROR', facebookCode);
    this.name = 'AuthenticationError';
  }
}

export class TokenError extends FacebookConnectorError {
  constructor(message: string, facebookCode?: number) {
    super(message, 'TOKEN_ERROR', facebookCode);
    this.name = 'TokenError';
  }
}

export class APIError extends FacebookConnectorError {
  constructor(message: string, facebookCode?: number) {
    super(message, 'API_ERROR', facebookCode);
    this.name = 'APIError';
  }
}

export class ValidationError extends FacebookConnectorError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export function createErrorFromResponse(error: any): FacebookConnectorError {
  if (error.response?.data?.error) {
    const fbError = error.response.data.error;
    
    // Map Facebook error codes to our error types
    if (fbError.code >= 190 && fbError.code <= 199) {
      return new TokenError(fbError.message, fbError.code);
    }
    
    if (fbError.code >= 100 && fbError.code <= 199) {
      return new APIError(fbError.message, fbError.code);
    }
    
    return new FacebookConnectorError(fbError.message, 'FACEBOOK_ERROR', fbError.code);
  }
  
  return new FacebookConnectorError(
    error.message || 'Unknown error occurred',
    'UNKNOWN_ERROR'
  );
}