import { BaseAPI } from './BaseAPI';
import { AdAccount, AdAccountsResponse } from '../types/accounts';
import { APIRequestOptions } from '../types/common';

export class AccountsAPI extends BaseAPI {
  
  /**
   * Get all ad accounts for the authenticated user
   */
  async getAdAccounts(options?: APIRequestOptions): Promise<AdAccount[]> {
    const defaultFields = [
      'id',
      'account_id', 
      'name',
      'account_status',
      'currency',
      'timezone_name',
      'timezone_offset_hours_utc',
      'business',
      'capabilities'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    const response = await this.get<AdAccount[]>('/me/adaccounts', requestOptions);
    
    return response.data || [];
  }

  /**
   * Get specific ad account by ID
   */
  async getAdAccount(accountId: string, fields?: string[]): Promise<AdAccount | null> {
    const defaultFields = [
      'id',
      'account_id',
      'name', 
      'account_status',
      'currency',
      'timezone_name',
      'timezone_offset_hours_utc',
      'business',
      'capabilities'
    ];

    try {
      const response = await this.get<AdAccount>(`/act_${accountId}`, {
        fields: fields || defaultFields
      });

      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch ad account ${accountId}:`, error);
      return null;
    }
  }

  /**
   * Get account insights/stats
   */
  async getAccountInsights(
    accountId: string, 
    options?: {
      time_range?: { since: string; until: string };
      fields?: string[];
      level?: string;
    }
  ): Promise<any> {
    const defaultFields = [
      'impressions',
      'clicks',
      'spend',
      'reach',
      'frequency',
      'ctr',
      'cpc',
      'cpp',
      'cpm'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      time_range: options?.time_range,
    };

    const response = await this.get(`/act_${accountId}/insights`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Check if account has required permissions
   */
  async checkAccountPermissions(accountId: string): Promise<string[]> {
    try {
      const account = await this.getAdAccount(accountId, ['capabilities']);
      return account?.capabilities || [];
    } catch (error) {
      console.error(`Failed to check permissions for account ${accountId}:`, error);
      return [];
    }
  }

  /**
   * Get account spending limit
   */
  async getAccountSpendingLimit(accountId: string): Promise<{
    amount_spent: number;
    spend_cap: number;
    currency: string;
  } | null> {
    try {
      const response = await this.get(`/act_${accountId}`, {
        fields: ['amount_spent', 'spend_cap', 'currency']
      });

      return response.data || null;
    } catch (error) {
      console.error(`Failed to get spending limit for account ${accountId}:`, error);
      return null;
    }
  }
}