import { FacebookConnector, CampaignObjective } from '../src';

/**
 * Manual test script for Facebook Ads Connector
 * 
 * Before running this test:
 * 1. Make sure your Facebook app has Marketing API enabled
 * 2. Add your test user to the app as a test user or admin
 * 3. Create a test ad account in Facebook Business Manager
 * 4. Update the credentials and redirect URI below
 */

async function runManualTest() {
  console.log('🚀 Starting Facebook Ads Connector Manual Test\n');

  // Initialize connector
  const connector = new FacebookConnector({
    // Your app credentials (already configured in config.ts)
    redirectUri: 'http://localhost:3000/auth/facebook/callback'
  });

  const userId = 'test_user_123';

  try {
    // Test 1: OAuth URL Generation
    console.log('📋 Test 1: OAuth URL Generation');
    const authUrl = connector.getAuthUrl('test_state_123');
    console.log('✅ OAuth URL generated successfully');
    console.log(`🔗 Visit this URL to authenticate: ${authUrl}\n`);
    
    // Note: In a real test, you would:
    // 1. Visit the URL above
    // 2. Complete Facebook login
    // 3. Get the authorization code from the callback
    // 4. Use it in the next test

    // For this test, we'll simulate having an access token
    console.log('⚠️  Manual step required: Please complete OAuth flow to get access token\n');
    
    // Test 2: Token Authentication (you'll need a valid token)
    // Uncomment and add a valid token for testing:
    /*
    console.log('📋 Test 2: Token Authentication');
    const accessToken = 'YOUR_ACCESS_TOKEN_HERE';
    const userInfo = await connector.authenticateWithToken(accessToken, userId);
    console.log('✅ Authentication successful');
    console.log(`👤 User: ${userInfo.name} (${userInfo.id})\n`);

    // Test 3: Fetch Ad Accounts
    console.log('📋 Test 3: Fetch Ad Accounts');
    const accounts = await connector.getAdAccounts(userId);
    console.log(`✅ Found ${accounts.length} ad accounts`);
    accounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} (${account.account_id}) - ${account.currency}`);
      console.log(`      Status: ${account.account_status === 1 ? 'Active' : 'Inactive'}`);
      console.log(`      Capabilities: ${account.capabilities.join(', ')}`);
    });
    console.log('');

    if (accounts.length === 0) {
      console.log('❌ No ad accounts found. Please ensure your Facebook account has access to ad accounts.\n');
      return;
    }

    const testAccount = accounts[0];

    // Test 4: Account Details
    console.log('📋 Test 4: Account Details');
    const accountDetails = await connector.getAdAccount(testAccount.account_id, userId, true);
    console.log('✅ Account details fetched');
    console.log(`   Account: ${accountDetails?.name}`);
    console.log(`   Currency: ${accountDetails?.currency}`);
    console.log(`   Timezone: ${accountDetails?.timezone_name}\n`);

    // Test 5: Check Account Access
    console.log('📋 Test 5: Check Account Access');
    const access = await connector.checkAccountAccess(testAccount.account_id, userId);
    console.log(`✅ Account access check complete`);
    console.log(`   Has Access: ${access.hasAccess}`);
    console.log(`   Capabilities: ${access.capabilities.length}`);
    console.log(`   Permissions: ${access.permissions.length}\n`);

    // Test 6: Create Swedish Targeting
    console.log('📋 Test 6: Create Swedish Targeting');
    const targeting = connector.createSwedishTargeting({
      ageMin: 25,
      ageMax: 45,
      genders: [1, 2]
    });
    console.log('✅ Swedish targeting created');
    console.log(`   Countries: ${targeting.geo_locations?.countries?.join(', ')}`);
    console.log(`   Age Range: ${targeting.age_min}-${targeting.age_max}`);
    console.log(`   Genders: ${targeting.genders?.join(', ')}\n`);

    // Test 7: Budget Recommendations
    console.log('📋 Test 7: Budget Recommendations');
    const budgetRecs = connector.getBudgetRecommendations(CampaignObjective.TRAFFIC, 50000);
    console.log('✅ Budget recommendations generated');
    console.log(`   Daily: ${budgetRecs.daily} ${testAccount.currency}`);
    console.log(`   Lifetime: ${budgetRecs.lifetime} ${testAccount.currency}\n`);

    // Test 8: Create Campaign (WARNING: This will create a real campaign!)
    // Uncomment only if you want to create a test campaign:
    
    console.log('📋 Test 8: Create Test Campaign');
    const campaignResult = await connector.createCampaignWithAdSet(
      testAccount.account_id,
      {
        campaignName: 'Test Campaign - DELETE ME',
        objective: CampaignObjective.TRAFFIC,
        dailyBudget: 10, // Minimum budget
        targeting,
        adSetName: 'Test Ad Set - DELETE ME'
      },
      userId
    );
    
    console.log('✅ Campaign created successfully');
    console.log(`   Campaign ID: ${campaignResult.campaign.id}`);
    console.log(`   Ad Set ID: ${campaignResult.adSet.id}`);
    console.log('   ⚠️  Remember to delete this test campaign in Ads Manager!\n');
    

    // Test 9: Fetch Campaigns
    console.log('📋 Test 9: Fetch Campaigns');
    const campaigns = await connector.getCampaigns(testAccount.account_id, userId);
    console.log(`✅ Found ${campaigns.length} campaigns`);
    campaigns.slice(0, 5).forEach((campaign, index) => {
      console.log(`   ${index + 1}. ${campaign.name} (${campaign.id})`);
      console.log(`      Objective: ${campaign.objective}`);
      console.log(`      Status: ${campaign.status}`);
    });
    console.log('');

    // Test 10: Logout
    console.log('📋 Test 10: Logout');
    await connector.logout(userId);
    console.log('✅ Logout successful\n');
    */

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    // Cleanup
    connector.destroy();
    console.log('🧹 Connector destroyed\n');
  }

  console.log('✅ Manual test completed');
}

// Helper function to test error recovery
async function testErrorRecovery() {
  console.log('🚀 Testing Error Recovery\n');

  const connector = new FacebookConnector();
  
  try {
    // This should fail with authentication error
    await connector.getAdAccounts('invalid_user');
  } catch (error) {
    console.log('✅ Error handling working correctly');
    console.log(`   Error type: ${(error as any).constructor.name}`);
    console.log(`   Error code: ${(error as any).code}`);
    console.log(`   Error message: ${(error as any).message}\n`);
  }

  connector.destroy();
}

// Helper function to test rate limiting
async function testRateLimiting() {
  console.log('🚀 Testing Rate Limiting\n');

  const connector = new FacebookConnector();
  
  console.log('📋 Making multiple concurrent requests (should be rate limited)');
  
  const promises = Array(10).fill(0).map(async (_, i) => {
    try {
      return await connector.getAdAccounts(`test_user_${i}`);
    } catch (error) {
      return error;
    }
  });

  const results = await Promise.all(promises);
  
  console.log(`✅ Completed ${results.length} requests`);
  console.log('   Rate limiting system handled concurrent requests\n');

  connector.destroy();
}

// Run tests based on command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--error-recovery')) {
    testErrorRecovery();
  } else if (args.includes('--rate-limiting')) {
    testRateLimiting();
  } else {
    runManualTest();
  }
}

export { runManualTest, testErrorRecovery, testRateLimiting };