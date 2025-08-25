import React, { useState, useCallback, useEffect } from 'react';
import { FacebookConnector } from '../core/FacebookConnector';
import { CampaignObjective } from '../types/campaigns';
import { Targeting } from '../types/targeting';

export interface FacebookCampaignCreatorProps {
  connector: FacebookConnector;
  userId: string;
  accountId: string;
  onSuccess?: (result: { campaign: { id: string }; adSet: { id: string } }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface CampaignForm {
  name: string;
  objective: CampaignObjective;
  dailyBudget: number;
  ageMin: number;
  ageMax: number;
  genders: (1 | 2)[];
  adSetName: string;
}

export const FacebookCampaignCreator: React.FC<FacebookCampaignCreatorProps> = ({
  connector,
  userId,
  accountId,
  onSuccess,
  onError,
  className = ''
}) => {
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    objective: CampaignObjective.TRAFFIC,
    dailyBudget: 50,
    ageMin: 18,
    ageMax: 65,
    genders: [1, 2],
    adSetName: ''
  });

  const [recommendations, setRecommendations] = useState<{ daily: number; lifetime: number }>({ daily: 50, lifetime: 1500 });
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update budget recommendations when objective changes
  useEffect(() => {
    const recs = connector.getBudgetRecommendations(form.objective);
    setRecommendations(recs);
    
    // Update form budget if it's still the old recommendation
    if (form.dailyBudget === recommendations.daily) {
      setForm(prev => ({ ...prev, dailyBudget: recs.daily }));
    }
  }, [form.objective, connector, recommendations.daily, form.dailyBudget]);

  // Auto-generate ad set name
  useEffect(() => {
    if (form.name && !form.adSetName) {
      setForm(prev => ({ ...prev, adSetName: `${form.name} - Ad Set` }));
    }
  }, [form.name, form.adSetName]);

  const handleInputChange = (field: keyof CampaignForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenderChange = (gender: 1 | 2, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      genders: checked 
        ? [...prev.genders, gender]
        : prev.genders.filter(g => g !== gender)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (form.dailyBudget < 1) {
      newErrors.dailyBudget = 'Daily budget must be at least 1 SEK/USD';
    }

    if (form.ageMin < 13 || form.ageMin > 65) {
      newErrors.ageMin = 'Minimum age must be between 13 and 65';
    }

    if (form.ageMax < 13 || form.ageMax > 65) {
      newErrors.ageMax = 'Maximum age must be between 13 and 65';
    }

    if (form.ageMin >= form.ageMax) {
      newErrors.ageMax = 'Maximum age must be greater than minimum age';
    }

    if (form.genders.length === 0) {
      newErrors.genders = 'At least one gender must be selected';
    }

    if (!form.adSetName.trim()) {
      newErrors.adSetName = 'Ad set name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setCreating(true);

    try {
      // Create targeting
      const targeting: Targeting = connector.createSwedishTargeting({
        ageMin: form.ageMin,
        ageMax: form.ageMax,
        genders: form.genders
      });

      // Create campaign with ad set
      const result = await connector.createCampaignWithAdSet(accountId, {
        campaignName: form.name.trim(),
        objective: form.objective,
        dailyBudget: form.dailyBudget,
        targeting,
        adSetName: form.adSetName.trim()
      }, userId);

      onSuccess?.(result);

      // Reset form
      setForm({
        name: '',
        objective: CampaignObjective.TRAFFIC,
        dailyBudget: recommendations.daily,
        ageMin: 18,
        ageMax: 65,
        genders: [1, 2],
        adSetName: ''
      });

    } catch (error) {
      onError?.(error as Error);
    } finally {
      setCreating(false);
    }
  }, [form, accountId, userId, connector, onSuccess, onError, recommendations.daily]);

  const objectiveOptions = [
    { value: CampaignObjective.TRAFFIC, label: 'Traffic', description: 'Drive traffic to your website' },
    { value: CampaignObjective.AWARENESS, label: 'Awareness', description: 'Increase brand awareness' },
    { value: CampaignObjective.ENGAGEMENT, label: 'Engagement', description: 'Get more likes, comments, shares' },
    { value: CampaignObjective.LEADS, label: 'Leads', description: 'Collect leads for your business' },
    { value: CampaignObjective.SALES, label: 'Sales', description: 'Drive sales and conversions' },
  ];

  const inputClassName = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const errorClassName = "mt-1 text-sm text-red-600";

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name
          </label>
          <input
            id="campaign-name"
            type="text"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter campaign name"
            className={inputClassName}
          />
          {errors.name && <p className={errorClassName}>{errors.name}</p>}
        </div>

        {/* Objective */}
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Objective
          </label>
          <select
            id="objective"
            value={form.objective}
            onChange={(e) => handleInputChange('objective', e.target.value as CampaignObjective)}
            className={inputClassName}
          >
            {objectiveOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Budget */}
        <div>
          <label htmlFor="daily-budget" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Budget (SEK/USD)
          </label>
          <div className="relative">
            <input
              id="daily-budget"
              type="number"
              min="1"
              value={form.dailyBudget}
              onChange={(e) => handleInputChange('dailyBudget', parseInt(e.target.value) || 0)}
              className={inputClassName}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">per day</span>
            </div>
          </div>
          {errors.dailyBudget && <p className={errorClassName}>{errors.dailyBudget}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Recommended: {recommendations.daily} SEK/USD per day
          </p>
        </div>

        {/* Age Targeting */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age-min" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Age
            </label>
            <input
              id="age-min"
              type="number"
              min="13"
              max="65"
              value={form.ageMin}
              onChange={(e) => handleInputChange('ageMin', parseInt(e.target.value) || 18)}
              className={inputClassName}
            />
            {errors.ageMin && <p className={errorClassName}>{errors.ageMin}</p>}
          </div>
          
          <div>
            <label htmlFor="age-max" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Age
            </label>
            <input
              id="age-max"
              type="number"
              min="13"
              max="65"
              value={form.ageMax}
              onChange={(e) => handleInputChange('ageMax', parseInt(e.target.value) || 65)}
              className={inputClassName}
            />
            {errors.ageMax && <p className={errorClassName}>{errors.ageMax}</p>}
          </div>
        </div>

        {/* Gender Targeting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender Targeting
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.genders.includes(1)}
                onChange={(e) => handleGenderChange(1, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Male</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.genders.includes(2)}
                onChange={(e) => handleGenderChange(2, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Female</span>
            </label>
          </div>
          {errors.genders && <p className={errorClassName}>{errors.genders}</p>}
        </div>

        {/* Ad Set Name */}
        <div>
          <label htmlFor="adset-name" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Set Name
          </label>
          <input
            id="adset-name"
            type="text"
            value={form.adSetName}
            onChange={(e) => handleInputChange('adSetName', e.target.value)}
            placeholder="Enter ad set name"
            className={inputClassName}
          />
          {errors.adSetName && <p className={errorClassName}>{errors.adSetName}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={creating}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Campaign...
              </div>
            ) : (
              'Create Campaign'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};