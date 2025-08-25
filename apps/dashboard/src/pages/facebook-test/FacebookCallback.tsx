import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const FacebookCallback: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Facebook authentication...');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const state = urlParams.get('state');

    console.log('Facebook callback received:', { 
      code: code?.substring(0, 50) + '...', 
      error, 
      errorDescription, 
      state,
      fullUrl: window.location.href
    });

    setDebugInfo({
      code: code ? code.substring(0, 50) + '...' : null,
      error,
      errorDescription,
      state,
      fullUrl: window.location.href
    });

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error} - ${errorDescription}`);
      
      // Send error to parent window if in popup
      if (window.opener) {
        setTimeout(() => {
          window.opener.postMessage({ 
            type: 'facebook-auth-success',
            error,
            errorDescription,
            state
          }, '*');
          window.close();
        }, 2000);
      }
      return;
    }

    if (code) {
      setStatus('success');
      setMessage('Authentication successful! Closing window...');
      
      // Send success to parent window if in popup
      if (window.opener) {
        console.log('Sending success message to parent window');
        setTimeout(() => {
          window.opener.postMessage({ 
            type: 'facebook-auth-success',
            code,
            state
          }, '*');
          window.close();
        }, 1500);
      } else {
        // If not in popup, redirect to dashboard after delay
        setMessage('Authentication successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      }
    } else {
      setStatus('error');
      setMessage('No authorization code received. Please try again.');
      
      if (window.opener) {
        setTimeout(() => {
          window.opener.postMessage({ 
            type: 'facebook-auth-success',
            error: 'no_code',
            errorDescription: 'No authorization code received'
          }, '*');
          window.close();
        }, 3000);
      }
    }
  }, [location]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        );
      case 'success':
        return (
          <div className="text-green-600 text-6xl">✓</div>
        );
      case 'error':
        return (
          <div className="text-red-600 text-6xl">✗</div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Facebook Authentication
        </h1>
        
        <p className={`text-lg mb-6 ${getStatusColor()}`}>
          {message}
        </p>

        {status === 'processing' && (
          <div className="text-sm text-gray-500">
            Please wait while we process your authentication...
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6">
            <button 
              onClick={() => window.location.href = '/facebook-test'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Debug info for development */}
        <div className="mt-8 text-left">
          <details className="bg-gray-100 rounded-lg p-4">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Debug Information
            </summary>
            <div className="mt-3 text-xs text-gray-600 font-mono space-y-1">
              <div><strong>URL:</strong> {debugInfo.fullUrl}</div>
              <div><strong>Code:</strong> {debugInfo.code || 'None'}</div>
              <div><strong>State:</strong> {debugInfo.state || 'None'}</div>
              <div><strong>Error:</strong> {debugInfo.error || 'None'}</div>
              <div><strong>Description:</strong> {debugInfo.errorDescription || 'None'}</div>
              <div><strong>In Popup:</strong> {window.opener ? 'Yes' : 'No'}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};