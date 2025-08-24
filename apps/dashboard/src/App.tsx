import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';
import { Dashboard } from './pages/dashboard/Dashboard';
import { CampaignStudio } from './pages/campaigns/CampaignStudio';
import { NewWizard } from './pages/campaigns/NewWizard';
import { ProfileWizard } from './components/profile/ProfileWizard';
import { DesignTestPage } from './pages/design-test/DesignTestPage';
import { AITestPage } from './pages/ai-test/AITestPage';
import { ContentStudioTestPage } from './pages/content-studio/ContentStudioTestPage';
import { HelpPage } from './pages/help/HelpPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root to onboarding */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          
          {/* Onboarding flow */}
          <Route path="/onboarding" element={<OnboardingWizard />} />
          
          {/* Main dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Campaign creation */}
          <Route path="/campaign-studio" element={<CampaignStudio />} />
          
          {/* New Campaign Wizard */}
          <Route path="/campaigns/new" element={<NewWizard />} />
          
          {/* Profile Wizard - Direct access */}
          <Route path="/profile" element={<ProfileWizard />} />
          
          {/* Design Test Page */}
          <Route path="/design-test" element={<DesignTestPage />} />
          
          {/* AI Test Page */}
          <Route path="/ai-test" element={<AITestPage />} />
          
          {/* Content Studio Test Page - Full Pipeline */}
          <Route path="/content-studio-test" element={<ContentStudioTestPage />} />
          
          {/* Help Page */}
          <Route path="/help" element={<HelpPage />} />
          
          {/* Legacy redirect for old wizard */}
          <Route path="/campaigns/studio" element={<Navigate to="/campaign-studio" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;