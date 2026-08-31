import React, { useState } from 'react';

export default function PlatformHeader({ activeRole, setActiveRole, currentLang, setCurrentLang, userEmail, onLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary shadow-md border-b border-primary-container">
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

        {/* Right Group: Controls & Profile Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Desktop Language Selector */}
          <div className="hidden md:flex items-center bg-primary-container/80 px-2 py-1 rounded-lg border border-primary-fixed-dim/20 text-xs">
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
                {userEmail || 'Amina Hassan'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim">arrow_drop_down</span>
            </button>

            {/* Profile Popover Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl py-2 z-50 text-on-surface">
                <div className="px-4 py-2 border-b border-outline-variant/60">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs font-semibold truncate text-on-surface">{userEmail || 'amina.hassan@example.com'}</p>
                </div>

                {/* Switch Workspace Section */}
                <div className="px-2 py-2">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider px-2 mb-1">Switch Portal</p>
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
  );
}
