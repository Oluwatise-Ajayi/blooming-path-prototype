import React, { useState } from 'react';

export default function AuthScreen({ onLoginSuccess, onStartNewOnboarding }) {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [registerRole, setRegisterRole] = useState('individual'); // 'individual', 'employer', 'institution'
  
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
    // Launch appropriate Onboarding Wizard
    onStartNewOnboarding(regEmail, fullName || 'New User', registerRole);
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
                        onClick={() => setRegisterRole(type.id)}
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
            </div>

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
