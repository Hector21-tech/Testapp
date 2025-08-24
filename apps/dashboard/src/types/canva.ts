/**
 * Canva API Types & Interfaces
 * 
 * Defines all types for Canva Connect API integration
 */

export interface CanvaDesignType {
  facebook_ad: {
    width: 1200;
    height: 630;
    name: 'Facebook Ad';
  };
  instagram_post: {
    width: 1080;
    height: 1080;
    name: 'Instagram Post';
  };
  google_ad: {
    width: 970;
    height: 250;
    name: 'Google Banner';
  };
  banner: {
    width: 728;
    height: 90;
    name: 'Web Banner';
  };
}

export interface CanvaTemplate {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  industry?: string;
  isPremium: boolean;
  tags: string[];
}

export interface CanvaBrandKit {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  fonts: {
    primary: string;
    secondary?: string;
  };
  logo?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface CanvaDesignResponse {
  id: string;
  title: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  urls: {
    edit_url: string;
    view_url: string;
  };
  status: 'draft' | 'published' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface CanvaExportRequest {
  design_id: string;
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality: 'low' | 'medium' | 'high';
  pages?: number[];
}

export interface CanvaExportResponse {
  job: {
    id: string;
    status: 'pending' | 'processing' | 'success' | 'failed';
    created_at: string;
  };
  urls?: {
    download_url: string;
    expires_at: string;
  }[];
}

export interface CanvaAPIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  request_id: string;
}

export interface CanvaWebhookEvent {
  event_type: 'design.publish' | 'design.update' | 'export.complete';
  data: {
    design_id: string;
    user_id: string;
    team_id?: string;
    timestamp: string;
  };
}

// Configuration types
export interface CanvaConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  environment: 'sandbox' | 'production';
}

export interface CanvaSDKOptions {
  config: CanvaConfig;
  onDesignOpen?: (design: CanvaDesignResponse) => void;
  onDesignPublish?: (design: CanvaDesignResponse) => void;
  onDesignClose?: () => void;
  onError?: (error: CanvaAPIError) => void;
}

// Helper types
export type DesignTypeKey = keyof CanvaDesignType;

export interface TemplateFilter {
  category?: string;
  industry?: string;
  isPremium?: boolean;
  tags?: string[];
  search?: string;
}

export interface BrandKitData {
  companyName: string;
  industry: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  description?: string;
}