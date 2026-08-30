import React, { useState } from 'react';

export default function AssessorRoleHeader({ activeRole, currentLang, setCurrentLang, apiKey, setApiKey, userEmail, onLogout, onExportCSV }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setShowKeyModal(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'individual':
        return { label: 'Individual Portal (B2C)', icon: 'person', color: 'bg-secondary-container text-on-secondary-container' };
      case 'employer':
        return { label: 'Employer Portal (B2B)', icon: 'work', color: 'bg-primary-container text-on-primary-container border border-primary-fixed-dim/30' };
      case 'institution':
        return { label: 'Institutional Portal (B2G)', icon: 'account_balance', color: 'bg-tertiary-fixed text-on-tertiary-fixed' };
      case 'admin':
        return { label: 'System Admin Portal', icon: 'admin_panel_settings', color: 'bg-error-container text-on-error-container' };
      default:
        return { label: 'BloomingPath Portal', icon: 'spa', color: 'bg-secondary-container text-on-secondary-container' };
    }
  };

  const badge = getRoleBadge(activeRole);

  return (
    <>
      {/* Fixed Single Unified Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary shadow-md border-b border-primary-container">
        
        {/* Main Nav Row (Height: 56px / 14) */}
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          
          {/* Left Group: Brand Logo + Portal Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-extrabold text-sm shadow-sm">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base leading-none tracking-tight hidden sm:block">BloomingPath</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badge.color}`}>
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
                placeholder="Search analytics, candidates, records..."
                className="bg-transparent border-none focus:ring-0 w-full text-xs text-on-primary placeholder:text-primary-fixed-dim/70 outline-none p-0"
              />
            </div>
          )}

          {/* Right Group: Actions, Language, Profile Avatar, Switch Auth */}
          <div className="flex items-center gap-2">
            
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

            {/* Gemini Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configure Client-Side Gemini API Key"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-colors ${
                apiKey
                  ? 'bg-secondary-container/20 border-secondary text-secondary-fixed'
                  : 'bg-primary-container border-primary-fixed-dim/30 text-primary-fixed-dim hover:text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span className="hidden xl:inline text-[11px]">
                {apiKey ? 'API Live' : 'Set Key'}
              </span>
            </button>

            {/* Account Profile Pill with Avatar */}
            {userEmail && (
              <div className="flex items-center gap-2 pl-1 border-l border-primary-fixed-dim/20">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_IVCqP45JMPuQ9ZpjKI1Y-MOcTI4bqKRW1Bk8naLNg_K-eK-Y2cfqrxIj5ag1VYCkSMUeD-oXkEqH6CdTF4gV-Ut833CNjA1fiXNa86lHPeRxya8eVPm0hfmpCt745O3Bd96ZfMGsIUmwtbebfOCwzQtwd2dcwEPuFzYV_YdxfGwpsM9heKQJ2uSq0j5oa9DFee3nWIOumbs_ioG2gdwSBzhvZETQDzhtYju2UwnoE5qVqIqOskb23A"
                  alt="User Profile"
                  className="w-7 h-7 rounded-full object-cover border border-secondary-container"
                />
                <span className="hidden xl:inline font-mono text-[11px] text-primary-fixed-dim truncate max-w-[130px]">
                  {userEmail}
                </span>
              </div>
            )}

            {/* Switch Auth / Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Switch Account / Return to Auth Screen"
                className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs hover:bg-secondary transition-colors flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="text-[11px]">Switch Auth</span>
              </button>
            )}
          </div>

        </div>

        {/* Sub-Banner: RBAC Compliance Context Bar (Height: 24px) */}
        <div className="bg-primary-container/90 px-4 py-1 border-t border-primary-fixed-dim/10 text-[11px] text-primary-fixed-dim flex justify-between items-center h-6">
          <div className="flex items-center gap-2 max-w-[1600px] mx-auto w-full">
            <span className="material-symbols-outlined text-[14px] text-secondary-fixed">shield</span>
            <span className="truncate">
              <strong>RBAC Compliance Active:</strong> Strictly scoped to <strong className="text-on-primary">{userEmail || activeRole}</strong>. Use <strong>"Switch Auth"</strong> to test other roles.
            </span>
          </div>
        </div>
      </header>

      {/* Gemini API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                Gemini Client-Side API Key (Optional)
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Provide your Gemini API key to run live real-time LLM evaluations during simulations. If left blank, realistic pre-configured heuristic evaluation data is used.
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
