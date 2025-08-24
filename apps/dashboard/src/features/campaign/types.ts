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
  targetGender: string;  // 'all', 'men', 'women', 'non-binary'
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
    activeForCampaign?: boolean; // Whether this platform is selected for the current campaign
  };
  google: {
    connected: boolean;
    accountId?: string;
    accountName?: string;
    activeForCampaign?: boolean; // Whether this platform is selected for the current campaign
  };
  instagram: {
    connected: boolean;
    accountId?: string;
    accountName?: string;
    activeForCampaign?: boolean; // Whether this platform is selected for the current campaign
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

// Industry-specific goals that override the generic ones
export const GOALS_BY_INDUSTRY: Record<string, Array<{ value: string; label: string; description: string; icon: string; category: string }>> = {
  // Hantverk & Byggsektorn
  carpenter: [
    { value: 'leads', label: 'Fler renoveringsförfrågningar', description: 'Kunder som behöver snickeriarbeten', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler telefonsamtal', description: 'Direktkontakt för akuta reparationer', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tidigare projekt', description: 'Inspirera kunder med dina vackra arbeten', icon: '🔨', category: 'core' },
    { value: 'bookings', label: 'Fler besiktningar', description: 'Boka in tid för kostnadsfri besiktning', icon: '📅', category: 'advanced' }
  ],

  electrician: [
    { value: 'leads', label: 'Fler elförfrågningar', description: 'Kunder med elbehov och installationer', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler akuta ärenden', description: 'Nödsamtal för elstörningar', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa certifieringar', description: 'Bevisa din kompetens och auktorisation', icon: '⚡', category: 'core' },
    { value: 'bookings', label: 'Fler tidsbeställningar', description: 'Boka installation och service', icon: '📅', category: 'advanced' }
  ],

  plumber: [
    { value: 'leads', label: 'Fler VVS-förfrågningar', description: 'Kunder med rörmokeri- och värmebehov', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler akuta läckagesamtal', description: 'Nödsamtal för vattenläckage och stopp', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa referensprojekt', description: 'Badrumsrenoveringar och installationer', icon: '🔧', category: 'core' },
    { value: 'bookings', label: 'Fler besiktningar', description: 'Kostnadsfri besiktning av VVS-behov', icon: '📅', category: 'advanced' }
  ],

  // Mat & Dryck
  restaurant: [
    { value: 'calls', label: 'Fler bordsbokningar', description: 'Telefonbokningar för middagar', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa menyn', description: 'Locka kunder med läckra rätter', icon: '🍽️', category: 'core' },
    { value: 'store_visits', label: 'Fler gäster', description: 'Öka antalet besökare till restaurangen', icon: '🏪', category: 'core' },
    { value: 'bookings', label: 'Onlinebokningar', description: 'Digitala bordsbokningar via webb', icon: '📅', category: 'advanced' },
    { value: 'downloads', label: 'Ladda ner meny', description: 'PDF-meny och specialerbjudanden', icon: '📄', category: 'advanced' },
    { value: 'events', label: 'Eventbokningar', description: 'Större sällskap och företagsevent', icon: '🎟️', category: 'advanced' }
  ],

  cafe: [
    { value: 'store_visits', label: 'Fler kunder', description: 'Öka antalet besökare till caféet', icon: '🏪', category: 'core' },
    { value: 'website', label: 'Visa dagens bakelser', description: 'Locka med färska bakverk och kaffe', icon: '☕', category: 'core' },
    { value: 'calls', label: 'Catering-förfrågningar', description: 'Beställningar för företag och event', icon: '📞', category: 'core' },
    { value: 'social_engagement', label: 'Fler följare', description: 'Bygg en community runt ditt café', icon: '❤️', category: 'advanced' }
  ],

  catering: [
    { value: 'leads', label: 'Fler offertförfrågningar', description: 'Event som behöver catering-tjänster', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler beställningar', description: 'Direktbeställningar för catering', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa menyer', description: 'Inspirera med olika cateringalternativ', icon: '🍱', category: 'core' },
    { value: 'downloads', label: 'Ladda ner menyer', description: 'PDF-menyer för olika typer av event', icon: '📄', category: 'advanced' }
  ],

  // Skönhet & Styling
  hairdresser: [
    { value: 'bookings', label: 'Fler tidsbokningar', description: 'Online bokning av klipptider', icon: '📅', category: 'core' },
    { value: 'calls', label: 'Fler telefonbokningar', description: 'Direktbokningar via telefon', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa frisyrer', description: 'Inspirera med före/efter-bilder', icon: '✂️', category: 'core' },
    { value: 'social_engagement', label: 'Fler följare', description: 'Visa dina vackra frisyrer på sociala medier', icon: '❤️', category: 'advanced' }
  ],

  beauty_salon: [
    { value: 'bookings', label: 'Fler behandlingsbokningar', description: 'Boka ansiktsbehandlingar och hudvård', icon: '📅', category: 'core' },
    { value: 'calls', label: 'Konsultationsbokningar', description: 'Gratis hudkonsultationer', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa behandlingar', description: 'Alla tjänster och priser', icon: '💆‍♀️', category: 'core' },
    { value: 'newsletter', label: 'Skönhetsnyheter', description: 'Tips och erbjudanden via e-post', icon: '📰', category: 'advanced' }
  ],

  // Hälsa & Välmående  
  massage: [
    { value: 'bookings', label: 'Fler massagebokningar', description: 'Online bokning av massagetider', icon: '📅', category: 'core' },
    { value: 'calls', label: 'Fler telefonbokningar', description: 'Direktbokningar för akut behov', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa behandlingar', description: 'Olika massagetyper och prislistor', icon: '💆‍♂️', category: 'core' },
    { value: 'newsletter', label: 'Hälsotips', description: 'Välmåendetips och erbjudanden', icon: '📰', category: 'advanced' }
  ],

  personal_trainer: [
    { value: 'leads', label: 'Fler träningsintresserade', description: 'Personer som vill komma i form', icon: '📧', category: 'core' },
    { value: 'bookings', label: 'Fler PT-bokningar', description: 'Personliga träningstider', icon: '📅', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Gratis första träningssamtal', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa resultat', description: 'Före/efter-bilder och framgångsstorys', icon: '💪', category: 'core' }
  ],

  // Transport & Logistik
  moving: [
    { value: 'leads', label: 'Fler flyttförfrågningar', description: 'Privatpersoner och företag som ska flytta', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler offertsamtal', description: 'Kostnadsfria hembesök för offert', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tjänster', description: 'Alla flytttjänster och priser', icon: '📦', category: 'core' },
    { value: 'bookings', label: 'Fler flyttbokningar', description: 'Boka flyttdatum online', icon: '📅', category: 'advanced' }
  ],

  taxi: [
    { value: 'calls', label: 'Fler taxibeställningar', description: 'Direktbeställningar via telefon', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa serviceområde', description: 'Var du kör och prisexempel', icon: '🚕', category: 'core' },
    { value: 'app_installs', label: 'Fler app-användare', description: 'Om du har en beställningsapp', icon: '📱', category: 'advanced' },
    { value: 'bookings', label: 'Förhandsbeställningar', description: 'Boka taxi i förväg online', icon: '📅', category: 'advanced' }
  ],

  // Bil & Fordon
  auto_repair: [
    { value: 'leads', label: 'Fler reparationsförfrågningar', description: 'Bilägare med reparationsbehov', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler verkstadssamtal', description: 'Akuta problem och service', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tjänster', description: 'Alla reparationer och servicepriser', icon: '🔧', category: 'core' },
    { value: 'bookings', label: 'Fler servicebokningar', description: 'Boka service och besiktning', icon: '📅', category: 'advanced' }
  ],

  // Detaljhandel
  clothing_store: [
    { value: 'store_visits', label: 'Fler butiksbesök', description: 'Öka antalet kunder i butiken', icon: '🏪', category: 'core' },
    { value: 'website', label: 'Visa kollektionen', description: 'Locka med nya kläder och trender', icon: '👗', category: 'core' },
    { value: 'ecommerce', label: 'Fler onlineköp', description: 'Köp kläder online med hemleverans', icon: '🛒', category: 'core' },
    { value: 'newsletter', label: 'Modeuppdateringar', description: 'Första att veta om nya kollektioner', icon: '📰', category: 'advanced' }
  ],

  // Konsulttjänster
  accounting: [
    { value: 'leads', label: 'Fler redovisningskunder', description: 'Företag som behöver redovisningstjänster', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Gratis första rådgivningssamtal', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tjänster', description: 'Alla redovisningstjänster och priser', icon: '📊', category: 'core' },
    { value: 'bookings', label: 'Fler mötesbokningar', description: 'Boka rådgivningsmöten online', icon: '📅', category: 'advanced' }
  ],

  legal: [
    { value: 'leads', label: 'Fler juridiska ärenden', description: 'Klienter som behöver juridisk hjälp', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Första juridiska rådgivningen', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa expertområden', description: 'Dina juridiska specialiseringar', icon: '⚖️', category: 'core' },
    { value: 'bookings', label: 'Fler advokatmöten', description: 'Boka juridiska konsultationer', icon: '📅', category: 'advanced' }
  ],

  // Fastighet
  real_estate: [
    { value: 'leads', label: 'Fler säljuppdrag', description: 'Husägare som vill sälja', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler värderingssamtal', description: 'Gratis hemvärderingar', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa sålda objekt', description: 'Bevisa din framgång med tidigare försäljningar', icon: '🏠', category: 'core' },
    { value: 'bookings', label: 'Fler visningar', description: 'Boka objektvisningar online', icon: '📅', category: 'advanced' }
  ],

  // Utbildning
  driving_school: [
    { value: 'leads', label: 'Fler körkortsaspiranter', description: 'Personer som vill ta körkort', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler kursintresserade', description: 'Direktkontakt för kursinfo', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa kurser', description: 'Alla körkortskurser och priser', icon: '🚗', category: 'core' },
    { value: 'bookings', label: 'Fler körningslektioner', description: 'Boka körlektioner online', icon: '📅', category: 'advanced' }
  ],

  music_teacher: [
    { value: 'leads', label: 'Fler musikelever', description: 'Barn och vuxna som vill lära sig musik', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler provlektioner', description: 'Gratis första musiklektion', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa instrument', description: 'Vilka instrument du undervisar i', icon: '🎵', category: 'core' },
    { value: 'bookings', label: 'Fler lektionsbokningar', description: 'Boka musiklektioner online', icon: '📅', category: 'advanced' }
  ],

  // Teknik & IT
  web_design: [
    { value: 'leads', label: 'Fler webbprojekt', description: 'Företag som behöver nya webbsidor', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Diskutera webbprojekt och idéer', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa portfolio', description: 'Imponera med dina bästa webbdesigns', icon: '💻', category: 'core' },
    { value: 'bookings', label: 'Fler projektmöten', description: 'Boka designkonsultationer', icon: '📅', category: 'advanced' }
  ],

  it_support: [
    { value: 'leads', label: 'Fler IT-problem', description: 'Företag med datorproblem', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler akuta supportsamtal', description: 'Nödhjälp för IT-kriser', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tjänster', description: 'Alla IT-tjänster och supportområden', icon: '🖥️', category: 'core' },
    { value: 'bookings', label: 'Fler servicebokningar', description: 'Schemalagd IT-service', icon: '📅', category: 'advanced' }
  ],

  // Husdjur & Djurvård
  dog_grooming: [
    { value: 'bookings', label: 'Fler trimmingsbokningar', description: 'Boka hundtrimning online', icon: '📅', category: 'core' },
    { value: 'calls', label: 'Fler hunägare', description: 'Kontakt från hundägare', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa före/efter', description: 'Imponera med vackra trimningsresultat', icon: '🐕', category: 'core' },
    { value: 'social_engagement', label: 'Fler följare', description: 'Visa söta hundar på sociala medier', icon: '❤️', category: 'advanced' }
  ],

  pet_sitting: [
    { value: 'leads', label: 'Fler djurägare', description: 'Familjer som behöver djurpassning', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler passningsförfrågningar', description: 'Direktkontakt för akut passning', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa referenser', description: 'Nöjda djurägare och deras kommentarer', icon: '🐾', category: 'core' },
    { value: 'bookings', label: 'Fler passningsbokningar', description: 'Boka djurpassning i förväg', icon: '📅', category: 'advanced' }
  ],

  // Foto & Video
  photographer: [
    { value: 'leads', label: 'Fler fotouppdrag', description: 'Bröllop, företag och privatpersoner', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Diskutera fotoidéer och planering', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa portfolio', description: 'Imponera med dina bästa fotografier', icon: '📸', category: 'core' },
    { value: 'bookings', label: 'Fler fotobokningar', description: 'Boka fotografering online', icon: '📅', category: 'advanced' }
  ],

  // Event & Underhållning
  dj: [
    { value: 'leads', label: 'Fler eventförfrågningar', description: 'Bröllop, fester och företagsevent', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler konsultationer', description: 'Diskutera musik och eventplanering', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa erfarenhet', description: 'Videos från tidigare event och referenser', icon: '🎵', category: 'core' },
    { value: 'bookings', label: 'Fler eventbokningar', description: 'Boka DJ-tjänster online', icon: '📅', category: 'advanced' }
  ],

  event_planning: [
    { value: 'leads', label: 'Fler eventprojekt', description: 'Bröllop, företagsevent och fester', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler planeringskonsultationer', description: 'Gratis första planeringsmöte', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tidigare event', description: 'Inspirera med vackra event du planerat', icon: '🎉', category: 'core' },
    { value: 'bookings', label: 'Fler konsultationer', description: 'Boka eventplaneringsmöten', icon: '📅', category: 'advanced' }
  ],

  // Service
  cleaning: [
    { value: 'leads', label: 'Fler städkunder', description: 'Hem och företag som behöver städning', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler städförfrågningar', description: 'Akuta städbehov och återkommande', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa tjänster', description: 'Alla städtjänster och prisexempel', icon: '🧹', category: 'core' },
    { value: 'bookings', label: 'Fler städbokningar', description: 'Boka städning online', icon: '📅', category: 'advanced' }
  ],

  appliance_repair: [
    { value: 'leads', label: 'Fler reparationsärenden', description: 'Trasiga vitvaror och apparater', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler akuta reparationer', description: 'Nödhjälp när apparater slutar fungera', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa expertis', description: 'Vilka märken och apparater du reparerar', icon: '🔧', category: 'core' },
    { value: 'bookings', label: 'Fler servicebokningar', description: 'Boka reparationstid hemma', icon: '📅', category: 'advanced' }
  ],

  // Fallback for industries not yet defined
  other: [
    { value: 'leads', label: 'Fler kundförfrågningar', description: 'Kontakter som vill ha dina tjänster', icon: '📧', category: 'core' },
    { value: 'calls', label: 'Fler telefonsamtal', description: 'Direktkontakt från intresserade kunder', icon: '📞', category: 'core' },
    { value: 'website', label: 'Visa ditt arbete', description: 'Imponera med exempel på dina tjänster', icon: '🌐', category: 'core' },
    { value: 'awareness', label: 'Ökad kännedom', description: 'Bli mer känd i ditt område', icon: '👥', category: 'core' }
  ]
};

// Industry-specific customer needs
export const CUSTOMER_NEEDS_BY_INDUSTRY: Record<string, Array<{ value: string; label: string; description?: string }>> = {
  // Hantverk & Byggsektorn
  carpenter: [
    { value: 'kitchen-renovation', label: 'Köksrenovering', description: 'Nya skåp, bänkskivor, inredning' },
    { value: 'bathroom-renovation', label: 'Badrumsinredning', description: 'Badrumsrenovering och inredning' },
    { value: 'built-in-storage', label: 'Inbyggda förvaringslösningar', description: 'Garderober, bokhyllor, förråd' },
    { value: 'flooring-installation', label: 'Golvläggning', description: 'Parkett, laminat, trägolv' },
    { value: 'door-window-installation', label: 'Dörr- och fönstermontering' },
    { value: 'deck-balcony', label: 'Altaner och balkonger' },
    { value: 'emergency-repairs', label: 'Akuta reparationer', description: 'Snabba fixes och nödreparationer' }
  ],

  electrician: [
    { value: 'electrical-installation', label: 'Elinstallationer', description: 'Nya uttag, belysning, elledningar' },
    { value: 'troubleshooting', label: 'Felsökning', description: 'När elen inte fungerar' },
    { value: 'smart-home-setup', label: 'Smart hem-installation', description: 'Smarta hem-lösningar' },
    { value: 'electrical-upgrades', label: 'Eluppgraderingar', description: 'Modernisera elsystem' },
    { value: 'outdoor-lighting', label: 'Utomhusbelysning', description: 'Trädgårds- och fasadbelysning' },
    { value: 'emergency-electrical', label: 'Akuta elproblem', description: 'Nödsituationer med el' }
  ],

  plumber: [
    { value: 'bathroom-renovation', label: 'Badrumsrenovering', description: 'Kompletta badrum' },
    { value: 'kitchen-plumbing', label: 'Köksinstallationer', description: 'Diskmaskin, kök, kranar' },
    { value: 'heating-systems', label: 'Värmesystem', description: 'Radiatorer, golvvärme' },
    { value: 'pipe-repairs', label: 'Rörreparationer', description: 'Läckage, trasiga rör' },
    { value: 'drain-cleaning', label: 'Avloppsrensning', description: 'Igensatta avlopp' },
    { value: 'emergency-plumbing', label: 'Akuta VVS-problem', description: 'Nödsituationer' }
  ],

  painter: [
    { value: 'interior-painting', label: 'Inomhusmålning', description: 'Målning av rum och lägenheter' },
    { value: 'exterior-painting', label: 'Utomhusmålning', description: 'Fasadmålning och utomhus' },
    { value: 'wallpaper-installation', label: 'Tapet och väggbeklädnad' },
    { value: 'decorative-painting', label: 'Dekorativ målning', description: 'Specialtekniker och effekter' },
    { value: 'commercial-painting', label: 'Företagsmålning', description: 'Kontor och butikslokaler' },
    { value: 'renovation-painting', label: 'Renoveringsmålning', description: 'Målning vid renovering' }
  ],

  renovation: [
    { value: 'bathroom-renovation', label: 'Badrumsrenovering', description: 'Kompletta badrumsrenoveringar' },
    { value: 'kitchen-renovation', label: 'Köksrenovering', description: 'Nya kök och köksrenovering' },
    { value: 'whole-house-renovation', label: 'Totalrenovering', description: 'Hela hem och lägenheter' },
    { value: 'basement-renovation', label: 'Källarrenovering', description: 'Ombyggnad av källare' },
    { value: 'attic-conversion', label: 'Vindsinredning', description: 'Inredning av vindsutrymmen' },
    { value: 'commercial-renovation', label: 'Företagsrenovering', description: 'Kontor och butiker' }
  ],

  landscaping: [
    { value: 'garden-design', label: 'Trädgårdsdesign', description: 'Planering och design av trädgårdar' },
    { value: 'lawn-care', label: 'Gräsmatteservice', description: 'Klippning och skötsel av gräsmatta' },
    { value: 'tree-pruning', label: 'Trädbeskärning', description: 'Beskärning och trädfällning' },
    { value: 'paving-patios', label: 'Stenläggning & Uteplatser', description: 'Stenläggning och patios' },
    { value: 'irrigation-systems', label: 'Bevattningssystem', description: 'Automatisk bevattning' },
    { value: 'seasonal-cleanup', label: 'Säsongsrengöring', description: 'Vår- och höststädning' }
  ],

  roofing: [
    { value: 'roof-repair', label: 'Takreparationer', description: 'Läckage och skador' },
    { value: 'roof-replacement', label: 'Takbyte', description: 'Nya tak och takläggning' },
    { value: 'gutter-installation', label: 'Takrännearbeten', description: 'Rännor och stuprör' },
    { value: 'roof-inspection', label: 'Takbesiktning', description: 'Kontroll av takens skick' },
    { value: 'skylight-installation', label: 'Takfönster', description: 'Installation av takfönster' },
    { value: 'emergency-roof-repair', label: 'Akuta takreparationer', description: 'Nödfall och akuta läckage' }
  ],

  heating: [
    { value: 'heating-installation', label: 'Värmeinstallationer', description: 'Nya värmesystem' },
    { value: 'boiler-service', label: 'Pannservice', description: 'Service och reparation av pannor' },
    { value: 'radiator-installation', label: 'Radiatorarbeten', description: 'Nya radiatorer och byte' },
    { value: 'underfloor-heating', label: 'Golvvärme', description: 'Installation av golvvärme' },
    { value: 'heating-repairs', label: 'Värmereparationer', description: 'Reparation av värmesystem' },
    { value: 'energy-efficiency', label: 'Energieffektivisering', description: 'Optimering av värmesystem' }
  ],

  flooring: [
    { value: 'hardwood-flooring', label: 'Parkett & Trägolv', description: 'Installation av parkettgolv' },
    { value: 'laminate-flooring', label: 'Laminatgolv', description: 'Laminat och vinylgolv' },
    { value: 'tile-flooring', label: 'Kakel & Klinker', description: 'Kakelgolv och stengolv' },
    { value: 'carpet-installation', label: 'Mattläggning', description: 'Textilgolv och mattor' },
    { value: 'floor-renovation', label: 'Golvrenovering', description: 'Slipning och renovering' },
    { value: 'underfloor-systems', label: 'Golvvärmesystem', description: 'Golvvärme under golvet' }
  ],

  tiling: [
    { value: 'bathroom-tiling', label: 'Badrumskakel', description: 'Kakel i badrum och våtutrymmen' },
    { value: 'kitchen-backsplash', label: 'Kökskakel & Stänkskydd', description: 'Kakel bakom spis och bänk' },
    { value: 'floor-tiling', label: 'Golv i kakel/klinker', description: 'Kaklade golv' },
    { value: 'outdoor-tiling', label: 'Utomhuskakel', description: 'Terrasser och uteområden' },
    { value: 'tile-repair', label: 'Kakelreparationer', description: 'Lagning av trasigt kakel' },
    { value: 'mosaic-work', label: 'Mosaikarbeten', description: 'Dekorativ kakel och mosaik' }
  ],

  masonry: [
    { value: 'brick-work', label: 'Tegelarbeten', description: 'Murverk och tegelarbeten' },
    { value: 'stone-work', label: 'Stenarbeten', description: 'Natursten och stenmurar' },
    { value: 'fireplace-construction', label: 'Eldstäder & Spisar', description: 'Byggande av eldstäder' },
    { value: 'retaining-walls', label: 'Stödmurar', description: 'Murar och stöd i trädgård' },
    { value: 'chimney-work', label: 'Skorstensarbeten', description: 'Skorstenar och rökkanaler' },
    { value: 'concrete-work', label: 'Betongarbeten', description: 'Gjutning och betongarbeten' }
  ],

  glazier: [
    { value: 'window-repair', label: 'Fönsterreparationer', description: 'Lagning av trasiga fönster' },
    { value: 'glass-replacement', label: 'Glasbyten', description: 'Byte av krossat glas' },
    { value: 'mirror-installation', label: 'Spegelmontering', description: 'Stora speglar och spegelvägg' },
    { value: 'shower-doors', label: 'Duschväggar & Glaspartier', description: 'Glaspartier i badrum' },
    { value: 'emergency-glazing', label: 'Akuta glasarbeten', description: 'Nödfall med trasigt glas' },
    { value: 'security-glass', label: 'Säkerhetsglas', description: 'Säkerhetsglas och laminat' }
  ],

  locksmith: [
    { value: 'lockout-service', label: 'Utelåsning', description: 'Hjälp när du låst dig ute' },
    { value: 'lock-installation', label: 'Låsinstallation', description: 'Nya lås och säkerhetslås' },
    { value: 'key-duplication', label: 'Nyckelkopiering', description: 'Extra nycklar och kopior' },
    { value: 'security-upgrade', label: 'Säkerhetsuppdatering', description: 'Bättre lås och säkerhet' },
    { value: 'safe-opening', label: 'Kassaskåp & Värdeskåp', description: 'Öppning och service' },
    { value: 'car-locksmith', label: 'Billås', description: 'Billås och bilnycklar' }
  ],

  welder: [
    { value: 'metal-fabrication', label: 'Metallarbeten', description: 'Tillverkning i metall' },
    { value: 'railing-installation', label: 'Räcken & Balustader', description: 'Trappräcken och balkongräcken' },
    { value: 'gate-fabrication', label: 'Grindar & Staket', description: 'Metallgrindar och staket' },
    { value: 'repair-welding', label: 'Reparationssvetsning', description: 'Lagning av metalldelar' },
    { value: 'custom-metalwork', label: 'Specialtillverkning', description: 'Unika metallkonstruktioner' },
    { value: 'industrial-welding', label: 'Industrisvetsning', description: 'Tunga svetsarbeten' }
  ],

  // Service & Reparationer
  appliance_repair: [
    { value: 'washing-machine-repair', label: 'Tvättmaskinsreparation', description: 'Lagning av tvättmaskiner' },
    { value: 'dishwasher-repair', label: 'Diskmaskinsreparation', description: 'Service av diskmaskiner' },
    { value: 'refrigerator-repair', label: 'Kylskåpsreparation', description: 'Kyl och frys-service' },
    { value: 'oven-repair', label: 'Ugns- & Spisreparation', description: 'Lagning av ugnar och spisar' },
    { value: 'dryer-repair', label: 'Torktumlare-service', description: 'Reparation av torktumlare' },
    { value: 'emergency-service', label: 'Akut vitvaruservice', description: 'Nödfall med vitvaror' }
  ],

  computer_repair: [
    { value: 'virus-removal', label: 'Virusborttagning', description: 'Ta bort virus och skadlig kod' },
    { value: 'hardware-upgrade', label: 'Hårdvaruuppgradering', description: 'RAM, SSD, grafikkort' },
    { value: 'data-recovery', label: 'Dataräddning', description: 'Återställa borttappad data' },
    { value: 'slow-computer-fix', label: 'Långsam dator', description: 'Få datorn att gå snabbare' },
    { value: 'screen-repair', label: 'Skärmreparation', description: 'Trasiga skärmar och displayer' },
    { value: 'software-installation', label: 'Mjukvaruinstallation', description: 'Installation av program' }
  ],

  phone_repair: [
    { value: 'screen-replacement', label: 'Skärmbyte', description: 'Krossade mobilskärmar' },
    { value: 'battery-replacement', label: 'Batteribyte', description: 'Nya batterier till mobiler' },
    { value: 'water-damage-repair', label: 'Vattenskadesreparation', description: 'Mobiler som fallit i vatten' },
    { value: 'charging-port-repair', label: 'Laddningsreparation', description: 'Problem med laddning' },
    { value: 'button-repair', label: 'Knappreparationer', description: 'Trasiga knappar och switchar' },
    { value: 'camera-repair', label: 'Kamerareparation', description: 'Trasiga mobilkameror' }
  ],

  watch_repair: [
    { value: 'battery-replacement', label: 'Batteribyte', description: 'Nya batterier till klockor' },
    { value: 'mechanical-repair', label: 'Mekanisk reparation', description: 'Gamla och vintage-klockor' },
    { value: 'strap-replacement', label: 'Armbandsbyte', description: 'Nya klockarmband' },
    { value: 'water-damage', label: 'Vattenskadesreparation', description: 'Klockor som utsatts för vatten' },
    { value: 'cleaning-service', label: 'Klockrengöring', description: 'Rengöring och polering' },
    { value: 'vintage-restoration', label: 'Vintage-restaurering', description: 'Restaurering av gamla klockor' }
  ],

  shoe_repair: [
    { value: 'sole-replacement', label: 'Sulbyte', description: 'Nya sulor på skor' },
    { value: 'heel-repair', label: 'Klackreparation', description: 'Lagning av klackar' },
    { value: 'zipper-repair', label: 'Dragkedjor & Kardborreband', description: 'Lagning av stängningar' },
    { value: 'leather-conditioning', label: 'Lädervård', description: 'Vård och impregnering' },
    { value: 'stretching-service', label: 'Skovidgning', description: 'Vidga trånga skor' },
    { value: 'polish-service', label: 'Skoputs & Rengöring', description: 'Professionell skoputsning' }
  ],

  cleaning: [
    { value: 'regular-cleaning', label: 'Regelbunden städning', description: 'Vecko- eller månadsvis städning' },
    { value: 'deep-cleaning', label: 'Storstädning', description: 'Grundlig rengöring' },
    { value: 'move-cleaning', label: 'Flyttstädning', description: 'Städning vid flytt' },
    { value: 'office-cleaning', label: 'Kontorsstädning', description: 'Städning av kontor och företag' },
    { value: 'post-renovation', label: 'Efterstädning', description: 'Städning efter renovering' },
    { value: 'carpet-cleaning', label: 'Mattvätt', description: 'Rengöring av mattor och textilier' }
  ],

  window_cleaning: [
    { value: 'residential-windows', label: 'Privatbostäder', description: 'Fönsterputs för villor och lägenheter' },
    { value: 'commercial-windows', label: 'Företag & Kontor', description: 'Fönsterputs för företag' },
    { value: 'high-rise-cleaning', label: 'Höghus & Fasader', description: 'Höjdarbete och fasadrengöring' },
    { value: 'solar-panel-cleaning', label: 'Solpanelsrengöring', description: 'Rengöring av solceller' },
    { value: 'gutter-cleaning', label: 'Takrännerengöring', description: 'Rengöring av takrännor' },
    { value: 'pressure-washing', label: 'Högtryckstvätt', description: 'Fasader och uteområden' }
  ],

  pest_control: [
    { value: 'rodent-control', label: 'Rått- & Musbekämpning', description: 'Bli av med råttor och möss' },
    { value: 'insect-control', label: 'Insektsbekämpning', description: 'Myror, kackerlackor, flugor' },
    { value: 'wasp-removal', label: 'Getingborttagning', description: 'Säker borttagning av getingbon' },
    { value: 'bed-bug-treatment', label: 'Vägglössbekämpning', description: 'Behandling mot vägglöss' },
    { value: 'termite-control', label: 'Termitbekämpning', description: 'Skydd mot termitskador' },
    { value: 'prevention-service', label: 'Förebyggande åtgärder', description: 'Förhindra framtida problem' }
  ],

  // Transport & Logistik  
  taxi: [
    { value: 'airport-transfers', label: 'Flygplatstransfer', description: 'Transport till och från Arlanda, Bromma' },
    { value: 'city-transport', label: 'Stadstransporter', description: 'Transport inom staden' },
    { value: 'evening-transport', label: 'Kvällstransporter', description: 'Säker hemkörning på kvällen' },
    { value: 'medical-transport', label: 'Sjuktransporter', description: 'Transport till vårdcentral, sjukhus' },
    { value: 'business-transport', label: 'Företagstransporter', description: 'Affärsresor och möten' },
    { value: 'long-distance', label: 'Långdistans', description: 'Resor mellan städer' }
  ],

  delivery: [
    { value: 'same-day-delivery', label: 'Samma dag-leverans', description: 'Snabba leveranser samma dag' },
    { value: 'courier-service', label: 'Budtjänst', description: 'Dokument och små paket' },
    { value: 'furniture-delivery', label: 'Möbelleveranser', description: 'Stora och tunga föremål' },
    { value: 'food-delivery', label: 'Matleveranser', description: 'Restauranger och catering' },
    { value: 'medical-delivery', label: 'Medicintransport', description: 'Läkemedel och medicinsk utrustning' },
    { value: 'emergency-delivery', label: 'Akutleveranser', description: 'Brådskande transporter' }
  ],

  towing: [
    { value: 'breakdown-service', label: 'Bilhjälp vid haveri', description: 'När bilen inte startar eller går sönder' },
    { value: 'accident-recovery', label: 'Bärgning efter olycka', description: 'Transport efter trafikolyckor' },
    { value: 'car-transport', label: 'Biltransport', description: 'Flytta bilar mellan platser' },
    { value: 'lockout-service', label: 'Upplåsning av bil', description: 'När nycklarna är kvar i bilen' },
    { value: 'jump-start', label: 'Starthjälp', description: 'När bilbatteriet är slut' },
    { value: 'tire-change', label: 'Däckbyte på vägen', description: 'Byta punkterat däck' }
  ],

  trucking: [
    { value: 'local-transport', label: 'Lokaltransporter', description: 'Transport inom regionen' },
    { value: 'long-haul', label: 'Långdistanstransporter', description: 'Transport mellan städer' },
    { value: 'construction-transport', label: 'Byggtransporter', description: 'Byggmaterial och maskiner' },
    { value: 'waste-transport', label: 'Avfallstransport', description: 'Sophämtning och återvinning' },
    { value: 'specialty-transport', label: 'Specialtransporter', description: 'Tunga eller specialiserade laster' },
    { value: 'scheduled-delivery', label: 'Regelbundna leveranser', description: 'Återkommande transportuppdrag' }
  ],

  // Fordon & Bilservice
  auto_repair: [
    { value: 'general-service', label: 'Allmän bilservice', description: 'Service och underhåll' },
    { value: 'brake-repair', label: 'Bromsreparationer', description: 'Bromsbelägg, bromsskivor' },
    { value: 'engine-repair', label: 'Motorreparationer', description: 'Motorproblem och reparationer' },
    { value: 'transmission-repair', label: 'Växellådsreparationer', description: 'Automatlåda och manuell växel' },
    { value: 'ac-repair', label: 'AC & Klimatanläggning', description: 'Reparation av luftkonditionering' },
    { value: 'diagnostic-service', label: 'Felkodläsning', description: 'Hitta och diagnostisera bilproblem' }
  ],

  tire_service: [
    { value: 'tire-change', label: 'Däckbyte', description: 'Sommar- och vinterdäck' },
    { value: 'tire-repair', label: 'Däckreparation', description: 'Lagning av punkterade däck' },
    { value: 'wheel-alignment', label: 'Hjulinställning', description: 'Geometrijustering av hjul' },
    { value: 'tire-storage', label: 'Däckförvaring', description: 'Förvaring av säsongsdäck' },
    { value: 'tire-pressure', label: 'Däcktryckskontroll', description: 'Kontroll och justering av tryck' },
    { value: 'new-tire-sales', label: 'Nya däck', description: 'Försäljning av nya däck' }
  ],

  car_wash: [
    { value: 'exterior-wash', label: 'Utvändig tvätt', description: 'Grundlig utvändig biltvätt' },
    { value: 'interior-cleaning', label: 'Invändig rengöring', description: 'Dammsugning och inredningsrengöring' },
    { value: 'detailing-service', label: 'Bilpolering & Detailing', description: 'Professionell polering och vax' },
    { value: 'engine-cleaning', label: 'Motortvätt', description: 'Rengöring av motorrum' },
    { value: 'ceramic-coating', label: 'Keramisk beläggning', description: 'Långvarigt skydd för lacken' },
    { value: 'mobile-service', label: 'Mobil biltvätt', description: 'Biltvätt hemma hos kunden' }
  ],

  auto_glass: [
    { value: 'windshield-replacement', label: 'Vindrutebyte', description: 'Byte av krossad vindruta' },
    { value: 'windshield-repair', label: 'Vindrutereparation', description: 'Lagning av stensprång' },
    { value: 'side-window-replacement', label: 'Sidorutor', description: 'Byte av sidorutor' },
    { value: 'rear-window-replacement', label: 'Bakrutor', description: 'Byte av bakrutor' },
    { value: 'mobile-service', label: 'Mobil service', description: 'Bilglas på plats hos kunden' },
    { value: 'insurance-work', label: 'Försäkringsarbeten', description: 'Arbete via försäkring' }
  ],

  auto_rental: [
    { value: 'short-term-rental', label: 'Korttidsuthyrning', description: 'Dagshyra och veckohyra' },
    { value: 'long-term-rental', label: 'Långtidsuthyrning', description: 'Månadshyra och längre' },
    { value: 'moving-van-rental', label: 'Flyttbilsuthyrning', description: 'Skåpbilar för flyttning' },
    { value: 'luxury-car-rental', label: 'Lyxbilsuthyrning', description: 'Premium- och lyxbilar' },
    { value: 'corporate-rental', label: 'Företagsbilsuthyrning', description: 'Uthyrning till företag' },
    { value: 'vacation-rental', label: 'Semesterbilsuthyrning', description: 'Bilar för semesterresor' }
  ],

  // Skönhet & Hälsa
  hairdresser: [
    { value: 'cut-styling', label: 'Klippning & styling', description: 'Vardagsklippning och styling' },
    { value: 'coloring', label: 'Färgning', description: 'Hårfärg, slingor, balayage' },
    { value: 'special-occasions', label: 'Festfrisyrer', description: 'Bröllop, fest, bal' },
    { value: 'hair-treatments', label: 'Hårvård & behandlingar', description: 'Keratinbehandling, hårinpackning' },
    { value: 'beard-trimming', label: 'Skäggtrimning' },
    { value: 'hair-extensions', label: 'Hårförlängning' }
  ],

  nail_salon: [
    { value: 'manicure', label: 'Manicure', description: 'Nagelvård för händerna' },
    { value: 'pedicure', label: 'Pedicure', description: 'Nagelvård för fötterna' },
    { value: 'gel-nails', label: 'Gelnaglar', description: 'Starka och hållbara naglar' },
    { value: 'nail-art', label: 'Nagelkonst', description: 'Kreativ nageldesign' },
    { value: 'acrylic-nails', label: 'Akrylnaglar', description: 'Förlängning med akryl' },
    { value: 'nail-repair', label: 'Nagelreparation', description: 'Lagning av trasiga naglar' }
  ],

  beauty_salon: [
    { value: 'facial-treatments', label: 'Ansiktsbehandlingar', description: 'Rengöring och hudvård' },
    { value: 'eyebrow-threading', label: 'Ögonbryn & Fransar', description: 'Formning och färgning' },
    { value: 'waxing-service', label: 'Vaxning', description: 'Hårborttagning på kroppen' },
    { value: 'makeup-service', label: 'Sminkning', description: 'Professionell makeup' },
    { value: 'skin-treatments', label: 'Hudbehandlingar', description: 'Specialbehandlingar för huden' },
    { value: 'bridal-packages', label: 'Brudpaket', description: 'Sminkning och styling för bröllop' }
  ],

  barber: [
    { value: 'mens-haircut', label: 'Herrklippning', description: 'Klassisk och modern herrklippning' },
    { value: 'beard-styling', label: 'Skäggvård', description: 'Trimning och formning av skägg' },
    { value: 'straight-razor', label: 'Rakhyvel', description: 'Traditionell rakning med rakhyvel' },
    { value: 'hair-styling', label: 'Hårstyling', description: 'Styling och produkter för herrar' },
    { value: 'father-son', label: 'Pappa & Son', description: 'Klippning för hela familjen' },
    { value: 'grooming-packages', label: 'Grooming-paket', description: 'Komplett herrbehandling' }
  ],

  makeup_artist: [
    { value: 'bridal-makeup', label: 'Bröllopssmink', description: 'Sminkning för bröllop' },
    { value: 'event-makeup', label: 'Festsmink', description: 'Sminkning för fester och events' },
    { value: 'photography-makeup', label: 'Fotosminkning', description: 'Smink för fotografering' },
    { value: 'makeup-lessons', label: 'Sminkkurser', description: 'Lär dig sminka själv' },
    { value: 'special-effects', label: 'Specialeffekter', description: 'Kreativ och teatersminkning' },
    { value: 'personal-styling', label: 'Personlig styling', description: 'Hitta din perfekta look' }
  ],

  personal_trainer: [
    { value: 'weight-loss', label: 'Viktminskning', description: 'Träning för att gå ner i vikt' },
    { value: 'strength-training', label: 'Styrketräning', description: 'Bygga muskler och styrka' },
    { value: 'fitness-programs', label: 'Konditionsprogram', description: 'Förbättra din kondition' },
    { value: 'rehabilitation', label: 'Rehabiliteringsträning', description: 'Träning efter skada' },
    { value: 'sports-performance', label: 'Idrottsprestanda', description: 'Träning för idrottare' },
    { value: 'senior-fitness', label: 'Seniorträning', description: 'Träning anpassat för äldre' }
  ],

  physiotherapy: [
    { value: 'injury-rehabilitation', label: 'Skaderehabilitering', description: 'Återhämtning efter skador' },
    { value: 'back-pain-treatment', label: 'Ryggbehandling', description: 'Behandling av ryggont' },
    { value: 'sports-therapy', label: 'Idrottsfysioterapi', description: 'Behandling för idrottare' },
    { value: 'manual-therapy', label: 'Manuell terapi', description: 'Handbehandling av ledstörningar' },
    { value: 'exercise-therapy', label: 'Sjukgymnastik', description: 'Träning som behandling' },
    { value: 'workplace-ergonomics', label: 'Arbetsplatsproblem', description: 'Behandling av belastningsskador' }
  ],

  chiropractor: [
    { value: 'spinal-adjustment', label: 'Kotmobilisering', description: 'Justering av ryggraden' },
    { value: 'neck-treatment', label: 'Nackbehandling', description: 'Behandling av nackproblem' },
    { value: 'headache-treatment', label: 'Huvudvärkbehandling', description: 'Behandling av spänningshuvudvärk' },
    { value: 'posture-correction', label: 'Hållningskorrigering', description: 'Förbättra din kroppshållning' },
    { value: 'sports-chiropractic', label: 'Idrottsnaprapati', description: 'Behandling för idrottare' },
    { value: 'maintenance-care', label: 'Förebyggande vård', description: 'Regelbunden behandling för hälsa' }
  ],

  yoga_instructor: [
    { value: 'beginner-classes', label: 'Nybörjaryoga', description: 'Yoga för första gången' },
    { value: 'advanced-practice', label: 'Avancerad yoga', description: 'Utmanande yogapraxis' },
    { value: 'prenatal-yoga', label: 'Gravidyoga', description: 'Yoga för gravida' },
    { value: 'therapeutic-yoga', label: 'Terapeutisk yoga', description: 'Yoga för hälsa och återhämtning' },
    { value: 'meditation-classes', label: 'Meditation', description: 'Mindfulness och avslappning' },
    { value: 'corporate-yoga', label: 'Företagsyoga', description: 'Yoga på arbetsplatsen' }
  ],

  massage: [
    { value: 'relaxation-massage', label: 'Avslappningsmassage', description: 'För vila och återhämtning' },
    { value: 'sports-massage', label: 'Idrottsmassage', description: 'För aktiva och idrottare' },
    { value: 'pain-relief', label: 'Smärtlindring', description: 'Vid värk och spänningar' },
    { value: 'pregnancy-massage', label: 'Gravidmassage' },
    { value: 'wellness-packages', label: 'Wellness-paket', description: 'Helbehandlingar' }
  ],

  // Transport & Service
  moving: [
    { value: 'home-moving', label: 'Bostadsflytt', description: 'Flytta hemifrån' },
    { value: 'office-moving', label: 'Kontorsflytt', description: 'Företagsflytt' },
    { value: 'packing-services', label: 'Pack-service', description: 'Packning och uppackning' },
    { value: 'storage-solutions', label: 'Förvaringslösningar', description: 'Tillfällig förvaring' },
    { value: 'piano-moving', label: 'Pianoflytt', description: 'Specialtransporter' },
    { value: 'emergency-moving', label: 'Akuta flyttar' }
  ],

  // Mat & Dryck  
  restaurant: [
    { value: 'dinner-occasions', label: 'Middagar & dejter', description: 'Romantiska middagar' },
    { value: 'business-lunch', label: 'Affärslunch', description: 'Snabba luncher för yrkesverksamma' },
    { value: 'family-dining', label: 'Familjemiddagar', description: 'Barnvänlig miljö' },
    { value: 'special-events', label: 'Speciella tillfällen', description: 'Födelsedagar, firanden' },
    { value: 'takeaway', label: 'Avhämtning', description: 'Mat att ta med hem' }
  ],

  pizzeria: [
    { value: 'home-delivery', label: 'Hemleverans', description: 'Pizza levereras hem till dörren' },
    { value: 'pickup-takeaway', label: 'Avhämtning', description: 'Snabb avhämtning i butik' },
    { value: 'quick-dinner', label: 'Snabb middag', description: 'När du inte hinner laga mat' },
    { value: 'family-pizza', label: 'Familjepizza', description: 'Helgmys och vardagsmiddag' },
    { value: 'lunch-deals', label: 'Lunchdeals', description: 'Snabb lunch för arbetande' },
    { value: 'late-night-delivery', label: 'Kvällsleverans', description: 'Pizza sent på kvällen' },
    { value: 'party-orders', label: 'Festbeställningar', description: 'Pizza till fester och events' },
    { value: 'office-catering', label: 'Kontorscatering', description: 'Pizza till kontoret' }
  ],

  bakery: [
    { value: 'fresh-bread', label: 'Färskt bröd', description: 'Dagligen nybakat bröd' },
    { value: 'custom-cakes', label: 'Beställningstårtor', description: 'Födelsedagstårtor och specialbeställningar' },
    { value: 'morning-pastries', label: 'Morgonbak', description: 'Croissanter, buller och kaffebröd' },
    { value: 'wedding-cakes', label: 'Bröllopstårtor', description: 'Vackra tårtor för bröllop' },
    { value: 'coffee-shop', label: 'Kafé & Bakverk', description: 'Fika med färska bakverk' },
    { value: 'lunch-options', label: 'Lunchalternativ', description: 'Smörgåsar och lunchbröd' },
    { value: 'seasonal-specials', label: 'Säsongsbakverk', description: 'Pepparkakor, semlor, påskbröd' },
    { value: 'gluten-free', label: 'Glutenfritt', description: 'Alternativ för celiaki och glutenintolerans' }
  ],

  cafe: [
    { value: 'specialty-coffee', label: 'Specialkaffe', description: 'Högkvalitativa kaffebönor och bryggning' },
    { value: 'breakfast-menu', label: 'Frukostmeny', description: 'Hela frukostar och brunch' },
    { value: 'lunch-menu', label: 'Lunchmeny', description: 'Lätta luncher och sallader' },
    { value: 'meeting-space', label: 'Mötesplats', description: 'Lugn plats för möten och arbete' },
    { value: 'takeaway-coffee', label: 'Kaffe att ta med', description: 'Snabbt kaffe på väg till jobbet' },
    { value: 'desserts-pastries', label: 'Efterrätter & Bakverk', description: 'Söta bakverk och desserter' },
    { value: 'group-bookings', label: 'Gruppbokningar', description: 'Större sällskap och evenemang' },
    { value: 'wifi-workspace', label: 'WiFi & Arbetsmiljö', description: 'Plats att arbeta med laptop' }
  ],

  catering: [
    { value: 'corporate-catering', label: 'Företagscatering', description: 'Luncher och möten på kontor' },
    { value: 'wedding-catering', label: 'Bröllopscatering', description: 'Mat för bröllop och fester' },
    { value: 'party-catering', label: 'Festcatering', description: 'Privata fester och kalas' },
    { value: 'buffet-service', label: 'Buffé & Servering', description: 'Stora grupper och evenemang' },
    { value: 'dietary-options', label: 'Specialkoster', description: 'Vegetariskt, veganskt, glutenfritt' },
    { value: 'delivery-setup', label: 'Leverans & Uppdukning', description: 'Vi fixar allt på plats' },
    { value: 'event-planning', label: 'Eventplanering', description: 'Hjälp med hela evenemanget' },
    { value: 'last-minute-orders', label: 'Sista-minuten beställningar', description: 'Snabba lösningar' }
  ],

  food_truck: [
    { value: 'street-food', label: 'Gatukök', description: 'Snabb och god mat på stan' },
    { value: 'lunch-service', label: 'Lunchtjänst', description: 'Lunch för kontorsområden' },
    { value: 'event-bookings', label: 'Eventbokningar', description: 'Mat till fester och evenemang' },
    { value: 'festival-presence', label: 'Festivaler & Marknader', description: 'Mat på stora evenemang' },
    { value: 'corporate-visits', label: 'Företagsbesök', description: 'Food truck till kontor' },
    { value: 'private-parties', label: 'Privata fester', description: 'Unikt alternativ för kalas' },
    { value: 'specialty-cuisine', label: 'Specialmat', description: 'Unik mat från olika kulturer' },
    { value: 'late-night-service', label: 'Kvällsservering', description: 'Mat sent på kvällen' }
  ],

  // Fallback för okända branscher
  other: [
    { value: 'consultation', label: 'Konsultation & rådgivning' },
    { value: 'maintenance', label: 'Underhåll & service' },
    { value: 'installation', label: 'Installation & montering' },
    { value: 'repair', label: 'Reparationer' },
    { value: 'upgrade', label: 'Uppgraderingar' },
    { value: 'emergency', label: 'Akuta behov' }
  ]
};

// Gender targeting options
export const TARGET_GENDERS = [
  { 
    value: 'all', 
    label: 'Alla kön',
    description: 'Visa annonser för alla personer',
    icon: '👥'
  },
  { 
    value: 'men', 
    label: 'Män',
    description: 'Målgrupp: män',
    icon: '👨'
  },
  { 
    value: 'women', 
    label: 'Kvinnor',
    description: 'Målgrupp: kvinnor',
    icon: '👩'
  },
  { 
    value: 'non-binary', 
    label: 'Icke-binära',
    description: 'Inkluderar icke-binära personer',
    icon: '🏳️‍⚧️'
  }
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