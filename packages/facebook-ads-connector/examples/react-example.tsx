import React, { useState } from 'react';
import { 
  FacebookConnector, 
  FacebookConnectButton,
  FacebookAccountSelector,
  FacebookCampaignCreator,
  FacebookStatus,
  AdAccount
} from '../src';

// Example React component using the Facebook Ads Connector
export const FacebookIntegrationExample: React.FC = () => {
  const [connector] = useState(() => new FacebookConnector({
    redirectUri: 'http://localhost:3000/auth/facebook/callback'
  }));
  
  const [userId] = useState('user_123');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleConnectionSuccess = (userInfo: any) => {
    setIsConnected(true);
    setMessage(`Connected successfully as ${userInfo.name}!`);
  };

  const handleConnectionError = (error: Error) => {
    setMessage(`Connection failed: ${error.message}`);
  };

  const handleAccountSelect = (account: AdAccount) => {
    setSelectedAccount(account);
    setMessage(`Selected ad account: ${account.name}`);
  };

  const handleCampaignSuccess = (result: { campaign: { id: string }; adSet: { id: string } }) => {
    setMessage(`Campaign created successfully! Campaign ID: ${result.campaign.id}, Ad Set ID: ${result.adSet.id}`);
  };

  const handleCampaignError = (error: Error) => {
    setMessage(`Campaign creation failed: ${error.message}`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedAccount(null);
    setMessage('Disconnected from Facebook');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Facebook Ads Integration Example
        </h1>

        {/* Status Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.includes('failed') || message.includes('error') 
              ? 'bg-red-50 text-red-800' 
              : 'bg-green-50 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* Connection Status */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Connection Status
          </h2>
          <FacebookStatus
            connector={connector}
            userId={userId}
            onDisconnect={handleDisconnect}
            showDetails={true}
            className="mb-4"
          />
        </div>

        {/* Connect Button */}
        {!isConnected && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Connect to Facebook
            </h2>
            <FacebookConnectButton
              connector={connector}
              userId={userId}
              onSuccess={handleConnectionSuccess}
              onError={handleConnectionError}
            />
          </div>
        )}

        {/* Account Selection */}
        {isConnected && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Select Ad Account
            </h2>
            <FacebookAccountSelector
              connector={connector}
              userId={userId}
              onAccountSelect={handleAccountSelect}
              selectedAccountId={selectedAccount?.account_id}
              requiredCapabilities={['CREATE_ADS']}
              className="mb-4"
            />
          </div>
        )}

        {/* Campaign Creator */}
        {isConnected && selectedAccount && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Create Campaign
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <FacebookCampaignCreator
                connector={connector}
                userId={userId}
                accountId={selectedAccount.account_id}
                onSuccess={handleCampaignSuccess}
                onError={handleCampaignError}
              />
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          How to Use
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click "Connect Facebook" to authenticate with your Facebook account</li>
          <li>Grant the necessary permissions for ad management</li>
          <li>Select an ad account from the dropdown</li>
          <li>Fill in the campaign details and click "Create Campaign"</li>
          <li>Your campaign and ad set will be created in Facebook Ads Manager</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">Note:</h3>
          <p className="text-blue-800 text-sm">
            This example creates campaigns in "PAUSED" status for safety. 
            You can activate them in Facebook Ads Manager once you've reviewed the settings.
          </p>
        </div>
      </div>

      {/* Component Features */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Available Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">FacebookConnectButton</h3>
            <p className="text-gray-600 text-sm">
              Handles OAuth authentication with Facebook. Opens popup window for login.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">FacebookAccountSelector</h3>
            <p className="text-gray-600 text-sm">
              Displays user's ad accounts with filtering options and detailed information.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">FacebookCampaignCreator</h3>
            <p className="text-gray-600 text-sm">
              Complete form for creating campaigns with targeting, budget, and validation.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">FacebookStatus</h3>
            <p className="text-gray-600 text-sm">
              Shows connection status, token info, and provides disconnect functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook example for using FacebookConnector in React
export const useFacebookConnector = (config?: any) => {
  const [connector] = useState(() => new FacebookConnector(config));

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      connector.destroy();
    };
  }, [connector]);

  return connector;
};

export default FacebookIntegrationExample;