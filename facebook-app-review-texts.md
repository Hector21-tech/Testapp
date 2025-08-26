# Facebook App Review - AnnonsHjälpen

## App Information
- **App Name:** AnnonsHjälpen
- **App ID:** 1265970594722150
- **Contact Email:** privacy@xpeditionnorr.se
- **Privacy Policy URL:** https://xpeditionnorr.se/annonshjalpen-privacy-policy

## Requested Permissions

### 1. ads_management
### 2. ads_read
### 3. business_management

---

## Business Use Case Description

### Application Overview
AnnonsHjälpen is a comprehensive Facebook advertising management platform specifically designed for Swedish small and medium businesses (SMEs). Our SaaS platform simplifies Facebook advertising by providing automated campaign creation, Swedish market targeting, and performance analytics.

### Target Market
- **Primary Users:** Swedish small and medium business owners
- **Geographic Focus:** Sweden and Swedish-speaking markets
- **Business Size:** Companies with 1-50 employees who need simplified Facebook advertising

### Core Platform Features
1. **Automated Campaign Creation:** Pre-configured campaigns optimized for Swedish market
2. **Swedish Market Targeting:** Built-in audience segments and geographic targeting for Sweden
3. **Budget Optimization:** Smart budget recommendations based on Swedish market data
4. **Performance Analytics:** Campaign performance tracking with Swedish currency (SEK) support
5. **Multi-language Support:** Swedish and English interface

### Business Model
- SaaS subscription platform
- Monthly/yearly subscriptions for Swedish businesses
- Revenue from platform usage, not from advertising spend
- Focus on helping SMEs succeed with Facebook advertising

---

## Permission Justifications

### ads_management Permission

**Why we need this permission:**
We need ads_management permission to create, edit, and manage Facebook ad campaigns on behalf of our Swedish business customers.

**Specific use cases:**
1. **Campaign Creation:** Create new Facebook ad campaigns with Swedish market targeting and SEK budgets
2. **Campaign Management:** Update campaign budgets, schedules, and targeting parameters based on performance
3. **Campaign Control:** Pause, resume, or stop campaigns based on user instructions or automated optimization rules
4. **Ad Creative Management:** Update ad text, images, and targeting to improve performance
5. **Budget Optimization:** Automatically adjust daily/lifetime budgets based on performance data

**User Benefit:**
Our customers get professionally managed Facebook campaigns without needing to learn Facebook Ads Manager complexity. This is especially valuable for Swedish SMEs who want to focus on their business rather than advertising technicalities.

**Data Usage:**
We only access campaign data necessary for management and optimization. We never access personal user data beyond what's needed for campaign targeting.

### ads_read Permission

**Why we need this permission:**
We need ads_read permission to retrieve campaign performance data and provide analytics to our customers.

**Specific use cases:**
1. **Performance Analytics:** Display campaign metrics (impressions, clicks, conversions, cost) in our dashboard
2. **ROI Reporting:** Calculate return on advertising spend (ROAS) and provide business insights
3. **Optimization Insights:** Analyze performance data to recommend campaign improvements
4. **Budget Tracking:** Monitor ad spend against allocated budgets and alert users
5. **A/B Testing:** Compare campaign variants to determine best performing creative and targeting
6. **Historical Analysis:** Provide long-term performance trends and seasonal insights

**User Benefit:**
Our customers get comprehensive analytics and insights about their Facebook advertising performance in an easy-to-understand format, with Swedish language support and SEK currency display.

**Data Usage:**
We only access campaign performance metrics. We never access sensitive user data or personal information from ad audiences.

### business_management Permission

**Why we need this permission:**
We need business_management permission to access our customers' Facebook Business accounts and associated ad accounts.

**Specific use cases:**
1. **Ad Account Discovery:** List available ad accounts for the user to select from
2. **Account Verification:** Verify user has appropriate permissions to manage selected ad accounts
3. **Business Information:** Access business-level settings required for proper campaign setup
4. **Multi-Account Management:** Support customers with multiple business accounts or ad accounts
5. **Permission Validation:** Ensure user has necessary access rights before attempting campaign operations

**User Benefit:**
Seamless integration with existing Facebook Business setup. Users can easily connect their existing ad accounts without complex configuration.

**Data Usage:**
We only access business account structure and permissions. We never access sensitive business data beyond what's necessary for ad account management.

---

## Technical Implementation

### Authentication Flow
1. User clicks "Connect Facebook" in our platform
2. OAuth popup opens with requested permissions
3. User grants permissions through Facebook's official flow
4. We receive access token and store it securely
5. User can manage campaigns through our interface

### Data Security
- All data encrypted in transit (HTTPS/TLS)
- Access tokens stored with industry-standard encryption
- No sensitive data logging
- GDPR compliant data handling
- Regular security audits

### Privacy Compliance
- Users can disconnect Facebook integration anytime
- Clear privacy policy explaining data usage
- GDPR data export and deletion features
- Transparent permission explanations in our UI

---

## User Flow Screenshots

### Screenshot 1: Facebook Integration Page
**Description:** Shows the initial Facebook connection interface with clear permission explanations and callback URL configuration.

### Screenshot 2: Connected State
**Description:** Demonstrates successful Facebook OAuth integration with user profile information display and connection status.

### Screenshot 3: Privacy Settings - Permissions
**Description:** Shows transparent permission management with clear status indicators for current vs requested permissions.

### Screenshot 4: Privacy Settings - Contact
**Description:** Displays privacy controls, contact information, and GDPR compliance features.

---

## Development Status

### Currently Functional
- ✅ Facebook OAuth authentication with public_profile permission
- ✅ User interface for campaign management (ready for ads permissions)
- ✅ Privacy controls and data management features
- ✅ Swedish market targeting configuration
- ✅ Analytics dashboard framework (ready for ads_read data)

### Ready to Activate After Approval
- ⏳ Campaign creation using ads_management permission
- ⏳ Performance data retrieval using ads_read permission
- ⏳ Business account integration using business_management permission
- ⏳ Full end-to-end campaign management workflow

### Note on Demo Data
Screenshots show demo data for privacy and security reasons. The application is fully functional with real Facebook accounts and will work with actual campaign data once permissions are approved.

---

## Compliance Statements

### Facebook Platform Policy Compliance
- We comply with all Facebook Platform Policies
- We only use Facebook data to provide our advertising management service
- We never sell or share user data with third parties
- We implement proper data retention and deletion policies

### Data Protection Compliance
- Full GDPR compliance for EU users
- Swedish data protection law compliance
- Clear privacy policy and user controls
- Data minimization principles applied

### Business Legitimacy
- Registered Swedish business entity
- Transparent business model (SaaS subscriptions)
- Professional customer support
- Clear terms of service and privacy policy

---

## Contact Information
- **Email:** privacy@xpeditionnorr.se
- **Business Location:** Ängelholm, Sweden
- **Support:** Available in Swedish and English
- **Response Time:** Within 24 hours for all inquiries

---

**We are committed to providing a valuable service to Swedish businesses while maintaining the highest standards of data protection and Facebook platform compliance.**