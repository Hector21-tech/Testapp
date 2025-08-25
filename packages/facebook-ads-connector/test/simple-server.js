const http = require('http');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle Facebook OAuth callback
  if (parsedUrl.pathname === '/auth/facebook/callback') {
    const { code, error, error_description, state } = parsedUrl.query;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    if (error) {
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="color: red;">❌ OAuth Error</h1>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Description:</strong> ${error_description || 'Unknown error'}</p>
            <p><strong>State:</strong> ${state || 'none'}</p>
            <hr>
            <p>This means there's an issue with the Facebook app configuration.</p>
          </body>
        </html>
      `);
    } else if (code) {
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="color: green;">✅ OAuth Success!</h1>
            <p><strong>Authorization Code:</strong></p>
            <code style="background: #f5f5f5; padding: 10px; display: block; word-break: break-all;">${code}</code>
            <p><strong>State:</strong> ${state || 'none'}</p>
            <hr>
            <p>🎉 Facebook OAuth flow worked! You can now use this code to get an access token.</p>
            <p><strong>Next step:</strong> Use this code in your Facebook connector to authenticate.</p>
          </body>
        </html>
      `);
      
      // Log to console for easy copy-paste
      console.log('✅ SUCCESS! Authorization code:', code);
      console.log('State:', state);
    } else {
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1>Facebook OAuth Callback</h1>
            <p>Waiting for OAuth response...</p>
            <p>URL: ${req.url}</p>
          </body>
        </html>
      `);
    }
  } else {
    // Default response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>🚀 Facebook OAuth Callback Server</h1>
          <p><strong>Server running on:</strong> http://localhost:${PORT}</p>
          <p><strong>Callback URL:</strong> http://localhost:${PORT}/auth/facebook/callback</p>
          <hr>
          <h2>Test OAuth URL:</h2>
          <p>Click this link to test Facebook OAuth:</p>
          <a href="https://www.facebook.com/v19.0/dialog/oauth?client_id=1265970594722150&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=public_profile&response_type=code&state=test-123" target="_blank" style="background: #4267B2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            🔐 Login with Facebook
          </a>
          <hr>
          <p><strong>Current request:</strong> ${req.url}</p>
        </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 OAuth Callback Server running on http://localhost:${PORT}`);
  console.log(`📋 Callback URL: http://localhost:${PORT}/auth/facebook/callback`);
  console.log(`🔗 Test OAuth: https://www.facebook.com/v19.0/dialog/oauth?client_id=1265970594722150&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=public_profile&response_type=code&state=test-123`);
  console.log(`\n✋ Press Ctrl+C to stop server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down OAuth server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});