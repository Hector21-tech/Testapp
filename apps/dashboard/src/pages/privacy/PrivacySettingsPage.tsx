import React, { useState } from 'react';

interface PrivacySettings {
  dataCollection: boolean;
  marketingEmails: boolean;
  analyticsTracking: boolean;
  facebookDataAccess: boolean;
}

export const PrivacySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    dataCollection: true,
    marketingEmails: false,
    analyticsTracking: true,
    facebookDataAccess: true
  });

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      alert('Data deletion requested. You will receive a confirmation email within 24 hours.');
    }
  };

  const handleExportData = () => {
    alert('Data export requested. You will receive a download link via email within 24 hours.');
  };

  const handleDisconnectFacebook = () => {
    if (window.confirm('Disconnect Facebook account? This will stop all campaign management features.')) {
      alert('Facebook account disconnected. Your campaigns will continue running but cannot be managed from AnnonsHjälpen.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔒 Privacy & Data Settings
          </h1>
          <p className="text-gray-600">
            Manage your privacy preferences and control how AnnonsHjälpen uses your data.
            We are committed to protecting your privacy and complying with GDPR and Swedish data protection laws.
          </p>
        </div>

        {/* Facebook Permissions Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Facebook API Permissions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border border-green-200 rounded-md p-4 bg-green-50">
              <h3 className="font-medium text-green-900 mb-2">✅ public_profile</h3>
              <p className="text-sm text-green-700">
                <strong>Status:</strong> Active<br/>
                <strong>Used for:</strong> User authentication and profile display
              </p>
            </div>
            
            <div className="border border-orange-200 rounded-md p-4 bg-orange-50">
              <h3 className="font-medium text-orange-900 mb-2">⏳ ads_management</h3>
              <p className="text-sm text-orange-700">
                <strong>Status:</strong> Pending Review<br/>
                <strong>Used for:</strong> Creating and managing Facebook ad campaigns
              </p>
            </div>
            
            <div className="border border-orange-200 rounded-md p-4 bg-orange-50">
              <h3 className="font-medium text-orange-900 mb-2">⏳ ads_read</h3>
              <p className="text-sm text-orange-700">
                <strong>Status:</strong> Pending Review<br/>
                <strong>Used for:</strong> Reading campaign performance data and analytics
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">🔄 App Review Status</h3>
            <p className="text-sm text-blue-700">
              We have submitted an application to Facebook for Marketing API permissions. 
              Once approved, you will be able to create and manage Facebook campaigns directly from AnnonsHjälpen.
            </p>
          </div>
        </div>

        {/* Facebook Data Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
            Facebook Account Controls
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">Connected Facebook Account</h3>
              <p className="text-sm text-blue-700 mb-3">
                <strong>Account:</strong> Demo User (Test Account)<br/>
                <strong>Facebook ID:</strong> ••••••••••••••••••••••••<br/>
                <strong>Connected:</strong> Today<br/>
                <strong>Current Permissions:</strong> public_profile<br/>
                <strong>Requested Permissions:</strong> ads_management, ads_read, business_management<br/>
                <strong>Status:</strong> <span className="text-orange-600">Pending App Review</span>
              </p>
              <button
                onClick={handleDisconnectFacebook}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Disconnect Facebook Account
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Allow Facebook data access</h3>
                <p className="text-sm text-gray-600">
                  Enable AnnonsHjälpen to access your Facebook ad accounts and campaign data
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.facebookDataAccess}
                  onChange={(e) => handleSettingChange('facebookDataAccess', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Privacy Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Data Collection & Usage
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Campaign performance data collection</h3>
                <p className="text-sm text-gray-600">
                  Collect campaign metrics to provide analytics and optimize your ads
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataCollection}
                  onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Analytics and usage tracking</h3>
                <p className="text-sm text-gray-600">
                  Help us improve AnnonsHjälpen by collecting anonymous usage statistics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.analyticsTracking}
                  onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketing emails</h3>
                <p className="text-sm text-gray-600">
                  Receive updates about new features and marketing tips
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Rights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔐 Your Data Rights (GDPR)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-gray-900 mb-2">Export Your Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your data in JSON format. Includes account info, campaigns, and settings.
              </p>
              <button
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Request Data Export
              </button>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-gray-900 mb-2">Delete Your Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete all your data from AnnonsHjälpen. This cannot be undone.
              </p>
              <button
                onClick={handleDeleteData}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Delete All Data
              </button>
            </div>
          </div>
        </div>

        {/* What Data We Collect */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 What Data We Collect & Why
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Facebook Profile Data</h3>
              <p className="text-sm text-gray-600">
                <strong>What:</strong> Your name, Facebook ID, profile picture<br/>
                <strong>Why:</strong> To authenticate your account and personalize your experience<br/>
                <strong>Retention:</strong> Until you disconnect your Facebook account
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Facebook Ad Account Data</h3>
              <p className="text-sm text-gray-600">
                <strong>What:</strong> Ad account IDs, names, currencies, permissions<br/>
                <strong>Why:</strong> To show you available accounts and manage campaigns<br/>
                <strong>Retention:</strong> Until you disconnect your Facebook account
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-gray-900">Campaign Performance Data</h3>
              <p className="text-sm text-gray-600">
                <strong>What:</strong> Campaign metrics, impressions, clicks, costs<br/>
                <strong>Why:</strong> To provide analytics and optimize your campaigns<br/>
                <strong>Retention:</strong> 2 years or until account deletion
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Usage Analytics</h3>
              <p className="text-sm text-gray-600">
                <strong>What:</strong> Anonymous usage statistics, feature usage, error logs<br/>
                <strong>Why:</strong> To improve our service and fix issues<br/>
                <strong>Retention:</strong> 1 year, anonymized after 90 days
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Legal */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📞 Questions About Your Privacy?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have questions about how we handle your data or want to exercise your privacy rights, contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> jobb@torstens.se</p>
            <p><strong>Data Protection Officer:</strong> jobb@torstens.se</p>
            <p><strong>Address:</strong> Torstens Smakar Mera, Storgatan 39, 262 32 Ängelholm, Sweden</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
            <p>Last updated: August 25, 2025</p>
            <p>
              <a href="/privacy-policy" className="text-blue-600 hover:underline">Full Privacy Policy</a> • 
              <a href="/terms" className="text-blue-600 hover:underline ml-1">Terms of Service</a> • 
              <a href="/gdpr" className="text-blue-600 hover:underline ml-1">GDPR Compliance</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};