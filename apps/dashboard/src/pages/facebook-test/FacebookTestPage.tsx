import React, { useState } from 'react';

export const FacebookTestPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFacebookConnect = () => {
    console.log('🔗 Starting Facebook OAuth...');
    
    // Generate Facebook OAuth URL
    const params = new URLSearchParams({
      client_id: '667138109089952',
      redirect_uri: `${window.location.origin}/auth/facebook/callback`,
      scope: 'public_profile',
      response_type: 'code',
      state: 'dashboard-test-' + Date.now()
    });
    
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
    console.log('🔗 OAuth URL:', authUrl);
    
    // Open popup
    const popup = window.open(authUrl, 'facebook-login', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      return;
    }

    setLoading(true);

    // Listen for callback
    const messageListener = async (event: MessageEvent) => {
      console.log('📨 Received message:', event.data);
      
      if (event.data.type === 'facebook-auth-success') {
        // Remove listener immediately to prevent duplicate calls
        window.removeEventListener('message', messageListener);
        
        if (event.data.code) {
          console.log('✅ Got authorization code:', event.data.code.substring(0, 30) + '...');
          
          try {
            // Step 1: Exchange code for access token
            console.log('🔄 Exchanging code for access token...');
            const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?` + 
              new URLSearchParams({
                client_id: '667138109089952',
                client_secret: 'e1950856689c62526056aa0e0522f017',
                redirect_uri: `${window.location.origin}/auth/facebook/callback`,
                code: event.data.code
              })
            );
            
            const tokenData = await tokenResponse.json();
            console.log('✅ Token response:', tokenData);
            
            if (tokenData.error) {
              throw new Error(`Token exchange failed: ${tokenData.error.message}`);
            }
            
            // Step 2: Get real user profile from Facebook
            console.log('🔄 Fetching user profile from Facebook...');
            const profileResponse = await fetch(
              `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${tokenData.access_token}`
            );
            
            const profileData = await profileResponse.json();
            console.log('✅ Real Facebook profile data:', profileData);
            
            if (profileData.error) {
              throw new Error(`Profile fetch failed: ${profileData.error.message}`);
            }
            
            // Set real user data from Facebook API
            setUser({
              id: profileData.id,
              name: profileData.name
            });
            
          } catch (error) {
            console.error('❌ Facebook API error:', error);
            // Fallback to demo data if API fails
            setUser({
              id: 'error-fallback',
              name: 'API Error - Using Fallback'
            });
          }
          
          popup.close();
        }
        setLoading(false);
      }
    };

    window.addEventListener('message', messageListener);

    // Handle popup close
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setLoading(false);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔐 Facebook Integration Test
          </h1>
          
          {!user ? (
            <div>
              <p className="text-lg mb-4">
                Test Facebook OAuth integration:
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleFacebookConnect}
                  disabled={loading}
                  className={`px-6 py-3 rounded text-white font-medium ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? '🔄 Connecting...' : '🔐 Connect Facebook'}
                </button>
                
                {/* Test button to simulate success */}
                <button 
                  onClick={() => {
                    console.log('🧪 Simulating successful login');
                    setUser({
                      id: 'demo_user_12345',
                      name: 'Demo User (Test Account)'
                    });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  🧪 Test Success (Demo)
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ Facebook Connected!
                </h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>
              
              <button 
                onClick={() => setUser(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Disconnect
              </button>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p><strong>Callback URL:</strong> {window.location.origin}/auth/facebook/callback</p>
            <p><strong>App ID:</strong> 667138109089952</p>
            <p><strong>Current Scopes:</strong> public_profile</p>
            <p><strong>Requested Scopes:</strong> public_profile, ads_management, ads_read, business_management</p>
            <p className="text-orange-600"><strong>Status:</strong> Pending App Review for Marketing API permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};