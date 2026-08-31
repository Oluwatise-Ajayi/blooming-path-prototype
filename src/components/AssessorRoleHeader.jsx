import React, { useState } from 'react';

export default function AssessorRoleHeader({ activeRole, setActiveRole, currentLang, setCurrentLang, apiKey, setApiKey, userEmail, onLogout }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setShowKeyModal(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'individual':
        return { label: 'Individual Portal', icon: 'person', color: 'bg-secondary-container text-on-secondary-container' };
      case 'employer':
        return { label: 'Employer Hub', icon: 'work', color: 'bg-primary-container text-on-primary-container border border-primary-fixed-dim/30' };
      case 'institution':
        return { label: 'Institutional Portal', icon: 'account_balance', color: 'bg-tertiary-fixed text-on-tertiary-fixed' };
      case 'admin':
        return { label: 'System Administration', icon: 'admin_panel_settings', color: 'bg-error-container text-on-error-container' };
      default:
        return { label: 'BloomingPath Portal', icon: 'spa', color: 'bg-secondary-container text-on-secondary-container' };
    }
  };

  const badge = getRoleBadge(activeRole);

  const portalRoles = [
    { id: 'individual', label: 'Individual Portal', icon: 'person' },
    { id: 'employer', label: 'Employer Hub', icon: 'work' },
    { id: 'institution', label: 'Institutional Portal', icon: 'account_balance' },
    { id: 'admin', label: 'System Admin', icon: 'admin_panel_settings' },
  ];

  return (
    <>
      {/* Fixed Single Unified Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary shadow-md border-b border-primary-container">
        
        {/* Main Nav Row */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left Group: Brand Logo + Portal Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-base leading-none tracking-tight hidden sm:block">BloomingPath</h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Center Search Input (Shown on desktop for Institution, Employer, Admin views) */}
          {activeRole !== 'individual' && (
            <div className="hidden md:flex items-center bg-primary-container/70 rounded-full px-3 py-1.5 w-64 lg:w-80 border border-primary-fixed-dim/20 focus-within:border-secondary transition-colors">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[18px] mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, analytics, records..."
                className="bg-transparent border-none focus:ring-0 w-full text-xs text-on-primary placeholder:text-primary-fixed-dim/70 outline-none p-0"
              />
            </div>
          )}

          {/* Right Group: Desktop Controls & Profile Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Desktop-Only Controls */}
            <div className="hidden md:flex items-center gap-2">
              {/* Notification Bell */}
              <button className="p-1.5 rounded-lg text-primary-fixed-dim hover:text-on-primary hover:bg-primary-container transition-colors relative" title="Notifications">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
              </button>

              {/* Language Dropdown */}
              <div className="flex items-center bg-primary-container/80 px-2 py-1 rounded-lg border border-primary-fixed-dim/20 text-xs">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[16px] mr-1">language</span>
                <select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value)}
                  className="bg-transparent text-on-primary font-semibold border-none focus:ring-0 text-xs p-0 pr-3 cursor-pointer"
                >
                  <option value="en" className="text-on-surface">English (UK)</option>
                  <option value="ar" className="text-on-surface">العربية (Arabic)</option>
                  <option value="fr" className="text-on-surface">Français (French)</option>
                </select>
              </div>

              {/* AI Assistant Status Button */}
              <button
                onClick={() => setShowKeyModal(true)}
                title="AI Engine Configuration"
                className={`p-1.5 px-2.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
                  apiKey
                    ? 'bg-secondary-container/20 border-secondary text-secondary-fixed'
                    : 'bg-primary-container border-primary-fixed-dim/30 text-primary-fixed-dim hover:text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span className="hidden xl:inline text-[11px] font-medium">
                  {apiKey ? 'Live AI Active' : 'AI Options'}
                </span>
              </button>
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2 py-1 rounded-xl bg-primary-container/60 hover:bg-primary-container border border-primary-fixed-dim/20 transition-all text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0">
                  <span className="material-symbols-outlined text-[16px]">{badge.icon}</span>
                </div>
                <span className="hidden sm:inline font-medium text-on-primary truncate max-w-[130px]">
                  {userEmail || 'Account'}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim">arrow_drop_down</span>
              </button>

              {/* Profile Popover Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-2 z-50 text-on-surface">
                  <div className="px-4 py-2 border-b border-outline-variant/60">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-semibold truncate text-on-surface">{userEmail || 'user@bloomingpath.com'}</p>
                  </div>

                  {/* Switch Portal Section */}
                  <div className="px-2 py-2">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider px-2 mb-1">Switch Workspace</p>
                    {portalRoles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setActiveRole(r.id);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeRole === r.id ? 'bg-primary-container/10 text-primary font-bold' : 'hover:bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                          <span>{r.label}</span>
                        </div>
                        {activeRole === r.id && <span className="material-symbols-outlined text-xs text-primary">check</span>}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-outline-variant/60 pt-1">
                    <button
                      onClick={() => {
                        setShowKeyModal(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">key</span>
                      <span>AI Key Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error-container/20 flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-primary-fixed-dim hover:text-on-primary hover:bg-primary-container transition-colors md:hidden shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-primary-fixed-dim/20 px-4 py-3 shadow-xl space-y-3">
            {/* Language Selector */}
            <div className="flex items-center bg-primary-container/80 px-2.5 py-1.5 rounded-xl border border-primary-fixed-dim/20 text-xs">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[18px] mr-1.5">language</span>
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-on-primary font-semibold border-none focus:ring-0 text-xs p-0 w-full cursor-pointer"
              >
                <option value="en" className="text-on-surface">English (UK)</option>
                <option value="ar" className="text-on-surface">العربية (Arabic)</option>
                <option value="fr" className="text-on-surface">Français (French)</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* AI Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                AI Engine Key Configuration
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Enter a client-side Gemini API key to enable live conversational voice evaluation.
            </p>
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setKeyInput('');
                    setApiKey('');
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-outline-variant text-xs text-on-surface hover:bg-surface-container-low"
                >
                  Clear Key
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
