// Campaign Wizard Types
export interface CompanyProfile {
  companyName: string;
  orgNumber?: string;
  industry: string;
  location: string;
  radius: number;
  website?: string;
  goals: string[];
  ageRangeMin: number;
  ageRangeMax: number;
  interests: string[];
  description?: string;
}

export interface ConnectedChannels {
  facebook: {
    connected: boolean;
    accountId?: string;
    accountName?: string;
  };
  google: {
    connected: boolean;
    accountId?: string;
    accountName?: string;
  };
  instagram: {
    connected: boolean;
    accountId?: string;
    accountName?: string;
  };
}

export interface AdContent {
  headline: string;
  description: string;
  callToAction: string;
  generatedSuggestions?: {
    headlines: string[];
    descriptions: string[];
    ctas: string[];
  };
}

export interface AdImage {
  id: string;
  url: string;
  altText: string;
  attribution?: string;
  isCustom: boolean;
  preview?: string;
}

export interface BudgetAndTargeting {
  dailyBudget: number;
  startDate: string;
  endDate: string;
  targeting: {
    locations: string[];
    interests: string[];
    ageMin: number;
    ageMax: number;
  };
}

export interface CampaignDraft {
  id?: string;
  profile: CompanyProfile;
  channels: ConnectedChannels;
  content: AdContent;
  image?: AdImage | null;
  budget: BudgetAndTargeting;
  currentStep: number;
  profileSubStep: number;
  isProfileComplete: boolean;
  lastSaved: string;
  version: number;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current: boolean;
  disabled?: boolean;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Industry Options
export const INDUSTRIES = [
  { value: 'carpenter', label: '🔨 Snickare', icon: '🔨' },
  { value: 'electrician', label: '⚡ Elektriker', icon: '⚡' },
  { value: 'plumber', label: '🔧 Rörmokare', icon: '🔧' },
  { value: 'painter', label: '🎨 Målare', icon: '🎨' },
  { value: 'renovation', label: '🏗️ Byggnads & Renovering', icon: '🏗️' },
  { value: 'landscaping', label: '🌱 Mark & Trädgård', icon: '🌱' },
  { value: 'roofing', label: '🏠 Takläggning', icon: '🏠' },
  { value: 'heating', label: '🔥 VVS & Värme', icon: '🔥' },
  { value: 'flooring', label: '🪵 Golv & Kakel', icon: '🪵' },
  { value: 'cleaning', label: '🧽 Städning', icon: '🧽' },
  { value: 'other', label: '📋 Annat', icon: '📋' }
] as const;

// Goal Options
export const BUSINESS_GOALS = [
  { 
    value: 'leads', 
    label: 'Fler kundförfrågningar',
    description: 'Få kontakter som vill ha offerter',
    icon: '📧'
  },
  { 
    value: 'calls', 
    label: 'Fler telefonsamtal',
    description: 'Direktkontakt från intresserade kunder',
    icon: '📞'
  },
  { 
    value: 'website', 
    label: 'Fler hemsidebesök',
    description: 'Öka trafiken till din webbplats',
    icon: '🌐'
  },
  { 
    value: 'awareness', 
    label: 'Ökad kännedom',
    description: 'Bli mer känd i ditt område',
    icon: '👥'
  }
] as const;

// Interest Options  
export const TARGET_INTERESTS = [
  { value: 'home-improvement', label: 'Hemförbättring' },
  { value: 'construction', label: 'Byggprojekt' },
  { value: 'renovation', label: 'Renovering' },
  { value: 'garden', label: 'Trädgård' },
  { value: 'interior-design', label: 'Inredning' },
  { value: 'diy', label: 'Gör det själv' },
  { value: 'real-estate', label: 'Fastigheter' },
  { value: 'maintenance', label: 'Underhåll' },
  { value: 'energy-efficiency', label: 'Energieffektivisering' },
  { value: 'smart-home', label: 'Smart hem' }
] as const;

// CTA Options
export const CALL_TO_ACTIONS = [
  'Begär offert',
  'Kontakta oss',
  'Ring nu',
  'Boka konsultation',
  'Läs mer',
  'Få gratis uppskattning',
  'Kom igång',
  'Se exempel'
] as const;