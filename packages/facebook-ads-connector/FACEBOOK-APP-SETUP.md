# 🔧 Facebook App Setup Guide

## Problem: Invalid Scopes Error

Facebook har ändrat sina permission scopes. `ads_management`, `ads_read`, `business_management` kräver nu App Review.

## ✅ Lösning: Stegvis setup

### Steg 1: Basic Login (fungerar direkt)

**Scopes som fungerar utan App Review:**
- `public_profile` - Användarens namn och ID

**Test URL:** 
```
https://www.facebook.com/v19.0/dialog/oauth?client_id=1265970594722150&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=public_profile&response_type=code
```

### Steg 2: Facebook Developer Console Setup

1. **Gå till:** https://developers.facebook.com/apps/1265970594722150
2. **Logga in** med ditt Facebook konto
3. **Settings > Basic:**
   - App Name: AnnonsHjälpen
   - App Domains: `localhost, yourdomain.com`
   - Privacy Policy URL: (lägg till senare)

4. **Facebook Login > Settings:**
   - Valid OAuth Redirect URIs: 
     ```
     http://localhost:3000/auth/facebook/callback
     http://localhost:5173/auth/facebook/callback  
     https://yourdomain.com/auth/facebook/callback
     ```

### Steg 3: För Marketing API (senare)

För att använda Facebook Ads funktioner behöver du **App Review**:

1. **Use Cases > Add Use Case**
   - Välj "Business Management"
   - Lägg till permissions:
     - `ads_management`
     - `ads_read` 
     - `business_management`

2. **App Review Process:**
   - Beskriv din app: "AnnonsHjälpen - Facebook Ads campaign management"
   - Förklara varför du behöver ads permissions
   - Lägg upp screenshots av din app
   - Vänta på godkännande (1-7 dagar)

### Steg 4: Växla till Production Mode

När App Review är godkänd:
1. **Settings > Basic**
2. **App Mode: Switch to Live**

## 🚀 Test Implementation

### 1. Basic OAuth (fungerar nu)

```typescript
const connector = new FacebookConnector({
  redirectUri: 'http://localhost:3000/auth/facebook/callback'
});

// Denna URL fungerar direkt
const authUrl = connector.getAuthUrl('test-123');
```

### 2. Test Business Access (efter App Review)

```typescript
// Uppdatera scopes efter App Review godkännande
const connector = new FacebookConnector({
  redirectUri: 'http://localhost:3000/auth/facebook/callback'
});

// I AuthManager.ts - uppdatera scope efter approval:
const scope = [
  'public_profile',
  'email',
  'ads_management',
  'ads_read', 
  'business_management'
];
```

## 🎯 Nuvarande Status

**✅ Fungerar nu:**
- Basic Facebook login
- Användar profil data
- Email access

**⏳ Kräver App Review:**
- Ad accounts access
- Campaign creation
- Business data

## 📋 Nästa Steg

1. **Testa basic login först** med nya scopes
2. **Ansök om App Review** för Marketing API
3. **Vänta på godkännande**
4. **Uppdatera scopes** efter approval
5. **Testa full funktionalitet**

## Test URL (uppdaterad)
```
https://www.facebook.com/v19.0/dialog/oauth?client_id=1265970594722150&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=public_profile&response_type=code
```

Detta bör fungera direkt utan "Invalid Scopes" fel! 🎉