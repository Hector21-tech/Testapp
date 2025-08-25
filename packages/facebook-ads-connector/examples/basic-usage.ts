import { FacebookConnector, CampaignObjective } from '../src';

async function basicExample() {
  // Initialize connector
  const connector = new FacebookConnector({
    redirectUri: 'http://localhost:3000/auth/facebook/callback'
  });

  try {
    // Step 1: Get OAuth URL
    const authUrl = connector.getAuthUrl('unique-state-123');
    console.log('Visit this URL to authenticate:', authUrl);

    // Step 2: After user visits URL and you get callback with code
    const code = 'your_oauth_code_from_callback';
    const userId = 'user_123';
    
    const userInfo = await connector.authenticateWithCode(code, userId);
    console.log('Authenticated user:', userInfo.name);

    // Step 3: Get user's ad accounts
    const accounts = await connector.getAdAccounts();
    console.log(`Found ${accounts.length} ad accounts:`);
    accounts.forEach(account => {
      console.log(`- ${account.name} (${account.currency})`);
    });

    if (accounts.length === 0) {
      console.log('No ad accounts found');
      return;
    }

    const accountId = accounts[0].account_id;

    // Step 4: Create targeting for Swedish market
    const targeting = connector.createSwedishTargeting({
      ageMin: 25,
      ageMax: 45,
      genders: [1, 2] // Both male and female
    });

    // Step 5: Get budget recommendations
    const budgetRecs = connector.getBudgetRecommendations(
      CampaignObjective.TRAFFIC,
      50000 // estimated audience size
    );
    console.log('Recommended budgets:', budgetRecs);

    // Step 6: Create campaign with ad set
    const campaignConfig = {
      campaignName: 'Test Traffic Campaign',
      objective: CampaignObjective.TRAFFIC,
      dailyBudget: budgetRecs.daily,
      targeting,
      adSetName: 'Test Ad Set'
    };

    const { campaign, adSet } = await connector.createCampaignWithAdSet(
      accountId,
      campaignConfig
    );

    console.log('Created campaign:', campaign.id);
    console.log('Created ad set:', adSet.id);

    // Step 7: Get campaigns
    const campaigns = await connector.getCampaigns(accountId);
    console.log(`Account has ${campaigns.length} campaigns`);

    // Step 8: Logout
    await connector.logout();
    console.log('Logged out successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Always cleanup
    connector.destroy();
  }
}

// Error handling example
async function errorHandlingExample() {
  const connector = new FacebookConnector();

  try {
    // This will fail without authentication
    await connector.getAdAccounts('invalid-user');
  } catch (error) {
    if (error.code === 'AUTHENTICATION_ERROR') {
      console.log('User needs to authenticate');
    } else if (error.code === 'TOKEN_ERROR') {
      console.log('Token expired or invalid');
    } else if (error.code === 'VALIDATION_ERROR') {
      console.log('Invalid input:', error.message);
    } else {
      console.log('Unexpected error:', error.message);
    }
  }
}

// Rate limiting example
async function rateLimitingExample() {
  const connector = new FacebookConnector();
  
  // The connector automatically handles rate limiting
  // You can make multiple requests and they will be queued
  try {
    const promises = Array(20).fill(0).map(async (_, i) => {
      return connector.getAdAccounts(`user_${i}`);
    });

    const results = await Promise.all(promises);
    console.log('All requests completed');
  } catch (error) {
    console.error('Some requests failed:', error);
  }
}

// Run examples
if (require.main === module) {
  console.log('=== Basic Usage Example ===');
  basicExample();
  
  console.log('\n=== Error Handling Example ===');
  errorHandlingExample();
  
  console.log('\n=== Rate Limiting Example ===');
  rateLimitingExample();
}