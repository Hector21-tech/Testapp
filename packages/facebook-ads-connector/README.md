# Facebook Ads Connector

🚀 **Professional Facebook/Meta Ads API integration module för AnnonsHjälpen**

En komplett, produktionsredo lösning för att integrera Facebook Ads funktionalitet i din applikation. Byggd med TypeScript, omfattande error handling, rate limiting och React components.

## ✨ Features

- 🔐 **Säker OAuth Authentication** - Komplett Facebook login flow
- 📊 **Ad Account Management** - Hämta och hantera reklamkonton  
- 🎯 **Campaign Creation** - Skapa kampanjer med svenska targeting
- ⚡ **Smart Rate Limiting** - Automatisk hantering av API limits
- 🛡️ **Error Recovery** - Robust retry logic och token refresh
- ⚛️ **React Components** - Ready-to-use UI komponenter
- 📱 **TypeScript Support** - Fullständig type safety
- 🧪 **Comprehensive Testing** - Unit tests och manual testing tools

## 📦 Installation

```bash
npm install @annonshjalpen/facebook-ads-connector
```

### För React användare:
```bash
npm install @annonshjalpen/facebook-ads-connector react @types/react
```

## 🚀 Quick Start

### Basic JavaScript/TypeScript

```typescript
import { FacebookConnector, CampaignObjective } from '@annonshjalpen/facebook-ads-connector';

// 1. Initialize connector
const connector = new FacebookConnector({
  redirectUri: 'http://localhost:3000/auth/facebook/callback'
});

// 2. Start OAuth flow
const authUrl = connector.getAuthUrl('unique-state-123');
console.log('Visit this URL:', authUrl);

// 3. Efter OAuth callback med authorization code
const userInfo = await connector.authenticateWithCode(code, userId);
console.log('Authenticated as:', userInfo.name);

// 4. Fetch user's ad accounts
const accounts = await connector.getAdAccounts(userId);
console.log(`Found ${accounts.length} ad accounts`);

// 5. Create campaign with Swedish targeting
const result = await connector.createCampaignWithAdSet(accounts[0].account_id, {
  campaignName: 'My Traffic Campaign',
  objective: CampaignObjective.TRAFFIC,
  dailyBudget: 50, // 50 SEK per day
  targeting: connector.createSwedishTargeting({
    ageMin: 25,
    ageMax: 45
  })
}, userId);

console.log('Campaign created:', result.campaign.id);
```

### React Integration

```tsx
import React, { useState } from 'react';
import { 
  FacebookConnector,
  FacebookConnectButton,
  FacebookAccountSelector,
  FacebookCampaignCreator,
  FacebookStatus
} from '@annonshjalpen/facebook-ads-connector';

export const MyFacebookIntegration = () => {
  const [connector] = useState(() => new FacebookConnector());
  const [userId] = useState('user_123');
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div>
      {/* Connection Status */}
      <FacebookStatus
        connector={connector}
        userId={userId}
        showDetails={true}
      />

      {/* Connect Button */}
      <FacebookConnectButton
        connector={connector}
        userId={userId}
        onSuccess={(userInfo) => console.log('Connected!', userInfo)}
        onError={(error) => console.error('Failed:', error)}
      />

      {/* Account Selector */}
      <FacebookAccountSelector
        connector={connector}
        userId={userId}
        onAccountSelect={setSelectedAccount}
        requiredCapabilities={['CREATE_ADS']}
      />

      {/* Campaign Creator */}
      {selectedAccount && (
        <FacebookCampaignCreator
          connector={connector}
          userId={userId}
          accountId={selectedAccount.account_id}
          onSuccess={(result) => console.log('Campaign created!', result)}
          onError={(error) => console.error('Failed:', error)}
        />
      )}
    </div>
  );
};
```

## 📖 API Documentation

### FacebookConnector

Huvudklassen för all Facebook Ads integration.

#### Constructor
```typescript
new FacebookConnector(config?: Partial<FacebookConfig>)
```

**Config Options:**
- `appId?: string` - Facebook App ID (default: configured)
- `appSecret?: string` - Facebook App Secret (default: configured) 
- `redirectUri?: string` - OAuth redirect URI
- `version?: string` - Facebook API version (default: 'v19.0')
- `sandbox?: boolean` - Use sandbox mode (default: false)

#### Methods

##### Authentication
```typescript
// Generate OAuth URL
getAuthUrl(state?: string): string

// Authenticate with authorization code  
authenticateWithCode(code: string, userId: string): Promise<FacebookUser>

// Authenticate with existing token
authenticateWithToken(token: string, userId: string): Promise<FacebookUser>

// Check if user is authenticated
isAuthenticated(userId: string): Promise<boolean>

// Logout user
logout(userId?: string): Promise<void>
```

##### Ad Accounts
```typescript
// Get user's ad accounts
getAdAccounts(userId?: string, options?: {
  includeInactive?: boolean;
  capabilities?: string[];
}): Promise<AdAccount[]>

// Get specific ad account
getAdAccount(accountId: string, userId?: string): Promise<AdAccount | null>

// Check account access and permissions
checkAccountAccess(accountId: string, userId?: string): Promise<{
  hasAccess: boolean;
  capabilities: string[];
  permissions: string[];
}>
```

##### Campaigns
```typescript
// Get campaigns for an account
getCampaigns(accountId: string, userId?: string): Promise<Campaign[]>

// Create campaign
createCampaign(accountId: string, campaignData: CreateCampaignData, userId?: string): Promise<{ id: string }>

// Create campaign with ad set
createCampaignWithAdSet(accountId: string, config: {
  campaignName: string;
  objective: CampaignObjective;
  dailyBudget: number;
  targeting?: Targeting;
}, userId?: string): Promise<{
  campaign: { id: string };
  adSet: { id: string };
}>

// Get campaign insights
getCampaignInsights(campaignId: string, options?: {
  timeRange?: { since: string; until: string };
  fields?: string[];
}, userId?: string): Promise<any>
```

##### Helpers
```typescript
// Get budget recommendations
getBudgetRecommendations(objective: CampaignObjective, audienceSize?: number): {
  daily: number;
  lifetime: number;
}

// Create Swedish market targeting
createSwedishTargeting(options?: {
  ageMin?: number;
  ageMax?: number;
  genders?: (1 | 2)[];
}): Targeting
```

### React Components

#### FacebookConnectButton
```tsx
<FacebookConnectButton
  connector={connector}
  userId="user_123"
  onSuccess={(userInfo) => console.log('Connected!', userInfo)}
  onError={(error) => console.error('Error:', error)}
  className="custom-button-class"
  disabled={false}
/>
```

#### FacebookAccountSelector
```tsx
<FacebookAccountSelector
  connector={connector}
  userId="user_123"
  onAccountSelect={(account) => setSelectedAccount(account)}
  selectedAccountId={selectedAccount?.account_id}
  showInactive={false}
  requiredCapabilities={['CREATE_ADS', 'EDIT_ADS']}
/>
```

#### FacebookCampaignCreator
```tsx
<FacebookCampaignCreator
  connector={connector}
  userId="user_123"
  accountId="123456789"
  onSuccess={(result) => console.log('Created:', result)}
  onError={(error) => console.error('Error:', error)}
/>
```

#### FacebookStatus
```tsx
<FacebookStatus
  connector={connector}
  userId="user_123"
  onDisconnect={() => console.log('Disconnected')}
  showDetails={true}
/>
```

## 🎯 Campaign Objectives

```typescript
enum CampaignObjective {
  AWARENESS = 'AWARENESS',        // Brand awareness
  TRAFFIC = 'TRAFFIC',            // Website traffic  
  ENGAGEMENT = 'ENGAGEMENT',      // Post engagement
  LEADS = 'LEADS',               // Lead generation
  APP_PROMOTION = 'APP_PROMOTION', // App installs
  SALES = 'SALES'                // Conversions/sales
}
```

## 🌍 Swedish Market Targeting

Förkonfigurerad targeting för den svenska marknaden:

```typescript
const targeting = connector.createSwedishTargeting({
  ageMin: 25,        // Minimum age (13-65)
  ageMax: 45,        // Maximum age (13-65)  
  genders: [1, 2]    // 1 = male, 2 = female
});

// Includes automatically:
// - geo_locations: { countries: ['SE'] }
// - device_platforms: ['mobile', 'desktop']
// - publisher_platforms: ['facebook', 'instagram']
```

## 💰 Budget Management

```typescript
// Get smart budget recommendations
const recommendations = connector.getBudgetRecommendations(
  CampaignObjective.TRAFFIC,
  50000 // estimated audience size
);

console.log('Recommended daily budget:', recommendations.daily, 'SEK');
console.log('Recommended lifetime budget:', recommendations.lifetime, 'SEK');

// Budget validation
// - Minimum: 100 cents/öre (1 SEK/USD)
// - Automatic conversion to Facebook format (cents)
// - Objective-based recommendations
```

## 🛡️ Error Handling

Connector inkluderar robust error handling:

```typescript
try {
  const accounts = await connector.getAdAccounts(userId);
} catch (error) {
  if (error.code === 'AUTHENTICATION_ERROR') {
    // User needs to re-authenticate
    const authUrl = connector.getAuthUrl();
    // Redirect user to authUrl
  } else if (error.code === 'TOKEN_ERROR') {
    // Token expired, will auto-refresh
    console.log('Token refreshed automatically');
  } else if (error.code === 'VALIDATION_ERROR') {
    // Invalid input data
    console.error('Validation error:', error.message);
  } else {
    // Other errors
    console.error('API error:', error.message);
  }
}
```

**Error Types:**
- `AuthenticationError` - OAuth/login issues
- `TokenError` - Access token problems  
- `APIError` - Facebook API errors
- `ValidationError` - Input validation failures
- `FacebookConnectorError` - General connector errors

## ⚡ Rate Limiting

Automatisk rate limiting enligt Facebook's gränser:
- **200 requests/timme** (konservativ gräns)
- **50 requests/minut**
- **10 concurrent requests**

```typescript
// Rate limiting happens automatically
const promises = Array(20).fill(0).map(async (_, i) => {
  return connector.getAdAccounts(`user_${i}`);
});

// Requests will be queued and executed within rate limits
const results = await Promise.all(promises);
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Manual Integration Tests
```bash
# Test OAuth flow and basic functionality  
npm run test:manual

# Test error recovery mechanisms
npm run test:error

# Test rate limiting behavior
npm run test:rate

# Start OAuth callback server
npm run test:server
```

### Test med Facebook Sandbox

Se [`test/setup-sandbox.md`](test/setup-sandbox.md) för komplett setup guide.

## 🔧 Development

### Project Structure
```
packages/facebook-ads-connector/
├── src/
│   ├── core/           # Main FacebookConnector class
│   ├── auth/           # OAuth and token management
│   ├── api/            # Facebook API clients
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Helpers and utilities
│   └── react/          # React components
├── test/               # Testing tools and scripts
├── examples/           # Usage examples
└── dist/               # Built output
```

### Build Commands
```bash
npm run build      # Build TypeScript
npm run dev        # Watch mode
npm run test       # Run tests
npm run test:manual # Manual testing
```

## 🚨 Production Checklist

Innan du går live:

### Facebook App Setup
- [ ] App Review godkänd för Marketing API
- [ ] Production redirect URIs konfigurerade
- [ ] Business verification klar
- [ ] Rätta permissions: `ads_management`, `ads_read`, `business_management`

### Security
- [ ] App credentials säkert sparade (environment variables)
- [ ] Token storage säkert implementerat
- [ ] HTTPS använts för alla callbacks
- [ ] GDPR compliance för EU-användare

### Testing
- [ ] OAuth flow testat med riktiga användare
- [ ] Campaign creation verifierat i Facebook Ads Manager
- [ ] Error handling testat med olika scenarios
- [ ] Rate limiting verifierat under load

### Monitoring  
- [ ] Logging implementerat för production
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Alert system för API errors

## 🤝 Contributing

1. Fork projektet
2. Skapa feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push till branch (`git push origin feature/amazing-feature`)  
5. Öppna Pull Request

## 📄 License

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🆘 Support

- 📧 **Email:** support@annonshjalpen.se
- 📖 **Documentation:** [Facebook Marketing API Docs](https://developers.facebook.com/docs/marketing-api/)
- 🐛 **Issues:** [GitHub Issues](https://github.com/your-repo/issues)

---

**Byggd för AnnonsHjälpen med ❤️ i Sverige** 🇸🇪