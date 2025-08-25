# 🚀 Quick Start Guide - Facebook Ads Connector

## Steg 1: Fixa package name issue

Huvudproblemet är att du har svenska tecken i package name "@annonshjälpen/dashboard". 

**Snabb fix:**
```bash
# I root directory (Ny Saas)
# Ändra apps/dashboard/package.json:
# Från: "@annonshjälpen/dashboard" 
# Till: "@annonshjalpen/dashboard"
```

## Steg 2: Installera dependencies

```bash
cd packages/facebook-ads-connector
npm install axios@^1.6.0 jsonwebtoken@^9.0.2 @types/node@^20.0.0 typescript@^5.0.0
```

## Steg 3: Bygg TypeScript

```bash
npm run build
```

## Steg 4: Testa grundfunktionalitet

### A) Enkel manual test
```bash
npm run test:manual
```

### B) OAuth callback server
```bash
npm run test:server
```
Öppnar en server på http://localhost:3000/auth/facebook/callback

### C) Test OAuth URL
Öppna denna URL i browser:
```
https://www.facebook.com/v19.0/dialog/oauth?client_id=1265970594722150&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=public_profile&response_type=code
```

## Steg 5: Integrera i huvudprojekt

### I `apps/dashboard/src/components/FacebookTest.tsx`:
```tsx
import { FacebookConnector, CampaignObjective } from '@annonshjalpen/facebook-ads-connector';

const connector = new FacebookConnector({
  redirectUri: 'http://localhost:5173/auth/facebook/callback'
});

// Test OAuth URL generation  
const authUrl = connector.getAuthUrl('test-state-123');
console.log('Visit:', authUrl);
```

## Steg 6: Test React komponenter (senare)

När dependencies är installerade:
```tsx
import { 
  FacebookConnectButton,
  FacebookAccountSelector,
  FacebookStatus 
} from '@annonshjalpen/facebook-ads-connector';
```

## Troubleshooting

### Problem: Package name error
- Ändra svenska tecken i alla package.json filer
- Kör `npm install` igen

### Problem: TypeScript errors  
- Kör: `npm run build` i facebook-ads-connector först
- Kontrollera att alla dependencies är installerade

### Problem: OAuth errors
- Kontrollera att callback URL matchar Facebook app settings
- Använd http://localhost:3000/auth/facebook/callback för testing

## Nästa steg efter basic test

1. ✅ Skapa OAuth flow i din dashboard
2. ✅ Lägg till Facebook callback route  
3. ✅ Testa account selection
4. ✅ Testa campaign creation
5. ✅ Integrera i production

Facebook App: 1265970594722150
Test User: Använd ditt eget Facebook konto med Marketing API access