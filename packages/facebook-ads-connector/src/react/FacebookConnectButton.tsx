import React, { useState, useCallback } from 'react';
import { FacebookConnector } from '../core/FacebookConnector';

export interface FacebookConnectButtonProps {
  connector: FacebookConnector;
  userId: string;
  onSuccess?: (userInfo: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  state?: string;
}

export const FacebookConnectButton: React.FC<FacebookConnectButtonProps> = ({
  connector,
  userId,
  onSuccess,
  onError,
  className = '',
  children,
  disabled = false,
  state
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(() => {
    if (disabled || isConnecting) return;

    setIsConnecting(true);
    
    try {
      // Get OAuth URL and redirect user
      const authUrl = connector.getAuthUrl(state || `fb_${userId}_${Date.now()}`);
      
      // Create popup window for OAuth
      const popup = window.open(
        authUrl,
        'facebook-oauth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          
          // Check if we have a successful authentication
          // This would typically be handled by your OAuth callback
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          const error = urlParams.get('error');

          if (error) {
            onError?.(new Error(`OAuth error: ${error}`));
          } else if (code) {
            // Handle successful OAuth
            handleOAuthSuccess(code);
          }
        }
      }, 1000);

    } catch (error) {
      setIsConnecting(false);
      onError?.(error as Error);
    }
  }, [connector, userId, state, disabled, isConnecting, onSuccess, onError]);

  const handleOAuthSuccess = async (code: string) => {
    try {
      const userInfo = await connector.authenticateWithCode(code, userId);
      onSuccess?.(userInfo);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsConnecting(false);
    }
  };

  const defaultClassName = `
    inline-flex items-center justify-center px-4 py-2 border border-transparent
    text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim();

  const buttonClassName = className || defaultClassName;

  return (
    <button
      onClick={handleConnect}
      disabled={disabled || isConnecting}
      className={buttonClassName}
      type="button"
    >
      {isConnecting ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </div>
      ) : (
        children || (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Connect Facebook
          </div>
        )
      )}
    </button>
  );
};