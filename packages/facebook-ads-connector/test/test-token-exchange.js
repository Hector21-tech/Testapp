// Test token exchange - convert authorization code to access token
const https = require('https');
const { URL } = require('url');

// Your authorization code from the OAuth flow
const authCode = 'AQCHoUVrp-UuPV6V56AhRFsP47JEhkar17BNsfK7jXAYCLKpvjs0iUTXKyEN5K8KkwT4QNBVXbKHGRalzClEzYT0yee_Y_MHXlSYqt7pN5z6aA-D5s0o2jrRM3LsAzsV8fzTlSqk95jodvhxgCsCI1Zj4A-CuAq-Z-1LBV8kwG4ehXFIg0gdPc-Cqyv9jul1OeupW_oa1AZYv1UfimZuM69PMZJg2Owg4a8-ciGqbpwvFttfPmDkeqXno85f_pAbx4o8layYI4go0whWH6NFbmtJlryBZxqoyZy2Cgd-sFAXef3uHbdjr9f9nuImaXMbGBQ6WJrwH5fM7n2zCRu7oZhqXavjDyWoeIRA602yQi7shTb29yIPq3-IwTdbRrTP4GU';

// Facebook app credentials
const appId = '1265970594722150';
const appSecret = 'bd18a84e81bc4baad8fd8c1a98ac2849';
const redirectUri = 'http://localhost:3000/auth/facebook/callback';

console.log('🔄 Testing token exchange...');
console.log('📋 Auth Code:', authCode.substring(0, 50) + '...');

// Step 1: Exchange code for access token
const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
tokenUrl.searchParams.set('client_id', appId);
tokenUrl.searchParams.set('client_secret', appSecret);
tokenUrl.searchParams.set('redirect_uri', redirectUri);
tokenUrl.searchParams.set('code', authCode);

console.log('🌐 Token exchange URL:', tokenUrl.toString().replace(appSecret, '***'));

https.get(tokenUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const tokenResponse = JSON.parse(data);
      
      if (tokenResponse.error) {
        console.log('❌ Token Exchange Error:');
        console.log('   Error:', tokenResponse.error.message);
        console.log('   Type:', tokenResponse.error.type);
        console.log('   Code:', tokenResponse.error.code);
        return;
      }
      
      console.log('✅ Token Exchange Success!');
      console.log('📋 Access Token:', tokenResponse.access_token?.substring(0, 50) + '...');
      console.log('📋 Token Type:', tokenResponse.token_type);
      console.log('📋 Expires In:', tokenResponse.expires_in, 'seconds');
      
      // Step 2: Test the access token by getting user profile
      const profileUrl = `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${tokenResponse.access_token}`;
      
      console.log('\n🔄 Testing user profile fetch...');
      
      https.get(profileUrl, (profileRes) => {
        let profileData = '';
        
        profileRes.on('data', (chunk) => {
          profileData += chunk;
        });
        
        profileRes.on('end', () => {
          try {
            const profile = JSON.parse(profileData);
            
            if (profile.error) {
              console.log('❌ Profile Fetch Error:', profile.error.message);
              return;
            }
            
            console.log('✅ User Profile Success!');
            console.log('👤 User ID:', profile.id);
            console.log('👤 Name:', profile.name);
            
            console.log('\n🎉 Complete OAuth flow test SUCCESSFUL!');
            console.log('📋 Summary:');
            console.log('   ✅ Authorization code received');
            console.log('   ✅ Access token obtained');
            console.log('   ✅ User profile fetched');
            console.log('   ✅ Facebook connector ready for integration!');
            
          } catch (e) {
            console.log('❌ Profile parsing error:', e.message);
            console.log('📋 Raw response:', profileData);
          }
        });
      }).on('error', (e) => {
        console.log('❌ Profile request error:', e.message);
      });
      
    } catch (e) {
      console.log('❌ Token parsing error:', e.message);
      console.log('📋 Raw response:', data);
    }
  });
}).on('error', (e) => {
  console.log('❌ Token request error:', e.message);
});