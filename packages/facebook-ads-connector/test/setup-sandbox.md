# Facebook Sandbox Setup Guide

This guide will help you set up a Facebook sandbox environment for testing the Facebook Ads Connector.

## Prerequisites

1. Facebook Developer Account
2. Facebook Business Manager Account
3. Test Facebook User Account

## Step 1: Configure Your Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Navigate to your app (App ID: 1265970594722150)
3. Go to **App Settings > Basic**
4. Add the following domains to **App Domains**:
   - `localhost`
   - Your production domain (if applicable)

## Step 2: Configure Marketing API

1. In your Facebook app dashboard, go to **Products**
2. Find **Marketing API** and click **Set Up**
3. In the Marketing API settings:
   - Enable **Standard Access** (for testing)
   - Add your redirect URIs:
     - `http://localhost:3000/auth/facebook/callback`
     - `http://localhost:8080/auth/facebook/callback`

## Step 3: Create Test Users

1. In your app dashboard, go to **Roles > Test Users**
2. Click **Add Test Users**
3. Create 2-3 test users with these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`

## Step 4: Set Up Test Ad Account

### Option A: Using Facebook Business Manager

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Business Settings > Accounts > Ad Accounts**
3. Click **Add** > **Create a New Ad Account**
4. Fill in the details:
   - **Ad Account Name**: "Test Account - AnnonsHjälpen"
   - **Time Zone**: Europe/Stockholm
   - **Currency**: SEK (Swedish Krona)
   - **Payment Method**: Add a test payment method

### Option B: Using Test Ad Account API

Facebook provides test ad accounts through their API. These are safer for development:

```javascript
// Create test ad account (use in manual test)
const testAccount = await connector.createTestAdAccount({
  name: 'Test Account - AnnonsHjälpen',
  currency: 'SEK',
  timezone_id: 159 // Stockholm
});
```

## Step 5: Grant Permissions

1. In Business Manager, go to **Business Settings > People**
2. Add your test users
3. Assign them to the test ad account with **Ad Account Admin** role

## Step 6: Configure OAuth Callback

Since we're testing locally, you need to handle the OAuth callback:

### Option A: Simple HTTP Server

Create a simple server to handle callbacks:

```javascript
// test-server.js
const express = require('express');
const app = express();

app.get('/auth/facebook/callback', (req, res) => {
  const { code, error, state } = req.query;
  
  if (error) {
    console.error('OAuth error:', error);
    res.send(`<h1>Error: ${error}</h1>`);
    return;
  }
  
  console.log('Authorization code received:', code);
  console.log('State:', state);
  
  res.send(`
    <h1>Authorization Successful!</h1>
    <p>Code: <code>${code}</code></p>
    <script>
      // Close popup if opened in popup
      if (window.opener) {
        window.opener.postMessage({ code: '${code}', state: '${state}' }, '*');
        window.close();
      }
    </script>
  `);
});

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
});
```

### Option B: Manual Token Testing

If you prefer to test with a manually obtained token:

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click **Get Token** > **Get User Access Token**
4. Select these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
5. Copy the generated access token
6. Use it in your manual test:

```javascript
const accessToken = 'YOUR_GENERATED_TOKEN';
const userInfo = await connector.authenticateWithToken(accessToken, 'test_user');
```

## Step 7: Run Tests

1. Start your callback server:
   ```bash
   node test-server.js
   ```

2. Run the manual test:
   ```bash
   cd packages/facebook-ads-connector
   npx ts-node test/manual-test.ts
   ```

3. Run unit tests:
   ```bash
   npm test
   ```

## Step 8: Test Scenarios

### Basic Flow Test
1. Generate OAuth URL
2. Complete Facebook login
3. Fetch ad accounts
4. Create test campaign
5. Verify campaign in Facebook Ads Manager
6. Clean up test data

### Error Handling Test
1. Test with invalid tokens
2. Test with expired tokens
3. Test with insufficient permissions
4. Test rate limiting behavior

### Edge Cases Test
1. Test with no ad accounts
2. Test with inactive accounts
3. Test with accounts in different currencies
4. Test campaign creation failures

## Troubleshooting

### Common Issues

1. **"Invalid OAuth access token"**
   - Check that your app has Marketing API enabled
   - Verify the access token has correct permissions
   - Make sure the token hasn't expired

2. **"Insufficient permissions"**
   - Check that the user has admin access to the ad account
   - Verify all required permissions are granted during OAuth

3. **"App not authorized"**
   - Make sure your app is in Development mode for testing
   - Or submit for App Review if using in production

4. **CORS errors in browser**
   - Use the popup method for OAuth instead of redirect
   - Or set up proper CORS headers on your callback server

### Debug Mode

Enable debug logging in your tests:

```javascript
import { LogLevel, createUserLogger } from '../src';

const logger = createUserLogger('test_user', LogLevel.DEBUG);
// Logger will show detailed API request/response information
```

## Sandbox Limitations

- Test ad accounts have spending limits
- Some advanced targeting options may not be available
- Test campaigns may not deliver actual impressions
- Rate limits are still enforced

## Cleanup

After testing:
1. Delete test campaigns in Facebook Ads Manager
2. Remove test ad accounts from Business Manager
3. Revoke access tokens if manually generated
4. Remove test users from your app

## Production Checklist

Before going live:
- [ ] App Review completed for required permissions
- [ ] Production redirect URIs configured
- [ ] Real payment methods added to ad accounts
- [ ] Rate limiting properly configured
- [ ] Error handling tested with real scenarios
- [ ] Security review of token storage
- [ ] GDPR compliance check for EU users