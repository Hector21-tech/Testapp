import { 
  FacebookConnector, 
  Validators, 
  CampaignHelpers, 
  CampaignObjective,
  RateLimiter,
  FacebookConnectorLogger,
  LogLevel
} from '../src';

describe('FacebookConnector', () => {
  let connector: FacebookConnector;

  beforeEach(() => {
    connector = new FacebookConnector({
      redirectUri: 'http://localhost:3000/test'
    });
  });

  afterEach(() => {
    connector.destroy();
  });

  describe('Configuration', () => {
    it('should use default configuration when no config provided', () => {
      const defaultConnector = new FacebookConnector();
      expect(defaultConnector).toBeDefined();
    });

    it('should generate OAuth URL', () => {
      const authUrl = connector.getAuthUrl('test_state');
      expect(authUrl).toContain('facebook.com');
      expect(authUrl).toContain('client_id=1265970594722150');
      expect(authUrl).toContain('state=test_state');
      expect(authUrl).toContain('redirect_uri=');
    });
  });

  describe('Targeting Helpers', () => {
    it('should create Swedish targeting', () => {
      const targeting = connector.createSwedishTargeting();
      expect(targeting.geo_locations?.countries).toEqual(['SE']);
      expect(targeting.age_min).toBe(18);
      expect(targeting.age_max).toBe(65);
    });

    it('should create Swedish targeting with custom options', () => {
      const targeting = connector.createSwedishTargeting({
        ageMin: 25,
        ageMax: 45,
        genders: [1]
      });
      expect(targeting.age_min).toBe(25);
      expect(targeting.age_max).toBe(45);
      expect(targeting.genders).toEqual([1]);
    });
  });

  describe('Budget Recommendations', () => {
    it('should generate budget recommendations for different objectives', () => {
      const trafficBudget = connector.getBudgetRecommendations(CampaignObjective.TRAFFIC);
      const salesBudget = connector.getBudgetRecommendations(CampaignObjective.SALES);
      
      expect(trafficBudget.daily).toBeGreaterThan(0);
      expect(trafficBudget.lifetime).toBeGreaterThan(0);
      expect(salesBudget.daily).toBeGreaterThan(trafficBudget.daily);
    });

    it('should adjust budget based on audience size', () => {
      const smallAudience = connector.getBudgetRecommendations(CampaignObjective.TRAFFIC, 5000);
      const largeAudience = connector.getBudgetRecommendations(CampaignObjective.TRAFFIC, 200000);
      
      expect(largeAudience.daily).toBeGreaterThan(smallAudience.daily);
    });
  });
});

describe('Validators', () => {
  describe('validateAccountId', () => {
    it('should validate and clean account IDs', () => {
      expect(Validators.validateAccountId('123456789')).toBe('123456789');
      expect(Validators.validateAccountId('act_123456789')).toBe('123456789');
    });

    it('should throw error for invalid account IDs', () => {
      expect(() => Validators.validateAccountId('')).toThrow('Account ID is required');
      expect(() => Validators.validateAccountId('invalid')).toThrow('Invalid account ID format');
    });
  });

  describe('validateCampaignName', () => {
    it('should validate campaign names', () => {
      expect(Validators.validateCampaignName('Test Campaign')).toBe('Test Campaign');
      expect(Validators.validateCampaignName('  Spaced  ')).toBe('Spaced');
    });

    it('should throw error for invalid campaign names', () => {
      expect(() => Validators.validateCampaignName('')).toThrow('Campaign name is required');
      expect(() => Validators.validateCampaignName('a'.repeat(201))).toThrow('must be between 1 and 200 characters');
    });
  });

  describe('validateBudget', () => {
    it('should validate budgets', () => {
      expect(Validators.validateBudget(150, 'daily')).toBe(150);
      expect(Validators.validateBudget(100.5, 'lifetime')).toBe(101);
    });

    it('should throw error for invalid budgets', () => {
      expect(() => Validators.validateBudget(0, 'daily')).toThrow('must be a positive number');
      expect(() => Validators.validateBudget(50, 'daily')).toThrow('must be at least 100 cents');
    });
  });

  describe('validateDateRange', () => {
    it('should validate date ranges', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayAfter = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      expect(() => Validators.validateDateRange(tomorrow, dayAfter)).not.toThrow();
    });

    it('should throw error for invalid date ranges', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      expect(() => Validators.validateDateRange(today, yesterday)).toThrow('End date must be after start date');
    });
  });
});

describe('CampaignHelpers', () => {
  describe('validateCampaignData', () => {
    it('should validate valid campaign data', () => {
      const validData = {
        name: 'Test Campaign',
        objective: CampaignObjective.TRAFFIC,
        daily_budget: 1500, // 15 SEK in cents
        status: 'PAUSED' as const
      };

      expect(() => CampaignHelpers.validateCampaignData(validData)).not.toThrow();
    });

    it('should throw error for invalid campaign data', () => {
      expect(() => CampaignHelpers.validateCampaignData({
        name: '',
        objective: CampaignObjective.TRAFFIC
      })).toThrow('Campaign name is required');

      expect(() => CampaignHelpers.validateCampaignData({
        name: 'Test',
        objective: CampaignObjective.TRAFFIC,
        daily_budget: 50 // Too low
      })).toThrow('must be at least 100 cents');
    });
  });

  describe('createCampaignStructure', () => {
    it('should create complete campaign structure', () => {
      const structure = CampaignHelpers.createCampaignStructure({
        campaignName: 'Test Campaign',
        objective: CampaignObjective.TRAFFIC,
        dailyBudget: 20
      });

      expect(structure.campaign.name).toBe('Test Campaign');
      expect(structure.campaign.objective).toBe(CampaignObjective.TRAFFIC);
      expect(structure.campaign.daily_budget).toBe(2000); // 20 SEK in cents
      expect(structure.adSet.name).toBe('Test Campaign - Ad Set');
      expect(structure.adSet.targeting).toBeDefined();
    });
  });

  describe('validateTargeting', () => {
    it('should validate valid targeting', () => {
      const validTargeting = {
        geo_locations: { countries: ['SE'] },
        age_min: 18,
        age_max: 65,
        genders: [1, 2] as (1 | 2)[]
      };

      expect(() => CampaignHelpers.validateTargeting(validTargeting)).not.toThrow();
    });

    it('should throw error for invalid targeting', () => {
      expect(() => CampaignHelpers.validateTargeting({
        age_min: 70
      })).toThrow('Maximum age must be greater than minimum age');

      expect(() => CampaignHelpers.validateTargeting({
        genders: []
      })).toThrow('At least one gender must be selected');
    });
  });
});

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequestsPerHour: 10,
      maxRequestsPerMinute: 5,
      maxConcurrentRequests: 2
    });
  });

  afterEach(() => {
    rateLimiter.reset();
  });

  it('should allow requests within limits', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success');
    
    const result = await rateLimiter.execute(mockOperation);
    
    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should queue requests when at concurrent limit', async () => {
    const slowOperation = () => new Promise(resolve => setTimeout(() => resolve('done'), 100));
    
    const promises = [
      rateLimiter.execute(slowOperation),
      rateLimiter.execute(slowOperation),
      rateLimiter.execute(slowOperation) // This should be queued
    ];

    const results = await Promise.all(promises);
    
    expect(results).toEqual(['done', 'done', 'done']);
  });

  it('should provide accurate status', () => {
    const status = rateLimiter.getStatus();
    
    expect(status).toHaveProperty('activeRequests');
    expect(status).toHaveProperty('queueLength');
    expect(status).toHaveProperty('requestsInLastHour');
    expect(status).toHaveProperty('requestsInLastMinute');
  });
});

describe('FacebookConnectorLogger', () => {
  let logger: FacebookConnectorLogger;

  beforeEach(() => {
    logger = new FacebookConnectorLogger(LogLevel.DEBUG, 100);
  });

  afterEach(() => {
    logger.clearLogs();
  });

  it('should log messages at different levels', () => {
    logger.error('Error message', 'TestContext');
    logger.warn('Warning message', 'TestContext');
    logger.info('Info message', 'TestContext');
    logger.debug('Debug message', 'TestContext');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(4);
    expect(logs[0].level).toBe(LogLevel.ERROR);
    expect(logs[1].level).toBe(LogLevel.WARN);
    expect(logs[2].level).toBe(LogLevel.INFO);
    expect(logs[3].level).toBe(LogLevel.DEBUG);
  });

  it('should filter logs by level', () => {
    logger.error('Error message');
    logger.warn('Warning message');
    logger.info('Info message');

    const errorLogs = logger.getLogs(LogLevel.ERROR);
    expect(errorLogs).toHaveLength(1);
    expect(errorLogs[0].level).toBe(LogLevel.ERROR);
  });

  it('should filter logs by context', () => {
    logger.info('Message 1', 'Context1');
    logger.info('Message 2', 'Context2');
    logger.info('Message 3', 'Context1');

    const context1Logs = logger.getLogsForContext('Context1');
    expect(context1Logs).toHaveLength(2);
  });

  it('should limit number of logs', () => {
    const smallLogger = new FacebookConnectorLogger(LogLevel.DEBUG, 3);
    
    for (let i = 0; i < 5; i++) {
      smallLogger.info(`Message ${i}`);
    }

    const logs = smallLogger.getLogs();
    expect(logs).toHaveLength(3);
    expect(logs[0].message).toBe('Message 2'); // Oldest messages removed
  });

  it('should export logs as JSON', () => {
    logger.info('Test message', 'TestContext', { key: 'value' });
    
    const exported = logger.exportLogs();
    const parsed = JSON.parse(exported);
    
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty('message', 'Test message');
    expect(parsed[0]).toHaveProperty('context', 'TestContext');
    expect(parsed[0]).toHaveProperty('data');
  });
});