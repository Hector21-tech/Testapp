# Facebook Ads Connector - Integration Guide

🚀 **Komplett guide för att integrera Facebook Ads Connector i AnnonsHjälpen**

## Steg 1: Installation i ditt projekt

### För huvudprojektet (AnnonsHjälpen)
```bash
cd apps/dashboard
npm install ../../packages/facebook-ads-connector
```

### För React komponenter
```bash
npm install react @types/react
```

## Steg 2: Basic Integration

### I ditt huvudprojekt (t.ex. `apps/dashboard/src/App.tsx`)

```tsx
import React from 'react';
import { FacebookIntegrationProvider } from './components/FacebookIntegration';

function App() {
  return (
    <div className="App">
      {/* Dina andra komponenter */}
      <FacebookIntegrationProvider />
    </div>
  );
}

export default App;
```

### Skapa Facebook Integration Provider

```tsx
// apps/dashboard/src/components/FacebookIntegration.tsx
import React, { createContext, useContext, useState } from 'react';
import { 
  FacebookConnector,
  FacebookConnectButton,
  FacebookAccountSelector,
  FacebookStatus,
  AdAccount
} from '@annonshjalpen/facebook-ads-connector';

// Context för att dela connector mellan komponenter
const FacebookContext = createContext<{
  connector: FacebookConnector;
  userId: string;
  selectedAccount: AdAccount | null;
  setSelectedAccount: (account: AdAccount | null) => void;
} | null>(null);

export const FacebookIntegrationProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [connector] = useState(() => new FacebookConnector({
    redirectUri: `${window.location.origin}/auth/facebook/callback`
  }));
  
  const [userId] = useState(() => {
    // Hämta user ID från din auth system
    return localStorage.getItem('currentUserId') || 'user_' + Date.now();
  });
  
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);

  return (
    <FacebookContext.Provider value={{ 
      connector, 
      userId, 
      selectedAccount, 
      setSelectedAccount 
    }}>
      <div className="facebook-integration">
        <h2>Facebook Ads Integration</h2>
        
        {/* Connection Status */}
        <FacebookStatus
          connector={connector}
          userId={userId}
          showDetails={true}
          className="mb-4"
        />
        
        {/* Connect Button */}
        <FacebookConnectButton
          connector={connector}
          userId={userId}
          onSuccess={(userInfo) => {
            console.log('Connected to Facebook as:', userInfo.name);
            // Optional: Save connection status to your backend
          }}
          onError={(error) => {
            console.error('Facebook connection failed:', error);
            // Optional: Show error to user
          }}
          className="mb-4"
        />
        
        {/* Account Selector */}
        <FacebookAccountSelector
          connector={connector}
          userId={userId}
          onAccountSelect={setSelectedAccount}
          selectedAccountId={selectedAccount?.account_id}
          requiredCapabilities={['CREATE_ADS']}
          className="mb-4"
        />
        
        {children}
      </div>
    </FacebookContext.Provider>
  );
};

// Hook för att använda Facebook context
export const useFacebook = () => {
  const context = useContext(FacebookContext);
  if (!context) {
    throw new Error('useFacebook must be used within FacebookIntegrationProvider');
  }
  return context;
};
```

## Steg 3: Campaign Creation Komponenter

```tsx
// apps/dashboard/src/components/CampaignCreator.tsx
import React from 'react';
import { FacebookCampaignCreator, CampaignObjective } from '@annonshjalpen/facebook-ads-connector';
import { useFacebook } from './FacebookIntegration';

export const CampaignCreator: React.FC = () => {
  const { connector, userId, selectedAccount } = useFacebook();

  if (!selectedAccount) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p>Please select a Facebook ad account first.</p>
      </div>
    );
  }

  const handleCampaignSuccess = (result: any) => {
    console.log('Campaign created successfully!', result);
    
    // Optional: Notify your backend
    fetch('/api/campaigns/facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facebookCampaignId: result.campaign.id,
        facebookAdSetId: result.adSet.id,
        accountId: selectedAccount.account_id
      })
    });
    
    // Optional: Show success message to user
    alert('Campaign created successfully in Facebook Ads Manager!');
  };

  const handleCampaignError = (error: Error) => {
    console.error('Campaign creation failed:', error);
    
    // Optional: Show user-friendly error message
    if (error.message.includes('budget')) {
      alert('Budget too low. Minimum is 100 öre (1 SEK)');
    } else if (error.message.includes('permission')) {
      alert('You need admin access to this ad account');
    } else {
      alert('Campaign creation failed. Please try again.');
    }
  };

  return (
    <div className="campaign-creator">
      <h3>Create Facebook Campaign</h3>
      <FacebookCampaignCreator
        connector={connector}
        userId={userId}
        accountId={selectedAccount.account_id}
        onSuccess={handleCampaignSuccess}
        onError={handleCampaignError}
      />
    </div>
  );
};
```

## Steg 4: OAuth Callback Hantering

### Skapa callback sida

```tsx
// apps/dashboard/src/pages/FacebookCallback.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const FacebookCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Facebook authentication...');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/dashboard'), 3000);
      return;
    }

    if (code) {
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      // Send code to parent window if opened in popup
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'facebook-auth-success',
          code,
          state 
        }, '*');
        window.close();
      } else {
        // Redirect to dashboard if not in popup
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        )}
        
        {status === 'success' && (
          <div className="text-green-600 text-6xl mb-4">✓</div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600 text-6xl mb-4">✗</div>
        )}
        
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};
```

### Lägg till route i din router

```tsx
// apps/dashboard/src/App.tsx eller din router konfiguration
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FacebookCallback } from './pages/FacebookCallback';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dina andra routes */}
        <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
      </Routes>
    </Router>
  );
}
```

## Steg 5: Backend Integration (Optional)

### Express.js exempel för att spara Facebook kampanjer

```javascript
// backend/routes/facebook.js
const express = require('express');
const router = express.Router();

// Save Facebook campaign to database
router.post('/campaigns/facebook', async (req, res) => {
  try {
    const { facebookCampaignId, facebookAdSetId, accountId, userId } = req.body;
    
    // Save to your database
    const campaign = await db.campaigns.create({
      userId,
      facebookCampaignId,
      facebookAdSetId,
      facebookAccountId: accountId,
      createdAt: new Date(),
      status: 'active'
    });
    
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Failed to save Facebook campaign:', error);
    res.status(500).json({ error: 'Failed to save campaign' });
  }
});

// Get user's Facebook campaigns
router.get('/campaigns/facebook/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const campaigns = await db.campaigns.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

module.exports = router;
```

## Steg 6: Environment Configuration

### `.env` fil för din app

```bash
# Facebook App Configuration
FACEBOOK_APP_ID=1265970594722150
FACEBOOK_APP_SECRET=bd18a84e81bc4baad8fd8c1a98ac2849
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

# Production URLs (när du går live)
# FACEBOOK_CALLBACK_URL=https://yourdomain.com/auth/facebook/callback
```

### Använda environment variables

```typescript
// apps/dashboard/src/config/facebook.ts
export const facebookConfig = {
  appId: process.env.REACT_APP_FACEBOOK_APP_ID || '1265970594722150',
  appSecret: process.env.FACEBOOK_APP_SECRET || 'bd18a84e81bc4baad8fd8c1a98ac2849',
  callbackUrl: process.env.REACT_APP_FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
};
```

## Steg 7: Styling Integration

### Tailwind CSS classes (om du använder Tailwind)

```css
/* apps/dashboard/src/styles/facebook-integration.css */
.facebook-integration {
  @apply max-w-4xl mx-auto p-6 space-y-6;
}

.facebook-connect-button {
  @apply inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.facebook-account-selector {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.facebook-status-connected {
  @apply flex items-center space-x-2 text-green-600;
}

.facebook-status-disconnected {
  @apply flex items-center space-x-2 text-red-600;
}
```

## Steg 8: Advanced Integration

### Custom Campaign Templates

```tsx
// apps/dashboard/src/components/CampaignTemplates.tsx
import React from 'react';
import { CampaignObjective } from '@annonshjalpen/facebook-ads-connector';
import { useFacebook } from './FacebookIntegration';

interface CampaignTemplate {
  name: string;
  objective: CampaignObjective;
  dailyBudget: number;
  description: string;
}

const templates: CampaignTemplate[] = [
  {
    name: 'Website Traffic',
    objective: CampaignObjective.TRAFFIC,
    dailyBudget: 50,
    description: 'Drive traffic to your website'
  },
  {
    name: 'Lead Generation',
    objective: CampaignObjective.LEADS,
    dailyBudget: 100,
    description: 'Collect leads for your business'
  },
  {
    name: 'Brand Awareness',
    objective: CampaignObjective.AWARENESS,
    dailyBudget: 30,
    description: 'Increase brand awareness'
  }
];

export const CampaignTemplates: React.FC = () => {
  const { connector, userId, selectedAccount } = useFacebook();

  const createFromTemplate = async (template: CampaignTemplate) => {
    if (!selectedAccount) {
      alert('Please select an ad account first');
      return;
    }

    try {
      const targeting = connector.createSwedishTargeting();
      
      const result = await connector.createCampaignWithAdSet(
        selectedAccount.account_id,
        {
          campaignName: `${template.name} - ${new Date().toLocaleDateString()}`,
          objective: template.objective,
          dailyBudget: template.dailyBudget,
          targeting
        },
        userId
      );

      alert(`Campaign "${template.name}" created successfully!`);
      console.log('Created campaign:', result);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  return (
    <div className="campaign-templates">
      <h3>Campaign Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.name} className="border rounded-lg p-4">
            <h4 className="font-semibold">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <p className="text-sm font-medium mb-3">
              Budget: {template.dailyBudget} SEK/day
            </p>
            <button
              onClick={() => createFromTemplate(template)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!selectedAccount}
            >
              Create Campaign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Steg 9: Error Boundary

```tsx
// apps/dashboard/src/components/FacebookErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FacebookErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Facebook integration error:', error, errorInfo);
    
    // Optional: Send error to monitoring service
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-semibold">Facebook Integration Error</h3>
          <p className="text-red-600 mt-2">
            Something went wrong with the Facebook integration. Please refresh the page and try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
export const App = () => (
  <FacebookErrorBoundary>
    <FacebookIntegrationProvider>
      {/* Your app content */}
    </FacebookIntegrationProvider>
  </FacebookErrorBoundary>
);
```

## Steg 10: Testing Integration

### Test i din utvecklingsmiljö

1. **Starta din app:**
   ```bash
   cd apps/dashboard
   npm start
   ```

2. **Öppna browser och gå till din app**

3. **Testa Facebook connection:**
   - Klicka "Connect Facebook" 
   - Logga in med ditt Facebook konto
   - Välj ett ad account
   - Skapa en test kampanj

4. **Verifiera i Facebook Ads Manager:**
   - Gå till [Facebook Ads Manager](https://adsmanager.facebook.com/)
   - Kontrollera att kampanjen skapades

## Production Deploy Checklist

- [ ] Environment variables konfigurerade för production
- [ ] Facebook app godkänd för Marketing API
- [ ] Production callback URLs tillagda i Facebook app
- [ ] HTTPS använts för alla callback URLs
- [ ] Error monitoring implementerat
- [ ] Database backup konfigurerat
- [ ] Rate limiting monitorering

## Troubleshooting

### Common Issues

1. **"Invalid OAuth access token"**
   - Kontrollera att din Facebook app har Marketing API aktiverat
   - Verifiera att redirect URI matchar exakt

2. **"Insufficient permissions"**
   - Se till att användaren har admin access till ad account
   - Kontrollera att alla required scopes är granted

3. **CORS errors**
   - Lägg till ditt domain i Facebook app settings
   - Använd popup OAuth flow istället för redirect

### Debug Mode

```typescript
// Enable debug logging
import { LogLevel, setLogger, createUserLogger } from '@annonshjalpen/facebook-ads-connector';

const debugLogger = createUserLogger('debug-user', LogLevel.DEBUG);
setLogger(debugLogger);

// Now all connector operations will be logged in detail
```

Nu har du en komplett integration av Facebook Ads Connector i ditt projekt! 🚀