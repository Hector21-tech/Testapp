import { BaseAPI } from './BaseAPI';
import { 
  Campaign, 
  CreateCampaignData, 
  CampaignStatus, 
  CampaignObjective,
  AdSet,
  Ad 
} from '../types/campaigns';
import { APIRequestOptions } from '../types/common';

export class CampaignsAPI extends BaseAPI {

  /**
   * Get all campaigns for an ad account
   */
  async getCampaigns(
    accountId: string, 
    options?: APIRequestOptions & { status?: CampaignStatus[] }
  ): Promise<Campaign[]> {
    const defaultFields = [
      'id',
      'name',
      'objective',
      'status',
      'effective_status',
      'created_time',
      'updated_time',
      'start_time',
      'stop_time',
      'daily_budget',
      'lifetime_budget',
      'budget_remaining',
      'buying_type',
      'bid_strategy'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    // Add status filtering if provided
    const endpoint = `/act_${accountId}/campaigns`;
    let queryParams = '';
    
    if (options?.status && options.status.length > 0) {
      const statusFilter = options.status.map(s => `'${s}'`).join(',');
      queryParams = `?filtering=[{field:"status",operator:"IN",value:[${statusFilter}]}]`;
    }

    const response = await this.get<Campaign[]>(endpoint + queryParams, requestOptions);
    
    return response.data || [];
  }

  /**
   * Get specific campaign by ID
   */
  async getCampaign(campaignId: string, fields?: string[]): Promise<Campaign | null> {
    const defaultFields = [
      'id',
      'name',
      'objective',
      'status',
      'effective_status',
      'created_time',
      'updated_time',
      'daily_budget',
      'lifetime_budget'
    ];

    try {
      const response = await this.get<Campaign>(`/${campaignId}`, {
        fields: fields || defaultFields
      });

      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch campaign ${campaignId}:`, error);
      return null;
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    accountId: string, 
    campaignData: CreateCampaignData
  ): Promise<{ id: string } | null> {
    try {
      const data = {
        ...campaignData,
        status: campaignData.status || CampaignStatus.PAUSED
      };

      const response = await this.post(`/act_${accountId}/campaigns`, data);
      
      return response.data || null;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    campaignId: string, 
    updates: Partial<CreateCampaignData>
  ): Promise<boolean> {
    try {
      const response = await this.patch(`/${campaignId}`, updates);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to update campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const response = await this.delete(`/${campaignId}`);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to delete campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Get campaign insights/performance
   */
  async getCampaignInsights(
    campaignId: string,
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
      'cpm',
      'conversions',
      'cost_per_conversion'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      time_range: options?.time_range
    };

    const response = await this.get(`/${campaignId}/insights`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Get ad sets for a campaign
   */
  async getCampaignAdSets(
    campaignId: string,
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
      'daily_budget',
      'lifetime_budget',
      'optimization_goal'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    const response = await this.get<AdSet[]>(`/${campaignId}/adsets`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Get ads for a campaign
   */
  async getCampaignAds(
    campaignId: string,
    options?: APIRequestOptions
  ): Promise<Ad[]> {
    const defaultFields = [
      'id',
      'name',
      'adset_id',
      'campaign_id',
      'status',
      'effective_status',
      'created_time',
      'updated_time'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    const response = await this.get<Ad[]>(`/${campaignId}/ads`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Pause/Resume campaign
   */
  async toggleCampaignStatus(
    campaignId: string, 
    status: CampaignStatus.ACTIVE | CampaignStatus.PAUSED
  ): Promise<boolean> {
    return this.updateCampaign(campaignId, { status });
  }
}