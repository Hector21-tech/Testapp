# 🚀 Integration Example - Facebook Connector

## ✅ Status: OAuth fungerar perfekt!

Test resultat:
- User ID: 122138107718826827  
- Name: Anton Axelsson
- Access Token: Received successfully
- Token expires: 5170075 seconds (~60 dagar)

## 📋 Integrera i din dashboard

### 1. Basic integration (apps/dashboard/src/components/FacebookTest.tsx)

```tsx
import React, { useState } from 'react';
import { FacebookConnector } from '@annonshjalpen/facebook-ads-connector';

export const FacebookTest: React.FC = () => {
  const [connector] = useState(() => new FacebookConnector({
    redirectUri: 'http://localhost:5173/auth/facebook/callback' // Din dashboard port
  }));
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const authUrl = connector.getAuthUrl('dashboard-test');
    window.open(authUrl, 'facebook-login', 'width=500,height=600');
    
    // Listen for callback
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'facebook-auth-success') {
        setLoading(true);
        try {
          const userInfo = await connector.authenticateWithCode(
            event.data.code, 
            'anton_axelsson' // Din user ID
          );
          setUser(userInfo);
          console.log('Facebook user:', userInfo);
        } catch (error) {
          console.error('Login failed:', error);
        }
        setLoading(false);
      }
    });
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Facebook Integration Test</h2>
      
      {!user ? (
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : '🔐 Connect Facebook'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-green-600 font-semibold">✅ Connected!</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      )}
    </div>
  );
};
```

### 2. Callback page (apps/dashboard/src/pages/FacebookCallback.tsx)

```tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const FacebookCallback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (window.opener) {
      // Send result to parent window
      window.opener.postMessage({
        type: 'facebook-auth-success',
        code,
        state,
        error
      }, '*');
      window.close();
    }
  }, [location]);

  return (
    <div className="p-6 text-center">
      <h2>Processing Facebook login...</h2>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
    </div>
  );
};
```

### 3. Router setup (apps/dashboard/src/App.tsx)

```tsx
import { Routes, Route } from 'react-router-dom';
import { FacebookCallback } from './pages/FacebookCallback';
import { FacebookTest } from './components/FacebookTest';

function App() {
  return (
    <Routes>
      <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
      <Route path="/facebook-test" element={<FacebookTest />} />
      {/* Your other routes */}
    </Routes>
  );
}
```

## 🔄 Nästa steg för Marketing API

För att få ads funktioner behöver du:

1. **Ansök om App Review på Facebook**
2. **Begär permissions:**
   - `ads_management` 
   - `ads_read`
   - `business_management`

3. **Efter godkännande, uppdatera scopes:**
```typescript
// I AuthManager.ts
const scope = this.config.scope || [
  'public_profile',
  'ads_management',  // Efter App Review
  'ads_read',        // Efter App Review  
  'business_management' // Efter App Review
];
```

## 🎯 Vad fungerar nu

**✅ Fungerar direkt:**
- Facebook OAuth login
- User profil data (namn, ID)
- Token management

**⏳ Kräver App Review:**
- Ad accounts access
- Campaign creation
- Business data

## 🚀 Production Checklist

- [ ] Uppdatera callback URL till din production domain
- [ ] Ansök om Facebook App Review
- [ ] Säkra app credentials (environment variables)
- [ ] Testa i production miljö

**Din Facebook integration är nu redo att användas!** 🎉