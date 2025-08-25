import React, { useState, useEffect, useCallback } from 'react';
import { FacebookConnector } from '../core/FacebookConnector';
import { AdAccount } from '../types/accounts';

export interface FacebookAccountSelectorProps {
  connector: FacebookConnector;
  userId: string;
  onAccountSelect?: (account: AdAccount) => void;
  selectedAccountId?: string;
  className?: string;
  showInactive?: boolean;
  requiredCapabilities?: string[];
}

export const FacebookAccountSelector: React.FC<FacebookAccountSelectorProps> = ({
  connector,
  userId,
  onAccountSelect,
  selectedAccountId,
  className = '',
  showInactive = false,
  requiredCapabilities = []
}) => {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        includeInactive: showInactive,
        capabilities: requiredCapabilities.length > 0 ? requiredCapabilities : undefined
      };

      const fetchedAccounts = await connector.getAdAccounts(userId, options);
      setAccounts(fetchedAccounts);

      // Auto-select first account if none selected
      if (!selectedAccountId && fetchedAccounts.length > 0 && onAccountSelect) {
        onAccountSelect(fetchedAccounts[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [connector, userId, showInactive, requiredCapabilities, selectedAccountId, onAccountSelect]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = event.target.value;
    const account = accounts.find(acc => acc.account_id === accountId);
    if (account && onAccountSelect) {
      onAccountSelect(account);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Facebook amounts are in cents
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-600 ${className}`}>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
        <button 
          onClick={loadAccounts}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className={`text-gray-600 ${className}`}>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          No ad accounts found
        </div>
        <p className="text-sm mt-1">
          Make sure your Facebook account has access to advertising accounts.
        </p>
      </div>
    );
  }

  const defaultSelectClassName = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
    sm:text-sm
  `.trim();

  return (
    <div className={className}>
      <select
        value={selectedAccountId || ''}
        onChange={handleAccountChange}
        className={defaultSelectClassName}
      >
        <option value="">Select an Ad Account</option>
        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.name} ({account.currency}) 
            {account.account_status !== 1 && ' - Inactive'}
          </option>
        ))}
      </select>

      {selectedAccountId && (
        <div className="mt-2 text-sm text-gray-600">
          {(() => {
            const account = accounts.find(acc => acc.account_id === selectedAccountId);
            if (!account) return null;

            return (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Account ID:</span>
                  <span className="font-mono">{account.account_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span>{account.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span>{account.timezone_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={account.account_status === 1 ? 'text-green-600' : 'text-red-600'}>
                    {account.account_status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {account.capabilities.length > 0 && (
                  <div>
                    <span>Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {account.capabilities.map((cap) => (
                        <span 
                          key={cap}
                          className="px-2 py-1 bg-gray-100 text-xs rounded"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};