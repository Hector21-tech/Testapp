import { ValidationError } from './errors';

export class Validators {
  
  /**
   * Validate Facebook account ID format
   */
  static validateAccountId(accountId: string): string {
    if (!accountId) {
      throw new ValidationError('Account ID is required');
    }

    // Remove 'act_' prefix if present
    const cleanId = accountId.replace(/^act_/, '');
    
    // Facebook account IDs are numeric strings
    if (!/^\d+$/.test(cleanId)) {
      throw new ValidationError('Invalid account ID format. Must be numeric.');
    }

    return cleanId;
  }

  /**
   * Validate campaign name
   */
  static validateCampaignName(name: string): string {
    if (!name || typeof name !== 'string') {
      throw new ValidationError('Campaign name is required and must be a string');
    }

    if (name.length < 1 || name.length > 200) {
      throw new ValidationError('Campaign name must be between 1 and 200 characters');
    }

    // Remove leading/trailing whitespace
    return name.trim();
  }

  /**
   * Validate budget amount
   */
  static validateBudget(budget: number, type: 'daily' | 'lifetime'): number {
    if (typeof budget !== 'number' || budget <= 0) {
      throw new ValidationError(`${type} budget must be a positive number`);
    }

    // Facebook minimum budgets (in cents/öre for USD/SEK)
    const minimums = {
      daily: 100, // $1.00 or 10 SEK
      lifetime: 100
    };

    if (budget < minimums[type]) {
      throw new ValidationError(
        `${type} budget must be at least ${minimums[type]} cents/öre`
      );
    }

    return Math.round(budget); // Ensure whole number
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDate(date: string, fieldName: string): string {
    if (!date) {
      throw new ValidationError(`${fieldName} is required`);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new ValidationError(`${fieldName} must be in YYYY-MM-DD format`);
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ValidationError(`${fieldName} is not a valid date`);
    }

    return date;
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate: string, endDate: string): void {
    const start = new Date(this.validateDate(startDate, 'Start date'));
    const end = new Date(this.validateDate(endDate, 'End date'));

    if (start >= end) {
      throw new ValidationError('End date must be after start date');
    }

    // Check if dates are not too far in the past or future
    const now = new Date();
    const maxPast = new Date();
    maxPast.setFullYear(now.getFullYear() - 2); // 2 years ago

    const maxFuture = new Date();
    maxFuture.setFullYear(now.getFullYear() + 1); // 1 year ahead

    if (start < maxPast) {
      throw new ValidationError('Start date cannot be more than 2 years in the past');
    }

    if (end > maxFuture) {
      throw new ValidationError('End date cannot be more than 1 year in the future');
    }
  }

  /**
   * Validate array of fields
   */
  static validateFields(fields: string[], allowedFields: string[]): string[] {
    if (!Array.isArray(fields)) {
      throw new ValidationError('Fields must be an array');
    }

    const invalidFields = fields.filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      throw new ValidationError(
        `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`
      );
    }

    return fields;
  }

  /**
   * Validate pagination limit
   */
  static validateLimit(limit: number): number {
    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be a number between 1 and 100');
    }

    return Math.floor(limit);
  }

  /**
   * Validate user ID
   */
  static validateUserId(userId: string): string {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('User ID is required and must be a string');
    }

    if (userId.length < 1 || userId.length > 100) {
      throw new ValidationError('User ID must be between 1 and 100 characters');
    }

    return userId.trim();
  }

  /**
   * Validate access token format
   */
  static validateAccessToken(token: string): string {
    if (!token || typeof token !== 'string') {
      throw new ValidationError('Access token is required and must be a string');
    }

    // Facebook access tokens are typically quite long
    if (token.length < 50) {
      throw new ValidationError('Access token appears to be invalid (too short)');
    }

    return token.trim();
  }
}