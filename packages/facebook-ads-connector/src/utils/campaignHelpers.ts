import { CampaignObjective, CreateCampaignData, CampaignStatus } from '../types/campaigns';
import { AdSetData, Targeting } from '../types/targeting';
import { ValidationError } from './errors';

export class CampaignHelpers {

  /**
   * Create default targeting for Swedish market
   */
  static createSwedishTargeting(options?: {
    ageMin?: number;
    ageMax?: number;
    genders?: (1 | 2)[];
    interests?: string[];
  }): Targeting {
    return {
      geo_locations: {
        countries: ['SE'], // Sweden
        location_types: ['home', 'recent']
      },
      age_min: options?.ageMin || 18,
      age_max: options?.ageMax || 65,
      genders: options?.genders || [1, 2], // All genders
      device_platforms: ['mobile', 'desktop'],
      publisher_platforms: ['facebook', 'instagram']
    };
  }

  /**
   * Create campaign with sensible defaults
   */
  static createCampaignData(
    name: string,
    objective: CampaignObjective,
    budget: number,
    budgetType: 'daily' | 'lifetime' = 'daily'
  ): CreateCampaignData {
    const campaignData: CreateCampaignData = {
      name: name.trim(),
      objective,
      status: CampaignStatus.PAUSED, // Always start paused for safety
      buying_type: 'AUCTION',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP'
    };

    if (budgetType === 'daily') {
      campaignData.daily_budget = Math.round(budget * 100); // Convert to cents/öre
    } else {
      campaignData.lifetime_budget = Math.round(budget * 100);
    }

    return campaignData;
  }

  /**
   * Create ad set with defaults
   */
  static createAdSetData(
    name: string,
    campaignId: string,
    targeting: Targeting,
    budget?: number
  ): AdSetData {
    const adSetData: AdSetData = {
      name: name.trim(),
      campaign_id: campaignId,
      targeting,
      optimization_goal: 'REACH',
      billing_event: 'IMPRESSIONS',
      status: 'PAUSED'
    };

    if (budget) {
      adSetData.daily_budget = Math.round(budget * 100);
    }

    return adSetData;
  }

  /**
   * Validate campaign before creation
   */
  static validateCampaignData(campaignData: CreateCampaignData): void {
    if (!campaignData.name || campaignData.name.trim().length === 0) {
      throw new ValidationError('Campaign name is required');
    }

    if (!campaignData.objective) {
      throw new ValidationError('Campaign objective is required');
    }

    // Must have either daily or lifetime budget
    if (!campaignData.daily_budget && !campaignData.lifetime_budget) {
      throw new ValidationError('Either daily_budget or lifetime_budget is required');
    }

    // Cannot have both budgets
    if (campaignData.daily_budget && campaignData.lifetime_budget) {
      throw new ValidationError('Cannot set both daily_budget and lifetime_budget');
    }

    // Validate budget amounts (in cents/öre)
    const budget = campaignData.daily_budget || campaignData.lifetime_budget || 0;
    if (budget < 100) { // Minimum 1 SEK/USD
      throw new ValidationError('Budget must be at least 100 cents/öre (1 SEK/USD)');
    }
  }

  /**
   * Validate ad set data
   */
  static validateAdSetData(adSetData: AdSetData): void {
    if (!adSetData.name || adSetData.name.trim().length === 0) {
      throw new ValidationError('Ad set name is required');
    }

    if (!adSetData.campaign_id) {
      throw new ValidationError('Campaign ID is required for ad set');
    }

    if (!adSetData.targeting) {
      throw new ValidationError('Targeting is required for ad set');
    }

    // Validate targeting
    this.validateTargeting(adSetData.targeting);

    // Validate budget if provided
    if (adSetData.daily_budget && adSetData.daily_budget < 100) {
      throw new ValidationError('Ad set daily budget must be at least 100 cents/öre');
    }

    if (adSetData.lifetime_budget && adSetData.lifetime_budget < 100) {
      throw new ValidationError('Ad set lifetime budget must be at least 100 cents/öre');
    }
  }

  /**
   * Validate targeting configuration
   */
  static validateTargeting(targeting: Targeting): void {
    // Age validation
    if (targeting.age_min && (targeting.age_min < 13 || targeting.age_min > 65)) {
      throw new ValidationError('Minimum age must be between 13 and 65');
    }

    if (targeting.age_max && (targeting.age_max < 13 || targeting.age_max > 65)) {
      throw new ValidationError('Maximum age must be between 13 and 65');
    }

    if (targeting.age_min && targeting.age_max && targeting.age_min >= targeting.age_max) {
      throw new ValidationError('Maximum age must be greater than minimum age');
    }

    // Geographic validation
    if (targeting.geo_locations) {
      const geo = targeting.geo_locations;
      
      if (!geo.countries && !geo.regions && !geo.cities && !geo.zips) {
        throw new ValidationError('At least one geographic targeting option is required');
      }
    }

    // Gender validation
    if (targeting.genders && targeting.genders.length === 0) {
      throw new ValidationError('At least one gender must be selected');
    }
  }

  /**
   * Get recommended budget based on objective and audience size
   */
  static getRecommendedBudget(
    objective: CampaignObjective,
    estimatedAudience?: number
  ): { daily: number; lifetime: number } {
    const baseBudgets = {
      [CampaignObjective.AWARENESS]: { daily: 10, lifetime: 300 },
      [CampaignObjective.TRAFFIC]: { daily: 15, lifetime: 450 },
      [CampaignObjective.ENGAGEMENT]: { daily: 8, lifetime: 240 },
      [CampaignObjective.LEADS]: { daily: 25, lifetime: 750 },
      [CampaignObjective.APP_PROMOTION]: { daily: 30, lifetime: 900 },
      [CampaignObjective.SALES]: { daily: 50, lifetime: 1500 }
    };

    let budgets = baseBudgets[objective] || baseBudgets[CampaignObjective.TRAFFIC];

    // Adjust based on audience size
    if (estimatedAudience) {
      if (estimatedAudience < 10000) {
        budgets.daily *= 0.7;
        budgets.lifetime *= 0.7;
      } else if (estimatedAudience > 100000) {
        budgets.daily *= 1.5;
        budgets.lifetime *= 1.5;
      }
    }

    return {
      daily: Math.round(budgets.daily),
      lifetime: Math.round(budgets.lifetime)
    };
  }

  /**
   * Create complete campaign structure (campaign + adset)
   */
  static createCampaignStructure(config: {
    campaignName: string;
    objective: CampaignObjective;
    dailyBudget: number;
    targeting?: Targeting;
    adSetName?: string;
  }): {
    campaign: CreateCampaignData;
    adSet: Omit<AdSetData, 'campaign_id'>;
  } {
    const campaign = this.createCampaignData(
      config.campaignName,
      config.objective,
      config.dailyBudget,
      'daily'
    );

    const targeting = config.targeting || this.createSwedishTargeting();
    
    const adSet: Omit<AdSetData, 'campaign_id'> = {
      name: config.adSetName || `${config.campaignName} - Ad Set`,
      targeting,
      optimization_goal: this.getOptimizationGoal(config.objective),
      billing_event: 'IMPRESSIONS',
      status: 'PAUSED'
    };

    return { campaign, adSet };
  }

  /**
   * Get recommended optimization goal based on campaign objective
   */
  private static getOptimizationGoal(objective: CampaignObjective): 'IMPRESSIONS' | 'CLICKS' | 'APP_INSTALLS' | 'REACH' | 'CONVERSIONS' | 'LINK_CLICKS' | 'POST_ENGAGEMENT' | 'LEAD_GENERATION' {
    const goalMap = {
      [CampaignObjective.AWARENESS]: 'REACH',
      [CampaignObjective.TRAFFIC]: 'LINK_CLICKS',
      [CampaignObjective.ENGAGEMENT]: 'POST_ENGAGEMENT',
      [CampaignObjective.LEADS]: 'LEAD_GENERATION',
      [CampaignObjective.APP_PROMOTION]: 'APP_INSTALLS',
      [CampaignObjective.SALES]: 'CONVERSIONS'
    };

    return goalMap[objective] || 'REACH';
  }
}