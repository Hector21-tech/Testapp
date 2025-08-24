import React from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { TextInput } from '../../../components/fields/TextInput';
import { ChipTags } from '../../../components/fields/ChipTags';
import { RangeSlider } from '../../../components/fields/RangeSlider';
import { CalendarDaysIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline';

export function BudgetStep() {
  const { draft, updateBudget } = useCampaignWizard();
  
  if (!draft) return null;

  const { budget } = draft;

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    updateBudget({ [field]: value });
  };

  const handleTargetingChange = (field: string, value: any) => {
    updateBudget({
      targeting: {
        ...budget.targeting,
        [field]: value
      }
    });
  };

  const interestOptions = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Mat & Dryck' },
    { value: 'travel', label: 'Resor' },
    { value: 'tech', label: 'Teknik' },
    { value: 'fashion', label: 'Mode' },
    { value: 'home', label: 'Hem & Trädgård' },
    { value: 'cars', label: 'Bilar' },
    { value: 'sports', label: 'Sport' },
    { value: 'music', label: 'Musik' },
    { value: 'books', label: 'Böcker' }
  ];

  const calculateEstimatedReach = () => {
    const baseBudget = budget.dailyBudget;
    const ageRange = budget.targeting.ageMax - budget.targeting.ageMin;
    const interests = budget.targeting.interests.length;
    
    // Mock calculation for estimated reach
    const baseReach = Math.floor(baseBudget * 2.5);
    const ageMultiplier = Math.max(0.5, 1 - (ageRange / 100));
    const interestMultiplier = Math.max(0.7, 1 - (interests * 0.1));
    
    return Math.floor(baseReach * ageMultiplier * interestMultiplier);
  };

  const estimatedReach = calculateEstimatedReach();
  const campaignDays = Math.ceil(
    (new Date(budget.endDate).getTime() - new Date(budget.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalBudget = budget.dailyBudget * Math.max(1, campaignDays);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-neutral-600">
          Sätt din budget och definiera målgruppen för din kampanj.
        </p>
      </div>

      {/* Budget Section */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
          Budget
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <TextInput
            label="Daglig budget (kr)"
            type="number"
            value={budget.dailyBudget.toString()}
            onChange={(value) => updateBudget({ dailyBudget: parseInt(value) || 0 })}
            min={50}
            max={5000}
            placeholder="200"
            helperText="Minimum 50 kr per dag"
            required
          />

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-900 mb-2">Budgetöversikt</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Per dag:</span>
                <span className="font-medium">{budget.dailyBudget} kr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Kampanjlängd:</span>
                <span className="font-medium">{campaignDays} dagar</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <span className="font-medium">Total budget:</span>
                <span className="font-semibold text-brand">{totalBudget.toLocaleString()} kr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Section */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
          <CalendarDaysIcon className="w-5 h-5 mr-2" />
          Kampanjperiod
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <TextInput
            label="Startdatum"
            type="date"
            value={budget.startDate}
            onChange={(value) => handleDateChange('startDate', value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          <TextInput
            label="Slutdatum"
            type="date"
            value={budget.endDate}
            onChange={(value) => handleDateChange('endDate', value)}
            min={budget.startDate}
            required
          />
        </div>
      </div>

      {/* Targeting Section */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
          <UsersIcon className="w-5 h-5 mr-2" />
          Målgrupp
        </h3>
        
        <div className="space-y-6">
          {/* Age Range */}
          <div>
            <RangeSlider
              label="Åldersintervall"
              min={18}
              max={80}
              value={[budget.targeting.ageMin, budget.targeting.ageMax]}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  const [min, max] = value;
                  handleTargetingChange('ageMin', min);
                  handleTargetingChange('ageMax', max);
                }
              }}
              formatValue={(value) => `${value} år`}
              helperText="Välj åldersintervall för din målgrupp"
            />
          </div>

          {/* Interests */}
          <div>
            <ChipTags
              label="Intressen (valfritt)"
              options={interestOptions}
              selectedIds={budget.targeting.interests}
              onChange={(interests) => handleTargetingChange('interests', interests)}
              helperText="Välj intressen som passar din målgrupp"
              maxSelections={5}
            />
          </div>
        </div>
      </div>

      {/* Estimated Reach */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-semibold text-brand-800 mb-4">Uppskattad räckvidd</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-brand">{estimatedReach.toLocaleString()}</div>
            <div className="text-sm text-neutral-600">personer per dag</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-brand">{Math.floor(estimatedReach * 0.05).toLocaleString()}</div>
            <div className="text-sm text-neutral-600">uppskattade klick</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-brand">{Math.floor(estimatedReach * 0.02).toLocaleString()}</div>
            <div className="text-sm text-neutral-600">potentiella leads</div>
          </div>
        </div>
        <p className="text-xs text-brand-600 mt-4 text-center">
          Siffrorna är uppskattningar baserade på historisk data och kan variera.
        </p>
      </div>
    </div>
  );
}