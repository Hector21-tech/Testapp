// Campaign Wizard Types
export interface CompanyProfile {
  companyName: string;
  orgNumber: string; // Required for billing
  industry: string;
  customIndustry?: string;  // For "other" industry
  targetingAreas: string[];  // Multiple cities/areas for ad targeting
  customTargetingAreas?: string[];  // Custom areas
  radius: number;  // Optional radius around selected areas
  website?: string;
  goals: string[];
  ageRangeMin: number;
  ageRangeMax: number;
  interests: string[];
  description?: string;
  // Keep old fields for backward compatibility during migration
  location?: string;
  customLocation?: string;
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
  // New AI integration fields
  aiGeneratedContent?: {
    headlines: string[];
    descriptions: string[];
    ctas: string[];
    tone: 'professional' | 'friendly' | 'urgent';
    industry: string;
    generatedAt: string;
  };
  selectedAIContent?: {
    headline: string;
    description: string;
    cta: string;
  };
}

export interface AdImage {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  altText?: string;  // Keep for backward compatibility
  attribution?: string;
  isCustom?: boolean;
  preview?: string;
  source?: 'upload' | 'stock' | 'canva';
  // New Canva integration fields
  canvaDesign?: {
    id: string;
    title: string;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
  };
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

// Comprehensive Industry Options
export const INDUSTRIES = [
  // Hantverk & Byggsektorn
  { value: 'carpenter', label: 'Snickare', category: 'Hantverk' },
  { value: 'electrician', label: 'Elektriker', category: 'Hantverk' },
  { value: 'plumber', label: 'Rörmokare', category: 'Hantverk' },
  { value: 'painter', label: 'Målare', category: 'Hantverk' },
  { value: 'renovation', label: 'Byggnads & Renovering', category: 'Hantverk' },
  { value: 'landscaping', label: 'Mark & Trädgård', category: 'Hantverk' },
  { value: 'roofing', label: 'Takläggare', category: 'Hantverk' },
  { value: 'heating', label: 'VVS & Värme', category: 'Hantverk' },
  { value: 'flooring', label: 'Golvläggare', category: 'Hantverk' },
  { value: 'tiling', label: 'Kakelsättare', category: 'Hantverk' },
  { value: 'masonry', label: 'Murare', category: 'Hantverk' },
  { value: 'glazier', label: 'Glasmästare', category: 'Hantverk' },
  { value: 'locksmith', label: 'Låssmed', category: 'Hantverk' },
  { value: 'welder', label: 'Svetsare', category: 'Hantverk' },

  // Reparationer & Underhåll
  { value: 'appliance_repair', label: 'Vitvaruservice', category: 'Service' },
  { value: 'computer_repair', label: 'Datorreparation', category: 'Service' },
  { value: 'phone_repair', label: 'Mobiltelefonreparation', category: 'Service' },
  { value: 'watch_repair', label: 'Urmakare', category: 'Service' },
  { value: 'shoe_repair', label: 'Skomakare', category: 'Service' },
  { value: 'cleaning', label: 'Städservice', category: 'Service' },
  { value: 'window_cleaning', label: 'Fönsterputs', category: 'Service' },
  { value: 'pest_control', label: 'Skadedjursbekämpning', category: 'Service' },

  // Transport & Logistik
  { value: 'moving', label: 'Flyttfirma', category: 'Transport' },
  { value: 'taxi', label: 'Taxi', category: 'Transport' },
  { value: 'delivery', label: 'Budtjänst', category: 'Transport' },
  { value: 'towing', label: 'Bärgning', category: 'Transport' },
  { value: 'trucking', label: 'Åkeri', category: 'Transport' },
  
  // Bil & Fordon
  { value: 'auto_repair', label: 'Bilverkstad', category: 'Fordon' },
  { value: 'tire_service', label: 'Däckservice', category: 'Fordon' },
  { value: 'car_wash', label: 'Biltvätt', category: 'Fordon' },
  { value: 'auto_glass', label: 'Bilglas', category: 'Fordon' },
  { value: 'auto_rental', label: 'Biluthyrning', category: 'Fordon' },

  // Hälsa & Välmående
  { value: 'massage', label: 'Massör', category: 'Hälsa' },
  { value: 'personal_trainer', label: 'Personlig Tränare', category: 'Hälsa' },
  { value: 'physiotherapy', label: 'Fysioterapi', category: 'Hälsa' },
  { value: 'chiropractor', label: 'Kiropraktor', category: 'Hälsa' },
  { value: 'yoga_instructor', label: 'Yogainstruktör', category: 'Hälsa' },

  // Skönhet & Styling
  { value: 'hairdresser', label: 'Frisör', category: 'Skönhet' },
  { value: 'nail_salon', label: 'Nagelsalong', category: 'Skönhet' },
  { value: 'beauty_salon', label: 'Skönhetssalong', category: 'Skönhet' },
  { value: 'barber', label: 'Barberare', category: 'Skönhet' },
  { value: 'makeup_artist', label: 'Makeup Artist', category: 'Skönhet' },

  // Mat & Dryck
  { value: 'restaurant', label: 'Restaurang', category: 'Mat & Dryck' },
  { value: 'cafe', label: 'Café', category: 'Mat & Dryck' },
  { value: 'catering', label: 'Catering', category: 'Mat & Dryck' },
  { value: 'bakery', label: 'Bageri', category: 'Mat & Dryck' },
  { value: 'food_truck', label: 'Food Truck', category: 'Mat & Dryck' },
  { value: 'pizzeria', label: 'Pizzeria', category: 'Mat & Dryck' },

  // Detaljhandel
  { value: 'clothing_store', label: 'Klädesbutik', category: 'Handel' },
  { value: 'jewelry_store', label: 'Smyckesbutik', category: 'Handel' },
  { value: 'bookstore', label: 'Bokhandel', category: 'Handel' },
  { value: 'pet_store', label: 'Djuraffär', category: 'Handel' },
  { value: 'flower_shop', label: 'Blomsterhandel', category: 'Handel' },
  { value: 'antiques', label: 'Antikhandel', category: 'Handel' },

  // Konsulttjänster
  { value: 'accounting', label: 'Redovisning', category: 'Konsult' },
  { value: 'legal', label: 'Juridik', category: 'Konsult' },
  { value: 'marketing', label: 'Marknadsföring', category: 'Konsult' },
  { value: 'it_consulting', label: 'IT-konsult', category: 'Konsult' },
  { value: 'business_coaching', label: 'Affärscoach', category: 'Konsult' },
  { value: 'financial_advisor', label: 'Finansiell rådgivare', category: 'Konsult' },

  // Utbildning
  { value: 'driving_school', label: 'Trafikskola', category: 'Utbildning' },
  { value: 'music_teacher', label: 'Musiklärare', category: 'Utbildning' },
  { value: 'tutoring', label: 'Privatlektioner', category: 'Utbildning' },
  { value: 'language_school', label: 'Språkskola', category: 'Utbildning' },

  // Teknik & IT
  { value: 'web_design', label: 'Webbdesign', category: 'Teknik' },
  { value: 'software_development', label: 'Mjukvaruutveckling', category: 'Teknik' },
  { value: 'it_support', label: 'IT-support', category: 'Teknik' },
  { value: 'security_systems', label: 'Säkerhetssystem', category: 'Teknik' },

  // Fastighet
  { value: 'real_estate', label: 'Fastighetsmäklare', category: 'Fastighet' },
  { value: 'property_management', label: 'Fastighetsförvaltning', category: 'Fastighet' },
  { value: 'home_inspection', label: 'Besiktning', category: 'Fastighet' },

  // Husdjur & Djurvård
  { value: 'dog_grooming', label: 'Hundfrisör', category: 'Djur' },
  { value: 'dog_walking', label: 'Hundpromenader', category: 'Djur' },
  { value: 'pet_sitting', label: 'Djurpassning', category: 'Djur' },
  { value: 'veterinary', label: 'Veterinär', category: 'Djur' },

  // Foto & Video
  { value: 'photographer', label: 'Fotograf', category: 'Media' },
  { value: 'videographer', label: 'Videograf', category: 'Media' },
  { value: 'graphic_design', label: 'Grafisk design', category: 'Media' },

  // Event & Underhållning
  { value: 'dj', label: 'DJ', category: 'Event' },
  { value: 'event_planning', label: 'Eventplanering', category: 'Event' },
  { value: 'party_rental', label: 'Festuthyrning', category: 'Event' },
  { value: 'musician', label: 'Musiker', category: 'Event' },

  // Fallback option
  { value: 'other', label: 'Annan bransch', category: 'Övrigt' }
] as const;

// Goal Options - Core goals (always visible)
export const CORE_BUSINESS_GOALS = [
  { 
    value: 'leads', 
    label: 'Fler kundförfrågningar',
    description: 'Få kontakter som vill ha offerter (leads/formulär)',
    icon: '📧',
    category: 'core'
  },
  { 
    value: 'calls', 
    label: 'Fler telefonsamtal',
    description: 'Direktkontakt från intresserade kunder',
    icon: '📞',
    category: 'core'
  },
  { 
    value: 'website', 
    label: 'Fler hemsidebesök',
    description: 'Öka trafiken till din webbplats',
    icon: '🌐',
    category: 'core'
  },
  { 
    value: 'awareness', 
    label: 'Ökad kännedom',
    description: 'Bli mer känd i ditt område',
    icon: '👥',
    category: 'core'
  }
] as const;

// Advanced goals (shown when "Visa fler mål" is clicked)
export const ADVANCED_BUSINESS_GOALS = [
  { 
    value: 'ecommerce', 
    label: 'Onlineköp / E-handel',
    description: 'Kräver pixel/conversions för spårning',
    icon: '🛒',
    category: 'advanced'
  },
  { 
    value: 'bookings', 
    label: 'Bokningar / Möten',
    description: 'Calendly/booking-widget integration',
    icon: '📅',
    category: 'advanced'
  },
  { 
    value: 'messages', 
    label: 'Meddelanden',
    description: 'Messenger/WhatsApp/DM konversationer',
    icon: '💬',
    category: 'advanced'
  },
  { 
    value: 'newsletter', 
    label: 'Nyhetsbrevsprenumeration',
    description: 'Bygg e-postlista för marknadsföring',
    icon: '📰',
    category: 'advanced'
  },
  { 
    value: 'downloads', 
    label: 'Nedladdningar',
    description: 'PDF/meny/prislista/broschyrer',
    icon: '📄',
    category: 'advanced'
  },
  { 
    value: 'events', 
    label: 'Event-anmälningar/RSVP',
    description: 'Workshops, seminarier, öppet hus',
    icon: '🎟️',
    category: 'advanced'
  },
  { 
    value: 'video_views', 
    label: 'Videovisningar',
    description: 'Marknadsföringsvideos och produktdemos',
    icon: '🎥',
    category: 'advanced'
  },
  { 
    value: 'social_engagement', 
    label: 'Fler följare/engagemang',
    description: 'Sociala medier likes, shares, följare',
    icon: '❤️',
    category: 'advanced'
  },
  { 
    value: 'remarketing', 
    label: 'Återaktivering/remarketing',
    description: 'Nå befintliga kunder med nya erbjudanden',
    icon: '🔄',
    category: 'advanced'
  },
  { 
    value: 'store_visits', 
    label: 'Butiksbesök',
    description: 'Location/ads extension för fysisk butik',
    icon: '🏪',
    category: 'advanced'
  },
  { 
    value: 'app_installs', 
    label: 'App-installationer',
    description: 'Om du har en mobilapp',
    icon: '📱',
    category: 'advanced'
  }
] as const;

// Combined goals for backwards compatibility
export const BUSINESS_GOALS = [
  ...CORE_BUSINESS_GOALS,
  ...ADVANCED_BUSINESS_GOALS
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