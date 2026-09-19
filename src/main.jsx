import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AuthScreen from './components/AuthScreen';
import GuidedOnboardingWizard from './components/GuidedOnboardingWizard';
import EmployerOnboardingWizard from './components/EmployerOnboardingWizard';
import InstitutionOnboardingWizard from './components/InstitutionOnboardingWizard';
import PlatformHeader from './components/PlatformHeader';
import EvidenceTrailModal from './components/EvidenceTrailModal';
import IndividualView from './views/IndividualView';
import EmployerView from './views/EmployerView';
import InstitutionView from './views/InstitutionView';
import AdminView from './views/AdminView';
import './index.css';

function App() {
  // Auth & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('amina.hassan@example.com');
  const [activeRole, setActiveRole] = useState('individual'); // 'individual', 'employer', 'institution', 'admin'
  const [isOnboardingNewUser, setIsOnboardingNewUser] = useState(false);
  const [onboardingRole, setOnboardingRole] = useState('individual'); // 'individual', 'employer', 'institution'
  const [partnerOrg, setPartnerOrg] = useState(null); // selected institution partner org

  // App Settings State
  const [currentLang, setCurrentLang] = useState('en'); // 'en', 'ar', 'fr'

  // Evidence Trail Modal State
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    candidateName: '',
    capabilityName: '',
    score: '',
    transcriptSnippet: '',
  });

  // Handle Login from AuthScreen
  const handleLoginSuccess = (role, email) => {
    setActiveRole(role);
    setUserEmail(email || 'amina.hassan@example.com');
    setIsAuthenticated(true);
    setIsOnboardingNewUser(false);
  };

  // Handle New Registration -> Launch appropriate Onboarding
  const handleStartNewOnboarding = (email, name, role = 'individual', selectedPartnerOrg = null) => {
    setUserEmail(email || 'user@bloomingpath.com');
    setOnboardingRole(role);
    setPartnerOrg(selectedPartnerOrg || null);
    setIsAuthenticated(true);
    setIsOnboardingNewUser(true);
  };

  // Handle Onboarding Completion for Individual
  const handleCompleteIndividualOnboarding = (assignedPathwayId) => {
    setIsOnboardingNewUser(false);
    setActiveRole('individual');
  };

  // Handle Onboarding Completion for Employer
  const handleCompleteEmployerOnboarding = (data) => {
    setIsOnboardingNewUser(false);
    setActiveRole('employer');
  };

  // Handle Onboarding Completion for Institution
  const handleCompleteInstitutionOnboarding = (data) => {
    setIsOnboardingNewUser(false);
    setActiveRole('institution');
  };

  // Logout / Switch Account
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setIsOnboardingNewUser(false);
  };

  const handleOpenEvidenceTrail = (candidateName, capabilityName, score, transcriptSnippet) => {
    setModalData({ candidateName, capabilityName, score, transcriptSnippet });
    setIsEvidenceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      
      {!isAuthenticated ? (
        /* AUTHENTICATION SCREEN */
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onStartNewOnboarding={handleStartNewOnboarding}
        />
      ) : isOnboardingNewUser ? (
        /* ONBOARDING WIZARDS ROUTED BY ROLE */
        onboardingRole === 'employer' ? (
          <EmployerOnboardingWizard
            userEmail={userEmail}
            onComplete={handleCompleteEmployerOnboarding}
            onBack={() => {
              setIsAuthenticated(false);
              setIsOnboardingNewUser(false);
            }}
          />
        ) : onboardingRole === 'institution' ? (
          <InstitutionOnboardingWizard
            userEmail={userEmail}
            partnerOrg={partnerOrg}
            onComplete={handleCompleteInstitutionOnboarding}
            onBack={() => {
              setIsAuthenticated(false);
              setIsOnboardingNewUser(false);
            }}
          />
        ) : (
          <GuidedOnboardingWizard
            userEmail={userEmail}
            currentLang={currentLang}
            onCompleteOnboarding={handleCompleteIndividualOnboarding}
            onBackToRegister={() => {
              setIsAuthenticated(false);
              setIsOnboardingNewUser(false);
            }}
          />
        )
      ) : (
        /* MAIN PORTAL DASHBOARDS */
        <>
          {/* Global Application Navigation Header */}
          <PlatformHeader
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
            userEmail={userEmail}
            onLogout={handleLogout}
          />

          {/* Main View Router */}
          <main className="flex-1">
            {activeRole === 'individual' && (
              <div className="pt-[85px] pb-16">
                <IndividualView
                  userEmail={userEmail}
                  currentLang={currentLang}
                  onOpenEvidenceTrail={handleOpenEvidenceTrail}
                />
              </div>
            )}

            {activeRole === 'employer' && (
              <div className="pt-[85px] pb-16">
                <EmployerView
                  onOpenEvidenceTrail={handleOpenEvidenceTrail}
                  onOpenOnboarding={() => {
                    setOnboardingRole('employer');
                    setIsOnboardingNewUser(true);
                  }}
                />
              </div>
            )}

            {activeRole === 'institution' && (
              <InstitutionView
                onOpenOnboarding={() => {
                  setOnboardingRole('institution');
                  setIsOnboardingNewUser(true);
                }}
              />
            )}

            {activeRole === 'admin' && (
              <div className="pt-[85px] pb-16">
                <AdminView />
              </div>
            )}
          </main>

          {/* Global Explainability & Evidence Trail Modal */}
          <EvidenceTrailModal
            isOpen={isEvidenceModalOpen}
            onClose={() => setIsEvidenceModalOpen(false)}
            candidateName={modalData.candidateName}
            capabilityName={modalData.capabilityName}
            score={modalData.score}
            transcriptSnippet={modalData.transcriptSnippet}
          />
        </>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
