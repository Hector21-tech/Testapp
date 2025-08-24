# AnnonsHjälpen Campaign Wizard 🧙‍♂️

A comprehensive, production-ready campaign creation wizard built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 Complete User Journey
- **6-step wizard** with progressive disclosure
- **8-substep profile wizard** for detailed company info
- **Auto-save** functionality (localStorage + future API)
- **Step validation** and navigation guards
- **Responsive design** (mobile-first approach)

### 🎨 Premium UI/UX
- **Smooth animations** and micro-interactions
- **Glassmorphism effects** with brand consistency
- **Professional color palette** (rust/orange theme)
- **Accessibility compliant** (ARIA labels, keyboard navigation)
- **Toast notifications** (ready for implementation)

### 🔧 Technical Excellence
- **TypeScript** throughout for type safety
- **Zustand** state management with persistence
- **Form validation** with inline error handling
- **Modular components** for easy maintenance
- **Mock API integration** ready for backend

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── wizard/
│   │   ├── Stepper.tsx           # Progress indicator
│   │   ├── StepCard.tsx          # Step container
│   │   └── WizardFooter.tsx      # Navigation footer
│   ├── fields/
│   │   ├── TextInput.tsx         # Text input with validation
│   │   ├── Select.tsx            # Dropdown with icons
│   │   ├── RadioCards.tsx        # Card-based radio buttons
│   │   ├── ChipTags.tsx          # Tag selector with custom input
│   │   └── RangeSlider.tsx       # Styled range input
│   ├── profile/
│   │   └── ProfileWizard.tsx     # 8-step profile mini-wizard
│   └── AdImagePicker.tsx         # Image upload + stock photos
├── features/
│   └── campaign/
│       ├── types.ts              # TypeScript definitions
│       ├── store.ts              # Zustand state management
│       └── validators.ts         # Validation functions
└── pages/
    └── campaigns/
        └── NewWizard.tsx         # Main wizard component
```

### State Management
- **Zustand store** with persistence middleware
- **Auto-save** every 3 seconds + on step change
- **LocalStorage** fallback for offline editing
- **Validation guards** prevent invalid progression

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3001
```

## 📋 Wizard Flow

### Step 1: Company Profile (8 sub-steps)
1. **Company Info** - Name, org number
2. **Industry** - Visual industry selector
3. **Location** - City + work radius slider
4. **Website** - Optional URL field
5. **Goals** - Primary business objective
6. **Age Range** - Target customer age
7. **Interests** - Customer interest tags
8. **Description** - Optional company description

### Step 2: Connect Channels
- **Facebook** Business Manager integration (mocked)
- **Google Ads** account linking (mocked)
- **Validation** requires at least one connected channel

### Step 3: Ad Content
- **AI-generated suggestions** based on profile
- **Headline** input with character guidance
- **Description** textarea with best practices
- **Call-to-action** dropdown selection
- **Live preview** of ad appearance

### Step 4: Select Image
- **Drag & drop upload** with validation
  - File types: JPG, PNG, WebP
  - Max size: 10MB
  - Min dimensions: 1200x600px
- **Stock photos** with preview modal
- **Image management** with alt-text

### Step 5: Budget & Targeting
- **Daily budget** slider (50-1000 kr)
- **Campaign dates** with date pickers
- **Age targeting** refinement
- **Interest expansion** options
- **Budget calculator** shows total cost

### Step 6: Review & Launch
- **Complete summary** of all settings
- **Edit shortcuts** to return to previous steps
- **Final confirmation** checkbox
- **Launch button** (mocked campaign creation)

## 🎨 Design System

### Colors
```css
Brand: #9B4521 (rust/orange)
Light: #C7683A
Dark: #7F361B
Neutral: 50-900 scale
```

### Components
- **Cards**: Rounded corners, soft shadows
- **Buttons**: Hover animations, loading states
- **Inputs**: Focus rings, validation states
- **Animations**: Fade, slide, scale transitions

### Responsive Design
- **Mobile**: Single column, vertical stepper
- **Tablet**: Adaptive grids, larger touch targets
- **Desktop**: Multi-column layouts, hover effects

## 🔌 Integration Points

### Ready for Backend
```typescript
// TODO: Replace mock functions with real API calls
const connectFacebook = async (userId: string) => {
  // Facebook OAuth integration
};

const generateContent = async (profile: CompanyProfile) => {
  // AI content generation API
};

const createCampaign = async (draft: CampaignDraft) => {
  // Campaign creation API
};
```

### External APIs
- **Facebook Marketing API** - Ad account management
- **Google Ads API** - Campaign creation
- **Pexels/Unsplash** - Stock photo integration
- **OpenAI/Claude** - Content generation

## 🧪 Testing Strategy

### Component Testing
- Unit tests for form validation
- Integration tests for wizard flow
- Accessibility testing with ARIA

### User Testing
- Complete wizard journey (10-15 minutes)
- Mobile/desktop responsive testing
- Error handling and recovery

## 🚀 Deployment

### Build Command
```bash
pnpm build
```

### Environment Variables
```env
VITE_API_URL=https://api.annonshjalpen.se
VITE_FACEBOOK_APP_ID=your-app-id
VITE_GOOGLE_CLIENT_ID=your-client-id
```

## 📊 Performance

### Optimization
- **Lazy loading** for image picker
- **Code splitting** by route
- **Debounced auto-save** (3 second delay)
- **Optimistic updates** for better UX

### Bundle Size
- Main bundle: ~400KB (estimated)
- Vendor bundle: ~800KB (React, Zustand, etc.)
- Assets: Minimal (using CDN fonts)

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] **A/B testing** for ad content
- [ ] **Performance analytics** dashboard
- [ ] **Multi-campaign management**
- [ ] **Team collaboration** features
- [ ] **White-label** customization

### Technical Improvements
- [ ] **React Query** for server state
- [ ] **React Hook Form** for complex validation
- [ ] **Framer Motion** for advanced animations
- [ ] **PWA** support for offline editing

## 🎯 Success Metrics

### User Experience
- **Completion rate**: >85% target
- **Time to complete**: <15 minutes
- **Error rate**: <5% validation errors
- **User satisfaction**: >4.5/5 rating

### Business Impact
- **Conversion rate**: Landing → Campaign creation
- **Retention rate**: Users returning to create more campaigns
- **Support tickets**: Reduced need for manual assistance

---

**Built with ❤️ for AnnonsHjälpen**  
*Making advertising simple for craftsmen across Sweden* 🇸🇪