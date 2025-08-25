import React, { useState, useEffect } from 'react';
import { FacebookConnector } from '../core/FacebookConnector';

export interface FacebookStatusProps {
  connector: FacebookConnector;
  userId: string;
  onDisconnect?: () => void;
  className?: string;
  showDetails?: boolean;
}

interface ConnectionStatus {
  isConnected: boolean;
  userInfo?: { id: string; name: string; email?: string };
  tokenInfo?: any;
  accountCount?: number;
  error?: string;
}

export const FacebookStatus: React.FC<FacebookStatusProps> = ({
  connector,
  userId,
  onDisconnect,
  className = '',
  showDetails = false
}) => {
  const [status, setStatus] = useState<ConnectionStatus>({ isConnected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, [connector, userId]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      
      const isConnected = await connector.isAuthenticated(userId);
      
      if (!isConnected) {
        setStatus({ isConnected: false });
        return;
      }

      let newStatus: ConnectionStatus = { isConnected: true };

      // Get additional details if requested
      if (showDetails) {
        try {
          const accounts = await connector.getAdAccounts(userId);
          newStatus.accountCount = accounts.length;

          if (showDetails) {
            const tokenInfo = await connector.getTokenInfo(userId);
            newStatus.tokenInfo = tokenInfo;
          }
        } catch (error) {
          newStatus.error = error instanceof Error ? error.message : 'Failed to load details';
        }
      }

      setStatus(newStatus);
    } catch (error) {
      setStatus({ 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Connection check failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await connector.logout(userId);
      setStatus({ isConnected: false });
      onDisconnect?.();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!status.isConnected) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-gray-600">Not connected to Facebook</span>
        {status.error && (
          <div className="text-sm text-red-600">
            ({status.error})
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-900">Connected to Facebook</span>
          
          {status.userInfo && (
            <span className="text-gray-600">
              as {status.userInfo.name}
            </span>
          )}

          {status.accountCount !== undefined && (
            <span className="text-sm text-gray-500">
              ({status.accountCount} ad accounts)
            </span>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Disconnect
        </button>
      </div>

      {status.error && (
        <div className="mt-2 text-sm text-orange-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Warning: {status.error}
          </div>
        </div>
      )}

      {showDetails && status.tokenInfo && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Connection Details</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>User ID:</span>
              <span className="font-mono">{status.tokenInfo.userId}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{new Date(status.tokenInfo.createdAt).toLocaleDateString()}</span>
            </div>
            {status.tokenInfo.expiresAt && (
              <div className="flex justify-between">
                <span>Expires:</span>
                <span className={
                  new Date(status.tokenInfo.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ? 'text-orange-600'
                    : ''
                }>
                  {new Date(status.tokenInfo.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Token Type:</span>
              <span>{status.tokenInfo.tokenType}</span>
            </div>
          </div>
          
          <button
            onClick={checkConnectionStatus}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};