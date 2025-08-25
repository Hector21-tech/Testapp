const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files for testing
app.use(express.static(path.join(__dirname, 'public')));

// OAuth callback endpoint
app.get('/auth/facebook/callback', (req, res) => {
  const { code, error, error_description, state } = req.query;
  
  console.log('\n🔗 Facebook OAuth Callback Received');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Query parameters:', req.query);
  
  if (error) {
    console.error('❌ OAuth Error:', error);
    console.error('Error Description:', error_description);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
          .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 5px; }
          code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ OAuth Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
          <p><strong>State:</strong> <code>${state || 'none'}</code></p>
        </div>
        <script>
          // Close popup if opened in popup window
          if (window.opener) {
            window.opener.postMessage({ 
              error: '${error}', 
              error_description: '${error_description}',
              state: '${state}' 
            }, '*');
            window.close();
          }
        </script>
      </body>
      </html>
    `);
    return;
  }
  
  if (!code) {
    console.error('❌ No authorization code received');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Missing Code</title></head>
      <body>
        <h1>❌ Error: No authorization code received</h1>
        <p>The OAuth flow did not return an authorization code.</p>
      </body>
      </html>
    `);
    return;
  }
  
  console.log('✅ Authorization Code Received');
  console.log('Code (first 20 chars):', code.substring(0, 20) + '...');
  console.log('State:', state || 'none');
  console.log('Full Code:', code);
  console.log('\n💡 Next Steps:');
  console.log('1. Copy the authorization code above');
  console.log('2. Use it in your manual test script');
  console.log('3. Or use the test form below\n');
  
  // Success page with test form
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OAuth Success - AnnonsHjälpen</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px;
          line-height: 1.6;
        }
        .success { 
          background: #efe; 
          border: 1px solid #cfc; 
          padding: 20px; 
          border-radius: 5px; 
          margin-bottom: 30px;
        }
        .code-box {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 15px;
          border-radius: 5px;
          font-family: 'Courier New', monospace;
          word-break: break-all;
          margin: 10px 0;
        }
        .test-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          border: 1px solid #dee2e6;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 3px;
          box-sizing: border-box;
        }
        button {
          background: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
        .results {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 5px;
          border: 1px solid #dee2e6;
          display: none;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div class="success">
        <h1>✅ Facebook OAuth Successful!</h1>
        <p>Authorization granted successfully for AnnonsHjälpen.</p>
        <p><strong>State:</strong> ${state || 'none'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>

      <h2>Authorization Code</h2>
      <p>Copy this authorization code to use in your tests:</p>
      <div class="code-box">${code}</div>

      <div class="test-form">
        <h2>🧪 Quick Test Form</h2>
        <p>Test the Facebook integration directly from this page:</p>
        
        <div class="form-group">
          <label for="userId">User ID:</label>
          <input type="text" id="userId" value="test_user_${Date.now()}" placeholder="Enter user ID">
        </div>

        <div class="form-group">
          <label for="action">Test Action:</label>
          <select id="action">
            <option value="authenticate">1. Authenticate with Code</option>
            <option value="getAccounts">2. Get Ad Accounts</option>
            <option value="getRecommendations">3. Get Budget Recommendations</option>
            <option value="createTargeting">4. Create Swedish Targeting</option>
          </select>
        </div>

        <button onclick="runTest()">Run Test</button>
        
        <div id="results" class="results">
          <h3>Results:</h3>
          <pre id="output"></pre>
        </div>
      </div>

      <script>
        // Close popup if opened in popup window
        if (window.opener) {
          window.opener.postMessage({ 
            code: '${code}', 
            state: '${state}',
            success: true
          }, '*');
          // Don't close automatically, let user see the results
        }

        async function runTest() {
          const userId = document.getElementById('userId').value;
          const action = document.getElementById('action').value;
          const resultsDiv = document.getElementById('results');
          const output = document.getElementById('output');
          
          resultsDiv.style.display = 'block';
          output.textContent = 'Running test...';
          
          try {
            const response = await fetch('/api/test', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: '${code}',
                userId: userId,
                action: action
              })
            });
            
            const result = await response.json();
            output.textContent = JSON.stringify(result, null, 2);
          } catch (error) {
            output.textContent = 'Error: ' + error.message + '\\n\\nNote: API endpoint not implemented. Use the authorization code in your manual test instead.';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Facebook OAuth test server is running'
  });
});

// API test endpoint (placeholder)
app.post('/api/test', express.json(), (req, res) => {
  console.log('🧪 API Test Request:', req.body);
  
  // This is a placeholder - implement actual testing logic here
  res.json({
    message: 'API test endpoint not fully implemented',
    received: req.body,
    note: 'Use the authorization code in your manual test script instead'
  });
});

// Serve a simple landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facebook OAuth Test Server</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .info { background: #e7f3ff; border: 1px solid #b3d9ff; padding: 20px; border-radius: 5px; }
        code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="info">
        <h1>🚀 Facebook OAuth Test Server</h1>
        <p>This server is running and ready to receive Facebook OAuth callbacks.</p>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>GET /auth/facebook/callback</code> - OAuth callback handler</li>
          <li><code>GET /health</code> - Health check</li>
          <li><code>POST /api/test</code> - Test API endpoint</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
          <li>Run your manual test script</li>
          <li>Click the generated OAuth URL</li>
          <li>Complete Facebook login</li>
          <li>You'll be redirected back here with the authorization code</li>
        </ol>
        <p><strong>Server Status:</strong> ✅ Running on port ${PORT}</p>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Facebook OAuth Test Server Started');
  console.log(`📍 Server running at: http://localhost:${PORT}`);
  console.log(`🔗 OAuth callback URL: http://localhost:${PORT}/auth/facebook/callback`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('✅ Ready to receive Facebook OAuth callbacks');
  console.log('💡 Run your manual test script to begin testing');
  console.log('');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down test server...');
  process.exit(0);
});

module.exports = app;