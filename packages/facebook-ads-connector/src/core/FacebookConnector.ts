import { AuthManager } from '../auth/AuthManager';
import { TokenManager, TokenManagerConfig } from '../auth/TokenManager';
import { MemoryTokenStorage } from '../auth/TokenStorage';
import { AccountsAPI } from '../api/AccountsAPI';
import { CampaignsAPI } from '../api/CampaignsAPI';
import { AdSetsAPI } from '../api/AdSetsAPI';
import { AdsAPI } from '../api/AdsAPI';
import { FacebookConfig, DEFAULT_CONFIG, FACEBOOK_CREDENTIALS } from './config';
import { AdAccount } from '../types/accounts';
import { Campaign, CreateCampaignData, AdSet, Ad } from '../types/campaigns';
import { AdSetData, AdData, Targeting } from '../types/targeting';
import { FacebookUser } from '../types/auth';
import { Validators, createErrorFromResponse, CampaignHelpers, createErrorRecovery, ErrorRecovery, createUserLogger, LogLevel } from '../utils';

export class FacebookConnector {
  private config: FacebookConfig;
  private authManager: AuthManager;
  private tokenManager: TokenManager;
  private accountsAPI?: AccountsAPI;
  private campaignsAPI?: CampaignsAPI;
  private adSetsAPI?: AdSetsAPI;
  private adsAPI?: AdsAPI;
  private currentUserId?: string;
  private errorRecovery?: ErrorRecovery;
  private logger = createUserLogger('system', LogLevel.INFO);

  constructor(config?: Partial<FacebookConfig>) {
    // Use provided config or default credentials
    this.config = {
      appId: config?.appId || FACEBOOK_CREDENTIALS.appId,
      appSecret: config?.appSecret || FACEBOOK_CREDENTIALS.appSecret,
      redirectUri: config?.redirectUri || 'http://localhost:3000/auth/facebook/callback',
      version: config?.version || DEFAULT_CONFIG.version,
      sandbox: config?.sandbox || DEFAULT_CONFIG.sandbox
    };

    // Initialize auth manager
    this.authManager = new AuthManager({
      appId: this.config.appId,
      appSecret: this.config.appSecret,
      redirectUri: this.config.redirectUri
    });

    // Initialize token manager with memory storage (can be overridden)
    const tokenManagerConfig: TokenManagerConfig = {
      authManager: this.authManager,
      tokenStorage: new MemoryTokenStorage(),
      autoRefresh: true,
      refreshThresholdMinutes: 30
    };

    this.tokenManager = new TokenManager(tokenManagerConfig);

    // Initialize error recovery
    this.errorRecovery = createErrorRecovery(this.tokenManager, this.authManager);
  }

  /**
   * Set custom token storage
   */
  setTokenStorage(tokenStorage: any): void {
    const config: TokenManagerConfig = {
      authManager: this.authManager,
      tokenStorage,
      autoRefresh: true,
      refreshThresholdMinutes: 30
    };
    
    this.tokenManager = new TokenManager(config);
    
    // Reinitialize error recovery with new token manager
    this.errorRecovery = createErrorRecovery(this.tokenManager, this.authManager);
  }

  /**
   * Get Facebook OAuth URL for user authentication
   */
  getAuthUrl(state?: string): string {
    return this.authManager.getAuthUrl(state);
  }

  /**
   * Complete OAuth flow - exchange code for token
   */
  async authenticateWithCode(code: string, userId: string): Promise<FacebookUser> {
    return this.errorRecovery!.executeWithRetry(async () => {
      Validators.validateUserId(userId);
      this.logger.setUserId(userId);
      
      this.logger.info('Starting OAuth authentication', 'FacebookConnector', { userId });

      // Exchange code for access token
      const authResponse = await this.authManager.exchangeCodeForToken(code);
      
      // Store token
      await this.tokenManager.storeToken(userId, authResponse);
      
      // Get user info
      const userInfo = await this.authManager.getUserInfo(authResponse.access_token);
      
      // Set current user and initialize APIs
      this.currentUserId = userId;
      await this.initializeAPIs(userId);
      
      this.logger.info('Authentication successful', 'FacebookConnector', { 
        userId,
        userName: userInfo.name 
      });
      
      return userInfo;
    }, userId, 'OAuth Authentication');
  }

  /**
   * Authenticate with existing token
   */
  async authenticateWithToken(accessToken: string, userId: string): Promise<FacebookUser> {
    try {
      Validators.validateAccessToken(accessToken);
      Validators.validateUserId(userId);

      // Validate token
      const tokenInfo = await this.authManager.validateToken(accessToken);
      
      if (!tokenInfo.is_valid) {
        throw new Error('Invalid access token');
      }

      // Store token (this will convert to long-lived if needed)
      await this.tokenManager.storeToken(userId, {
        access_token: accessToken,
        token_type: 'bearer'
      });

      // Get user info
      const userInfo = await this.authManager.getUserInfo(accessToken);
      
      // Set current user and initialize APIs
      this.currentUserId = userId;
      await this.initializeAPIs(userId);
      
      return userInfo;
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Initialize API clients with valid token
   */
  private async initializeAPIs(userId: string): Promise<void> {
    const token = await this.tokenManager.getValidToken(userId);
    
    if (!token) {
      throw new Error('No valid token available for API initialization');
    }

    this.accountsAPI = new AccountsAPI(token, this.config.version);
    this.campaignsAPI = new CampaignsAPI(token, this.config.version);
    this.adSetsAPI = new AdSetsAPI(token, this.config.version);
    this.adsAPI = new AdsAPI(token, this.config.version);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(userId: string): Promise<boolean> {
    try {
      Validators.validateUserId(userId);
      return await this.tokenManager.hasValidToken(userId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user's ad accounts with enhanced filtering
   */
  async getAdAccounts(
    userId?: string, 
    options?: {
      includeInactive?: boolean;
      capabilities?: string[];
      minSpendCap?: number;
    }
  ): Promise<AdAccount[]> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);

      if (!this.accountsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      let accounts = await this.accountsAPI!.getAdAccounts();
      
      // Apply filters
      if (!options?.includeInactive) {
        accounts = accounts.filter(account => account.account_status === 1);
      }

      if (options?.capabilities) {
        accounts = accounts.filter(account => 
          options.capabilities!.every(cap => account.capabilities.includes(cap))
        );
      }

      return accounts;
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get specific ad account with detailed info
   */
  async getAdAccount(
    accountId: string, 
    userId?: string,
    includeInsights?: boolean
  ): Promise<AdAccount | null> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      if (!this.accountsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      const account = await this.accountsAPI!.getAdAccount(cleanAccountId);

      if (!account) {
        return null;
      }

      // Add insights if requested
      if (includeInsights) {
        try {
          const insights = await this.accountsAPI!.getAccountInsights(cleanAccountId, {
            time_range: {
              since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
              until: new Date().toISOString().split('T')[0] // today
            }
          });
          (account as any).insights = insights;
        } catch (insightError) {
          console.warn('Failed to fetch account insights:', insightError);
        }
      }

      return account;
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Check account permissions and capabilities
   */
  async checkAccountAccess(accountId: string, userId?: string): Promise<{
    hasAccess: boolean;
    capabilities: string[];
    permissions: string[];
  }> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      if (!this.accountsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      const account = await this.accountsAPI!.getAdAccount(cleanAccountId);
      
      if (!account) {
        return {
          hasAccess: false,
          capabilities: [],
          permissions: []
        };
      }

      const capabilities = await this.accountsAPI!.checkAccountPermissions(cleanAccountId);

      return {
        hasAccess: true,
        capabilities: account.capabilities,
        permissions: capabilities
      };
    } catch (error) {
      return {
        hasAccess: false,
        capabilities: [],
        permissions: []
      };
    }
  }

  /**
   * Get campaigns for an account
   */
  async getCampaigns(accountId: string, userId?: string): Promise<Campaign[]> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      if (!this.campaignsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.campaignsAPI!.getCampaigns(cleanAccountId);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Create new campaign with validation and helpers
   */
  async createCampaign(
    accountId: string, 
    campaignData: CreateCampaignData, 
    userId?: string
  ): Promise<{ id: string } | null> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);
      
      // Validate campaign data using helper
      CampaignHelpers.validateCampaignData(campaignData);

      if (!this.campaignsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.campaignsAPI!.createCampaign(cleanAccountId, campaignData);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Create complete campaign structure (campaign + ad set)
   */
  async createCampaignWithAdSet(
    accountId: string,
    config: {
      campaignName: string;
      objective: any; // CampaignObjective
      dailyBudget: number;
      targeting?: Targeting;
      adSetName?: string;
    },
    userId?: string
  ): Promise<{
    campaign: { id: string };
    adSet: { id: string };
  }> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      if (!this.campaignsAPI || !this.adSetsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      // Create campaign and ad set structure using helper
      const { campaign: campaignData, adSet: adSetData } = CampaignHelpers.createCampaignStructure(config);

      // Create campaign
      const campaign = await this.campaignsAPI!.createCampaign(cleanAccountId, campaignData);
      
      if (!campaign?.id) {
        throw new Error('Failed to create campaign');
      }

      // Create ad set
      const adSetWithCampaign: AdSetData = {
        ...adSetData,
        campaign_id: campaign.id
      };

      const adSet = await this.adSetsAPI!.createAdSet(cleanAccountId, adSetWithCampaign);
      
      if (!adSet?.id) {
        // If ad set creation fails, we should consider cleaning up the campaign
        throw new Error('Failed to create ad set');
      }

      return {
        campaign,
        adSet
      };
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get ad sets for a campaign
   */
  async getAdSets(
    campaignId: string,
    userId?: string
  ): Promise<AdSet[]> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);

      if (!this.campaignsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.campaignsAPI!.getCampaignAdSets(campaignId);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Create ad set
   */
  async createAdSet(
    accountId: string,
    adSetData: AdSetData,
    userId?: string
  ): Promise<{ id: string } | null> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      // Validate ad set data
      CampaignHelpers.validateAdSetData(adSetData);

      if (!this.adSetsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.adSetsAPI!.createAdSet(cleanAccountId, adSetData);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get ads for a campaign or ad set
   */
  async getAds(
    campaignId: string,
    userId?: string
  ): Promise<Ad[]> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);

      if (!this.campaignsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.campaignsAPI!.getCampaignAds(campaignId);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Create ad
   */
  async createAd(
    accountId: string,
    adData: AdData,
    userId?: string
  ): Promise<{ id: string } | null> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);
      const cleanAccountId = Validators.validateAccountId(accountId);

      if (!this.adsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.adsAPI!.createAd(cleanAccountId, adData);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get campaign insights
   */
  async getCampaignInsights(
    campaignId: string, 
    options?: {
      timeRange?: { since: string; until: string };
      fields?: string[];
    },
    userId?: string
  ): Promise<any> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      Validators.validateUserId(targetUserId);

      if (options?.timeRange) {
        Validators.validateDateRange(options.timeRange.since, options.timeRange.until);
      }

      if (!this.campaignsAPI) {
        await this.initializeAPIs(targetUserId);
      }

      return this.campaignsAPI!.getCampaignInsights(campaignId, options);
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get budget recommendations
   */
  getBudgetRecommendations(
    objective: any, // CampaignObjective
    estimatedAudience?: number
  ): { daily: number; lifetime: number } {
    return CampaignHelpers.getRecommendedBudget(objective, estimatedAudience);
  }

  /**
   * Create Swedish market targeting
   */
  createSwedishTargeting(options?: {
    ageMin?: number;
    ageMax?: number;
    genders?: (1 | 2)[];
    interests?: string[];
  }): Targeting {
    return CampaignHelpers.createSwedishTargeting(options);
  }

  /**
   * Logout user
   */
  async logout(userId?: string): Promise<void> {
    try {
      const targetUserId = userId || this.currentUserId;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      await this.tokenManager.removeToken(targetUserId);
      
      // Clear APIs
      this.accountsAPI = undefined;
      this.campaignsAPI = undefined;
      this.adSetsAPI = undefined;
      this.adsAPI = undefined;
      
      if (targetUserId === this.currentUserId) {
        this.currentUserId = undefined;
      }
    } catch (error) {
      throw createErrorFromResponse(error);
    }
  }

  /**
   * Get token info (for debugging)
   */
  async getTokenInfo(userId?: string): Promise<any> {
    const targetUserId = userId || this.currentUserId;
    
    if (!targetUserId) {
      throw new Error('No user ID provided');
    }

    return await this.tokenManager.getTokenInfo(targetUserId);
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.tokenManager.destroy();
  }
}