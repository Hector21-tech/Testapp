export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  effective_status: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  stop_time?: string;
  daily_budget?: number;
  lifetime_budget?: number;
  budget_remaining?: number;
  buying_type: string;
  bid_strategy?: string;
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED'
}

export enum CampaignObjective {
  AWARENESS = 'AWARENESS',
  TRAFFIC = 'TRAFFIC',
  ENGAGEMENT = 'ENGAGEMENT',
  LEADS = 'LEADS',
  APP_PROMOTION = 'APP_PROMOTION',
  SALES = 'SALES'
}

export interface CreateCampaignData {
  name: string;
  objective: CampaignObjective;
  status?: CampaignStatus;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  stop_time?: string;
  buying_type?: string;
  bid_strategy?: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: CampaignStatus;
  effective_status: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  end_time?: string;
  daily_budget?: number;
  lifetime_budget?: number;
  bid_amount?: number;
  optimization_goal?: 'IMPRESSIONS' | 'CLICKS' | 'APP_INSTALLS' | 'REACH' | 'CONVERSIONS' | 'LINK_CLICKS' | 'POST_ENGAGEMENT' | 'LEAD_GENERATION';
  targeting?: any;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: CampaignStatus;
  effective_status: string;
  created_time: string;
  updated_time: string;
  creative?: {
    id: string;
    name: string;
    object_story_spec?: any;
  };
}