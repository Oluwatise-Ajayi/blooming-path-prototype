import React, { useState } from 'react';

export default function AuthScreen({ onLoginSuccess, onStartNewOnboarding }) {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [registerRole, setRegisterRole] = useState('individual'); // 'individual', 'employer', 'institution'
  const [selectedPartnerOrg, setSelectedPartnerOrg] = useState(null); // for institution flow
  const [showPartnerSelect, setShowPartnerSelect] = useState(false);
  
  // Register State (Step 1)
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Login State
  const [loginRole, setLoginRole] = useState('individual');
  const [loginEmail, setLoginEmail] = useState('individual@bloomingpath.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // ── UK Partner Organisations ─────────────────────────────
  const PARTNER_ORGS = [
    {
      id: 'yemk-property',
      name: 'Yemk Property Limited',
      shortName: 'Yemk Property',
      type: 'Private Sector Property & Training Partner',
      icon: 'domain',
      color: '#1a5276',
      region: 'Greater London Authority (GLA)',
      focus: 'Property management training, vocational skills, facilities & maintenance',
      email: 'partnerships@yemkproperty.co.uk',
      contact: 'Yemk Partnerships Team',
      description: 'A London-based property company committed to upskilling diverse communities through workplace training and mentorship programmes.',
    },
    {
      id: 'rccg-cra',
      name: 'RCCG CRA',
      shortName: 'RCCG CRA',
      type: 'Faith-Based Community Employment Partner',
      icon: 'volunteer_activism',
      color: '#922b21',
      region: 'West Midlands Combined Authority (WMCA)',
      focus: 'Community outreach, social care support, employability for marginalised groups',
      email: 'employment@rccgcra.org.uk',
      contact: 'CRA Employment Support Team',
      description: 'RCCG CRA (Community Related Activity) runs faith-inspired community programmes supporting refugees, asylum seekers, and long-term unemployed individuals into employment.',
    },
    {
      id: 'fresh-hope',
      name: 'Fresh Hope Community Group',
      shortName: 'Fresh Hope',
      type: 'Grassroots Community Interest Group',
      icon: 'groups',
      color: '#1e8449',
      region: 'Greater Manchester Combined Authority (GMCA)',
      focus: 'Refugee integration, women returners, digital inclusion, peer-led support',
      email: 'hello@freshhopecommunity.org.uk',
      contact: 'Fresh Hope Coordinator',
      description: 'A grassroots community group providing wraparound employment support for newly arrived refugees and vulnerable adults, with a strong focus on peer mentoring and holistic wellbeing.',
    },
    {
      id: 'royale-ng',
      name: "Royale'NG Limited",
      shortName: "Royale'NG",
      type: 'Diaspora Business & Skills Network',
      icon: 'public',
      color: '#7d6608',
      region: 'Greater London Authority (GLA)',
      focus: 'Diaspora entrepreneurship, professional skills, hospitality, admin & retail pathways',
      email: 'connect@royaleng.co.uk',
      contact: "Royale'NG Partnership Desk",
      description: "A diaspora-led business and skills network connecting African and Caribbean communities in the UK to quality employment, training, and professional development opportunities.",
    },
  ];

  const demoRoles = [
    { id: 'individual', label: 'Individual Learner', email: 'individual@bloomingpath.com', icon: 'person' },
    { id: 'employer', label: 'Employer Manager', email: 'employer@bloomingpath.com', icon: 'work' },
    { id: 'institution', label: 'Institutional Partner', email: 'institution@bloomingpath.com', icon: 'account_balance' },
    { id: 'admin', label: 'System Administrator', email: 'admin@bloomingpath.com', icon: 'admin_panel_settings' },
  ];

  const handleRoleSelect = (roleId) => {
    setLoginRole(roleId);
    const target = demoRoles.find(r => r.id === roleId);
    if (target) {
      setLoginEmail(target.email);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    if (!regEmail || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters.');
      return;
    }
    // For institutions, require selecting a partner org first
    if (registerRole === 'institution' && !selectedPartnerOrg) {
      setShowPartnerSelect(true);
      return;
    }
    // Launch appropriate Onboarding Wizard
    const emailToUse = registerRole === 'institution' && selectedPartnerOrg
      ? selectedPartnerOrg.email
      : regEmail;
    onStartNewOnboarding(emailToUse, fullName || selectedPartnerOrg?.name || 'New User', registerRole, selectedPartnerOrg);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please provide your email and password.');
      return;
    }
    onLoginSuccess(loginRole, loginEmail);
  };

  return (
    <div className="bg-onboarding-bg text-on-surface font-body-md antialiased min-h-screen flex flex-col items-center w-full relative selection:bg-primary selection:text-on-primary">
      
      {/* Progress Stepper (Shown during Registration Step 1) */}
      {isRegisterMode && (
        <div className="w-full fixed top-0 left-0 z-50 flex h-1 bg-surface-container-low">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container w-1/4 transition-all duration-500 ease-out"></div>
          <div className="h-full bg-outline-variant w-1/4 opacity-30"></div>
          <div className="h-full bg-outline-variant w-1/4 opacity-30"></div>
          <div className="h-full bg-outline-variant w-1/4 opacity-30"></div>
        </div>
      )}

      {/* Top App Bar */}
      <header className="w-full h-16 flex items-center px-mobile-margin pt-4 bg-transparent z-40 fixed top-1 max-w-md mx-auto">
        <button 
          aria-label="Go back"
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-lowest transition-colors active:scale-95 text-on-surface"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-mobile-margin pt-24 pb-8 flex-1 flex flex-col justify-center">
        
        {isRegisterMode ? (
        /* ================= REGISTER VIEW (STEP 1 OF 4) ================= */
        showPartnerSelect ? (
          /* ── INSTITUTION PARTNER ORG SELECTOR ── */
          <div className="animate-fadeIn">
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowPartnerSelect(false)}
                className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary mb-4 mx-auto"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to registration
              </button>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2 block">Institution Registration</span>
              <h1 className="font-onboarding-title text-onboarding-title text-on-surface mb-2">Choose Your Organisation</h1>
              <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">
                Select the organisation you're registering on behalf of to access BloomingPath as an institutional partner.
              </p>
            </div>

            <div className="space-y-3">
              {PARTNER_ORGS.map(org => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => {
                    setSelectedPartnerOrg(org);
                    setShowPartnerSelect(false);
                    // Directly launch the institution onboarding with this org
                    onStartNewOnboarding(org.email, org.name, 'institution', org);
                  }}
                  className="w-full text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md active:scale-[0.98]"
                  style={{ borderColor: `${org.color}44`, background: `${org.color}06` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${org.color}18` }}
                    >
                      <span className="material-symbols-outlined text-[24px]" style={{ color: org.color }}>{org.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-on-surface">{org.name}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: `${org.color}18`, color: org.color }}
                        >
                          {org.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-snug">{org.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-[12px]" style={{ color: org.color }}>location_on</span>
                        <span className="text-[10px] text-on-surface-variant">{org.region.split('(')[0].trim()}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] shrink-0 mt-1" style={{ color: org.color }}>arrow_forward_ios</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-[11px] text-on-surface-variant mt-6">
              Not on this list?{' '}
              <button
                type="button"
                onClick={() => setShowPartnerSelect(false)}
                className="text-primary font-bold hover:underline"
              >
                Contact BloomingPath to register your organisation.
              </button>
            </p>
          </div>
        ) : (
          <div>
            {/* Header Section */}
            <div className="mb-stack-lg text-center md:text-left">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2 block">Step 1 of 4</span>
              <h1 className="font-onboarding-title text-onboarding-title text-on-surface mb-stack-sm">Create Account</h1>
              <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">
                Join our inclusive workforce platform. Your journey to meaningful employment starts here.
              </p>
            </div>

            {/* Registration Form Card */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-surface-variant shadow-sm mb-stack-md w-full">
              <form onSubmit={handleRegisterSubmit} className="space-y-stack-md">
                
                {regError && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
                    {regError}
                  </div>
                )}

          {/* Account Type Selector */}
          <div className="space-y-1.5">
            <label className="block font-label-sm text-label-sm text-on-surface-variant">I am registering as:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'individual', label: 'Individual', icon: 'person' },
                { id: 'employer', label: 'Employer', icon: 'work' },
                { id: 'institution', label: 'Institution', icon: 'account_balance' },
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setRegisterRole(type.id);
                    if (type.id === 'institution') {
                      setShowPartnerSelect(true);
                    }
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    registerRole === type.id
                      ? 'border-primary bg-primary-container/10 text-primary font-bold shadow-sm'
                      : 'border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{type.icon}</span>
                  <span className="text-[11px] truncate">{type.label}</span>
                </button>
              ))}
            </div>
            {/* Show selected institution partner if chosen */}
            {registerRole === 'institution' && selectedPartnerOrg && (
              <button
                type="button"
                onClick={() => setShowPartnerSelect(true)}
                className="w-full mt-2 flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                style={{ borderColor: `${selectedPartnerOrg.color}66`, background: `${selectedPartnerOrg.color}08` }}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: selectedPartnerOrg.color }}>{selectedPartnerOrg.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: selectedPartnerOrg.color }}>{selectedPartnerOrg.name}</p>
                  <p className="text-[10px] text-on-surface-variant">Tap to change organisation</p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">edit</span>
              </button>
            )}
          </div>

                {/* Full Name Field */}
                <div className="space-y-1">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="fullName">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <input 
                      id="fullName" 
                      name="fullName" 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe" 
                      className="glass-input block w-full pl-12 pr-4 h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-[16px] text-on-surface placeholder-outline transition-colors bg-surface-container-low" 
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jane@example.com" 
                      className="glass-input block w-full pl-12 pr-4 h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-[16px] text-on-surface placeholder-outline transition-colors bg-surface-container-low" 
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="glass-input block w-full pl-12 pr-12 h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-[16px] text-on-surface placeholder-outline transition-colors bg-surface-container-low" 
                    />
                    <button 
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline pt-1">Must be at least 8 characters.</p>
                </div>

                {/* Primary Action Button */}
                <button 
                  type="submit"
                  className="w-full h-[56px] bg-primary text-on-primary rounded-[12px] font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2 btn-shadow hover:bg-primary-container transition-all active:scale-[0.98] mt-6"
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>

          {/* Social Login Section */}
          <div className="w-full space-y-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-surface-variant"></div>
              <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-outline-variant uppercase">Or continue with</span>
              <div className="flex-grow border-t border-surface-variant"></div>
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => onStartNewOnboarding('google.user@bloomingpath.com', 'Google User', registerRole)}
                className="flex-1 h-[56px] bg-surface-container-lowest border border-surface-variant rounded-[12px] flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98] text-on-surface font-body-md text-body-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>
              <button 
                type="button"
                onClick={() => onStartNewOnboarding('linkedin.user@bloomingpath.com', 'LinkedIn User', registerRole)}
                className="flex-1 h-[56px] bg-surface-container-lowest border border-surface-variant rounded-[12px] flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98] text-on-surface font-body-md text-body-md"
              >
                <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>          </div>

          <p className="text-center font-label-sm text-label-sm text-outline mt-stack-lg">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className="text-primary font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
        ) /* end showPartnerSelect ternary */
      ) : (
          /* ================= LOG IN VIEW ================= */
          <div>
            {/* Header Section */}
            <div className="mb-stack-lg text-center md:text-left">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2 block">Welcome Back</span>
              <h1 className="font-onboarding-title text-onboarding-title text-on-surface mb-stack-sm">Sign In</h1>
              <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">
                Select your role or enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Role / Workspace Selector Pill Menu */}
            <div className="mb-4">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Portal Access Workspace:</label>
              <div className="grid grid-cols-2 gap-2">
                {demoRoles.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      loginRole === role.id 
                        ? 'border-primary bg-primary-container/10 text-primary font-semibold shadow-sm'
                        : 'border-surface-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{role.icon}</span>
                    <span className="text-xs truncate">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form Card */}
            <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-surface-variant shadow-sm mb-stack-md w-full">
              <form onSubmit={handleLoginSubmit} className="space-y-stack-md">
                
                {loginError && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="loginEmail">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input 
                      id="loginEmail" 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="user@bloomingpath.com" 
                      className="glass-input block w-full pl-12 pr-4 h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-[16px] text-on-surface transition-colors bg-surface-container-low" 
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="loginPassword">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input 
                      id="loginPassword" 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="glass-input block w-full pl-12 pr-4 h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-[16px] text-on-surface transition-colors bg-surface-container-low" 
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <button 
                  type="submit"
                  className="w-full h-[56px] bg-primary text-on-primary rounded-[12px] font-label-sm text-label-sm uppercase tracking-wider flex items-center justify-center gap-2 btn-shadow hover:bg-primary-container transition-all active:scale-[0.98] mt-6"
                >
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>

            <p className="text-center font-label-sm text-label-sm text-outline mt-stack-lg">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-primary font-bold hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        )}

      </main>

    </div>
  );
}
