/**
 * Canva API Service
 * 
 * Handles all communication with Canva Connect API
 * Currently in mock mode - ready for real API integration
 * 
 * TODO: 
 * - Replace mocks with real Canva Connect API calls
 * - Add authentication flow
 * - Implement webhook handling
 * - Add error handling & retry logic
 */

import type {
  CanvaTemplate,
  CanvaBrandKit,
  CanvaDesignResponse,
  CanvaExportRequest,
  CanvaExportResponse,
  CanvaAPIError,
  DesignTypeKey,
  TemplateFilter,
  BrandKitData
} from '../types/canva';
import type { CompanyProfile } from '../features/campaign/types';

class CanvaAPIService {
  private apiKey: string;
  private baseURL: string;
  private clientId: string;

  constructor() {
    // TODO: Move to environment variables
    this.apiKey = process.env.REACT_APP_CANVA_API_KEY || 'demo_key';
    this.clientId = process.env.REACT_APP_CANVA_CLIENT_ID || 'demo_client';
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api.canva.com/rest/v1'
      : 'https://api.canva.com/rest/v1'; // Same for now, change to sandbox when available
  }

  /**
   * Initialize Canva SDK
   */
  async initialize(): Promise<boolean> {
    try {
      // TODO: Initialize Canva SDK
      // await CanvaSDK.initialize({ apiKey: this.apiKey, clientId: this.clientId });
      console.log('🎨 Canva API initialized (mock mode)');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Canva API:', error);
      return false;
    }
  }

  /**
   * Get templates filtered by industry/category
   */
  async getTemplates(
    designType: DesignTypeKey,
    filter: TemplateFilter = {}
  ): Promise<CanvaTemplate[]> {
    try {
      // TODO: Real API call
      // const response = await fetch(`${this.baseURL}/templates`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
      //   method: 'GET'
      // });
      
      // Mock response based on industry
      await this.delay(500); // Simulate API call
      
      const mockTemplates: CanvaTemplate[] = [
        {
          id: 'template-1',
          title: 'Professional Service Ad',
          thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
          category: 'business',
          industry: filter.industry || 'general',
          isPremium: false,
          tags: ['professional', 'clean', 'business']
        },
        {
          id: 'template-2', 
          title: 'Handyman Special',
          thumbnail: 'https://images.unsplash.com/photo-1581092918484-8313de64ce2d?w=300&h=200&fit=crop',
          category: 'contractor',
          industry: filter.industry || 'general',
          isPremium: true,
          tags: ['tools', 'handyman', 'professional']
        },
        {
          id: 'template-3',
          title: 'Quality Craftsmanship',
          thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop',
          category: 'services',
          industry: filter.industry || 'general', 
          isPremium: false,
          tags: ['quality', 'craft', 'reliable']
        }
      ];

      return mockTemplates;
    } catch (error) {
      console.error('❌ Failed to fetch templates:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Create brand kit from company profile
   */
  async createBrandKit(companyProfile: CompanyProfile): Promise<CanvaBrandKit> {
    try {
      // TODO: Real API call to create brand kit
      // const response = await fetch(`${this.baseURL}/brand-kits`, {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: `${companyProfile.companyName} Brand Kit`,
      //     colors: { primary: '#9B4521', secondary: '#C7683A' }
      //   })
      // });

      await this.delay(800);

      const mockBrandKit: CanvaBrandKit = {
        id: `brand-kit-${companyProfile.companyName.toLowerCase().replace(/\s+/g, '-')}`,
        name: `${companyProfile.companyName} Brand Kit`,
        colors: {
          primary: '#9B4521', // AnnonsHjälpen brand color
          secondary: '#C7683A',
          accent: '#7F361B'
        },
        fonts: {
          primary: 'Inter',
          secondary: 'JetBrains Mono'
        }
      };

      return mockBrandKit;
    } catch (error) {
      console.error('❌ Failed to create brand kit:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Create new design from template
   */
  async createDesignFromTemplate(
    templateId: string,
    companyProfile: CompanyProfile,
    designType: DesignTypeKey = 'facebook_ad'
  ): Promise<CanvaDesignResponse> {
    try {
      // TODO: Real API call
      // const response = await fetch(`${this.baseURL}/designs`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     template_id: templateId,
      //     title: `${companyProfile.companyName} ${designType} Ad`
      //   })
      // });

      await this.delay(1200);

      const mockDesign: CanvaDesignResponse = {
        id: `design-${Date.now()}`,
        title: `${companyProfile.companyName} ${designType.replace('_', ' ')} Ad`,
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
          width: 300,
          height: 200
        },
        urls: {
          edit_url: `https://www.canva.com/design/${templateId}/edit`,
          view_url: `https://www.canva.com/design/${templateId}/view`
        },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return mockDesign;
    } catch (error) {
      console.error('❌ Failed to create design:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Export design to image
   */
  async exportDesign(
    designId: string,
    options: Partial<CanvaExportRequest> = {}
  ): Promise<CanvaExportResponse> {
    try {
      const exportRequest: CanvaExportRequest = {
        design_id: designId,
        format: options.format || 'png',
        quality: options.quality || 'high',
        ...options
      };

      // TODO: Real API call
      // const response = await fetch(`${this.baseURL}/exports`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(exportRequest)
      // });

      await this.delay(2000); // Simulate export processing

      const mockExport: CanvaExportResponse = {
        job: {
          id: `export-${Date.now()}`,
          status: 'success',
          created_at: new Date().toISOString()
        },
        urls: [{
          download_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }]
      };

      return mockExport;
    } catch (error) {
      console.error('❌ Failed to export design:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Get export job status
   */
  async getExportStatus(jobId: string): Promise<CanvaExportResponse> {
    try {
      // TODO: Real API call
      // const response = await fetch(`${this.baseURL}/exports/${jobId}`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
      // });

      await this.delay(300);

      const mockStatus: CanvaExportResponse = {
        job: {
          id: jobId,
          status: 'success',
          created_at: new Date().toISOString()
        },
        urls: [{
          download_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }]
      };

      return mockStatus;
    } catch (error) {
      console.error('❌ Failed to get export status:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Open Canva editor for design
   */
  async openCanvaEditor(designId: string): Promise<void> {
    try {
      // TODO: Use Canva SDK to open editor
      // CanvaSDK.openDesign(designId);
      
      // Mock: Open in new tab
      const editUrl = `https://www.canva.com/design/${designId}/edit`;
      console.log('🎨 Would open Canva editor:', editUrl);
      
      // In real implementation, this would open embedded editor
      // window.open(editUrl, '_blank');
    } catch (error) {
      console.error('❌ Failed to open Canva editor:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleAPIError(error: any): CanvaAPIError {
    return {
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        details: error.details || {}
      },
      request_id: error.request_id || `req-${Date.now()}`
    };
  }

  /**
   * Utility: Simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // TODO: Real health check
      // const response = await fetch(`${this.baseURL}/health`);
      await this.delay(200);
      console.log('✅ Canva API health check passed (mock)');
      return true;
    } catch (error) {
      console.error('❌ Canva API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const canvaAPI = new CanvaAPIService();
export default canvaAPI;