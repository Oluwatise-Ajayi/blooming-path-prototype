import React, { useState } from 'react';

export default function AuthScreen({ onLoginSuccess, onStartNewOnboarding }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Login Form State
  const [email, setEmail] = useState('individual@bloomingpath.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [regError, setRegError] = useState('');

  // Quick Demo Credentials presets
  const demoAccounts = [
    {
      role: 'individual',
      email: 'individual@bloomingpath.com',
      password: 'password123',
      label: '1. Individual Learner (Amina Hassan)',
      badge: 'B2C Dashboard & AI Sim',
      avatarIcon: 'person'
    },
    {
      role: 'employer',
      email: 'employer@bloomingpath.com',
      password: 'password123',
      label: '2. Employer Hiring Manager',
      badge: 'B2B De-identified Pipeline',
      avatarIcon: 'work'
    },
    {
      role: 'institution',
      email: 'institution@bloomingpath.com',
      password: 'password123',
      label: '3. Institutional Partner (Council / UKSPF)',
      badge: 'B2G Reports & Safeguarding',
      avatarIcon: 'account_balance'
    },
    {
      role: 'admin',
      email: 'admin@bloomingpath.com',
      password: 'password123',
      label: '4. System Administrator',
      badge: 'Pathway Overrides & Telemetry',
      avatarIcon: 'admin_panel_settings'
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const account = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (account) {
      onLoginSuccess(account.role, account.email);
    } else if (email && password) {
      // Default to individual if custom credentials
      onLoginSuccess('individual', email);
    } else {
      setLoginError('Please enter valid demo credentials.');
    }
  };

  const handleQuickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    onLoginSuccess(account.role, account.email);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!gdprConsent) {
      setRegError('UK GDPR Data Protection consent is required to proceed.');
      return;
    }
    if (!regEmail || !regPassword) {
      setRegError('Please provide an email and password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    // Launch Guided Post-Signup Voice Onboarding Diagnostic!
    onStartNewOnboarding(regEmail);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-container rounded-full opacity-30 blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Left Panel: Brand & Demo Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary via-primary-container to-tertiary p-6 rounded-2xl text-on-primary flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl">
                <span className="material-symbols-outlined text-[28px]">spa</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">BloomingPath</h1>
            </div>

            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-fixed text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-secondary/40">
              Assessor Demonstration Mode
            </span>

            <h2 className="text-xl font-bold mb-3 leading-snug">
              AI Workforce Readiness & Guided Voice Onboarding
            </h2>

            <p className="text-xs text-primary-fixed-dim leading-relaxed mb-6">
              This interactive prototype features role-based access control, voice-first diagnostic onboarding, client-side LLM simulations, and explainable capability rubrics.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-primary-fixed-dim/20">
            <p className="text-[11px] font-semibold text-primary-fixed-dim uppercase tracking-wider mb-2">
              Quick Demo Access Credentials:
            </p>
            <div className="space-y-1.5 text-xs">
              <p className="flex justify-between text-on-primary font-mono text-[11px]">
                <span>All Passwords:</span>
                <strong className="text-secondary-fixed">password123</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Login / Register Form */}
        <div className="md:col-span-7 flex flex-col justify-between">
          
          {/* Auth Tab Switcher */}
          <div>
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                1. Sign In (Existing Roles)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                2. Register & Voice Onboard
              </button>
            </div>

            {/* DEMO NOTICE BANNER */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-primary-fixed mb-6 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
              <p className="text-xs text-on-surface-variant">
                <strong className="text-primary">Assessor Note:</strong> Select any pre-configured demo account below for instant access, or click <strong className="text-on-surface">"Register & Voice Onboard"</strong> to experience the guided 2-stage voice diagnostic!
              </p>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {authMode === 'login' ? (
              <div className="space-y-6">
                
                {/* One-Click Quick Login Buttons */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    One-Click Assessor Persona Logins:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleQuickLogin(acc)}
                        className="p-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low hover:border-primary text-left transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">
                            {acc.avatarIcon}
                          </span>
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                            {acc.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-mono">{acc.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-secondary">
                          {acc.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
                  <span className="relative px-3 bg-surface-container-lowest text-xs text-on-surface-variant font-semibold">
                    or enter manually
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. individual@bloomingpath.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-all shadow-md"
                  >
                    Sign In to Portal
                  </button>
                </form>
              </div>
            ) : (
              /* TAB 2: MINIMAL SIGNUP FORM (STAGE 1) */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-secondary-container/20 border border-secondary text-xs text-on-surface">
                  <p className="font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                    Stage 1: Low-Barrier Registration
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Minimal fields to prevent digital fatigue. Clicking register launches Stage 2 (Guided Voice Diagnostic).
                  </p>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="newlearner@bloomingpath.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Mandatory UK GDPR Consent Checkbox */}
                <div className="p-3 rounded-xl bg-surface border border-outline-variant flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="gdpr"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-0.5 rounded border-outline text-primary focus:ring-primary"
                  />
                  <label htmlFor="gdpr" className="text-[11px] text-on-surface-variant cursor-pointer leading-tight">
                    <strong className="text-on-surface">Mandatory Compliance Checkbox:</strong> I explicitly consent to the Terms of Use and Privacy Policy in compliance with UK GDPR and ethical AI data processing guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary/90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                  Register & Launch Voice Diagnostic (Stage 2)
                </button>
              </form>
            )}

          </div>

          <div className="text-center pt-4 text-[11px] text-on-surface-variant border-t border-outline-variant mt-6">
            <span>BloomingPath Solutions Limited © 2026 — Verified Assessor Demo Suite</span>
          </div>

        </div>
      </div>
    </div>
  );
}
