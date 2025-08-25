import { BaseAPI } from './BaseAPI';
import { AdSet } from '../types/campaigns';
import { AdSetData } from '../types/targeting';
import { APIRequestOptions } from '../types/common';

export class AdSetsAPI extends BaseAPI {

  /**
   * Get ad sets for an account
   */
  async getAdSets(
    accountId: string,
    options?: APIRequestOptions
  ): Promise<AdSet[]> {
    const defaultFields = [
      'id',
      'name',
      'campaign_id',
      'status',
      'effective_status',
      'created_time',
      'updated_time',
      'start_time',
      'end_time',
      'daily_budget',
      'lifetime_budget',
      'bid_amount',
      'optimization_goal',
      'targeting'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    const response = await this.get<AdSet[]>(`/act_${accountId}/adsets`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Get specific ad set by ID
   */
  async getAdSet(adSetId: string, fields?: string[]): Promise<AdSet | null> {
    const defaultFields = [
      'id',
      'name',
      'campaign_id',
      'status',
      'effective_status',
      'daily_budget',
      'lifetime_budget',
      'optimization_goal',
      'targeting'
    ];

    try {
      const response = await this.get<AdSet>(`/${adSetId}`, {
        fields: fields || defaultFields
      });

      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch ad set ${adSetId}:`, error);
      return null;
    }
  }

  /**
   * Create new ad set
   */
  async createAdSet(
    accountId: string,
    adSetData: AdSetData
  ): Promise<{ id: string } | null> {
    try {
      const data = {
        name: adSetData.name,
        campaign_id: adSetData.campaign_id,
        status: adSetData.status || 'PAUSED',
        daily_budget: adSetData.daily_budget,
        lifetime_budget: adSetData.lifetime_budget,
        bid_amount: adSetData.bid_amount,
        billing_event: adSetData.billing_event || 'IMPRESSIONS',
        optimization_goal: adSetData.optimization_goal || 'REACH',
        targeting: adSetData.targeting,
        start_time: adSetData.start_time,
        end_time: adSetData.end_time
      };

      // Remove undefined values
      Object.keys(data).forEach(key => {
        if (data[key as keyof typeof data] === undefined) {
          delete data[key as keyof typeof data];
        }
      });

      const response = await this.post(`/act_${accountId}/adsets`, data);
      
      return response.data || null;
    } catch (error) {
      console.error('Failed to create ad set:', error);
      throw error;
    }
  }

  /**
   * Update ad set
   */
  async updateAdSet(
    adSetId: string,
    updates: Partial<AdSetData>
  ): Promise<boolean> {
    try {
      const response = await this.patch(`/${adSetId}`, updates);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to update ad set ${adSetId}:`, error);
      throw error;
    }
  }

  /**
   * Delete ad set
   */
  async deleteAdSet(adSetId: string): Promise<boolean> {
    try {
      const response = await this.delete(`/${adSetId}`);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to delete ad set ${adSetId}:`, error);
      throw error;
    }
  }

  /**
   * Get ad set insights
   */
  async getAdSetInsights(
    adSetId: string,
    options?: {
      time_range?: { since: string; until: string };
      fields?: string[];
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
      time_range: options?.time_range
    };

    const response = await this.get(`/${adSetId}/insights`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Pause/Resume ad set
   */
  async toggleAdSetStatus(
    adSetId: string,
    status: 'ACTIVE' | 'PAUSED'
  ): Promise<boolean> {
    return this.updateAdSet(adSetId, { status });
  }
}