export interface GeoTargeting {
  countries?: string[];
  regions?: string[];
  cities?: string[];
  zips?: string[];
  location_types?: ('home' | 'recent')[];
}

export interface DemographicTargeting {
  age_min?: number;
  age_max?: number;
  genders?: (1 | 2)[];  // 1 = male, 2 = female
}

export interface InterestTargeting {
  interests?: { id: string; name?: string }[];
  behaviors?: { id: string; name?: string }[];
  life_events?: { id: string; name?: string }[];
}

export interface CustomAudience {
  id: string;
  name: string;
}

export interface DetailedTargeting {
  interests?: { id: string; name?: string }[];
  behaviors?: { id: string; name?: string }[];
  demographics?: { id: string; name?: string }[];
  life_events?: { id: string; name?: string }[];
}

export interface Targeting {
  geo_locations?: GeoTargeting;
  age_min?: number;
  age_max?: number;
  genders?: (1 | 2)[];
  detailed_targeting?: DetailedTargeting;
  custom_audiences?: CustomAudience[];
  excluded_custom_audiences?: CustomAudience[];
  device_platforms?: ('mobile' | 'desktop')[];
  publisher_platforms?: ('facebook' | 'instagram' | 'messenger' | 'audience_network')[];
  facebook_positions?: string[];
  instagram_positions?: string[];
}

export interface AdSetData {
  name: string;
  campaign_id: string;
  daily_budget?: number;
  lifetime_budget?: number;
  bid_amount?: number;
  billing_event?: 'IMPRESSIONS' | 'CLICKS' | 'APP_INSTALLS';
  optimization_goal?: 'REACH' | 'IMPRESSIONS' | 'CLICKS' | 'APP_INSTALLS' | 'CONVERSIONS';
  targeting?: Targeting;
  start_time?: string;
  end_time?: string;
  status?: 'ACTIVE' | 'PAUSED';
}

export interface CreativeData {
  object_story_spec?: {
    page_id: string;
    link_data?: {
      link: string;
      message: string;
      name?: string;
      description?: string;
      call_to_action?: {
        type: string;
        value?: { link: string };
      };
      image_hash?: string;
    };
    video_data?: {
      video_id: string;
      message: string;
      call_to_action?: {
        type: string;
        value?: { link: string };
      };
    };
  };
}

export interface AdData {
  name: string;
  adset_id: string;
  creative: CreativeData;
  status?: 'ACTIVE' | 'PAUSED';
}