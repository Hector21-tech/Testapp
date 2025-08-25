import { BaseAPI } from './BaseAPI';
import { Ad } from '../types/campaigns';
import { AdData } from '../types/targeting';
import { APIRequestOptions } from '../types/common';

export class AdsAPI extends BaseAPI {

  /**
   * Get ads for an account
   */
  async getAds(
    accountId: string,
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
      'updated_time',
      'creative'
    ];

    const requestOptions: APIRequestOptions = {
      fields: options?.fields || defaultFields,
      limit: options?.limit || 25,
      ...options
    };

    const response = await this.get<Ad[]>(`/act_${accountId}/ads`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Get specific ad by ID
   */
  async getAd(adId: string, fields?: string[]): Promise<Ad | null> {
    const defaultFields = [
      'id',
      'name',
      'adset_id',
      'campaign_id',
      'status',
      'effective_status',
      'creative'
    ];

    try {
      const response = await this.get<Ad>(`/${adId}`, {
        fields: fields || defaultFields
      });

      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch ad ${adId}:`, error);
      return null;
    }
  }

  /**
   * Create new ad
   */
  async createAd(
    accountId: string,
    adData: AdData
  ): Promise<{ id: string } | null> {
    try {
      const data = {
        name: adData.name,
        adset_id: adData.adset_id,
        creative: adData.creative,
        status: adData.status || 'PAUSED'
      };

      const response = await this.post(`/act_${accountId}/ads`, data);
      
      return response.data || null;
    } catch (error) {
      console.error('Failed to create ad:', error);
      throw error;
    }
  }

  /**
   * Update ad
   */
  async updateAd(
    adId: string,
    updates: Partial<AdData>
  ): Promise<boolean> {
    try {
      const response = await this.patch(`/${adId}`, updates);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to update ad ${adId}:`, error);
      throw error;
    }
  }

  /**
   * Delete ad
   */
  async deleteAd(adId: string): Promise<boolean> {
    try {
      const response = await this.delete(`/${adId}`);
      return !!response.data;
    } catch (error) {
      console.error(`Failed to delete ad ${adId}:`, error);
      throw error;
    }
  }

  /**
   * Get ad insights
   */
  async getAdInsights(
    adId: string,
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

    const response = await this.get(`/${adId}/insights`, requestOptions);
    
    return response.data || [];
  }

  /**
   * Pause/Resume ad
   */
  async toggleAdStatus(
    adId: string,
    status: 'ACTIVE' | 'PAUSED'
  ): Promise<boolean> {
    return this.updateAd(adId, { status });
  }
}