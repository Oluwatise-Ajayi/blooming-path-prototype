import React from 'react';

export default function IndividualProfileModal({ candidate, onClose, onInviteInterview }) {
  if (!candidate) return null;

  // Fallback defaults if candidate properties are partial
  const profileName = candidate.name || candidate.alias || 'Amina Hassan';
  const profileRole = candidate.pathwayLabel || 'Customer Service Associate';
  const avatarUrl = candidate.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr0moT1iKvNUVfGjN9Dfhs6eqB0fZ2Oh7YrM_C-3qYIHA8sHD75zhB4lo1CrYj4h2c4csIYi7SYq9s96lQNOERD09TPEAXojG3x_YAYpDXgbhDwZ_9AX_FDhgTBaXM1onzonD8KlsdwrUzONeHX0eOsrFGXFjUquNU66yvIpqJGj7GMcrzRawKxlJEvuJNT0T7_CF-g0AweLmAe8uYaL_Hdc6BfsS0WGgO9Rva_wa0ei2Ngoj5NwXdhQ';
  const locationText = candidate.location || 'London, UK';
  const readinessValue = candidate.readinessScore || 88;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-on-background/60 backdrop-blur-sm flex flex-col animate-fadeIn">
      
      {/* Sticky Top Header Section */}
      <header className="bg-surface border-b border-outline-variant px-4 md:px-10 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low transition-colors group"
            title="Go back"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[24px]">
              arrow_back
            </span>
          </button>

          <div>
            <h1 className="text-base md:text-lg font-bold text-on-surface">Individual Profile: {profileName}</h1>
            <p className="text-xs text-on-surface-variant">{profileRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-xs font-bold border border-secondary/30">
            Interview Ready
          </span>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full text-xs font-bold"
          >
            ✕ Close
          </button>
        </div>
      </header>

      {/* Main Canvas Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-10 py-6 md:py-8 space-y-6">
        
        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Profile Summary Card (Spans 4 cols on desktop) */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-surface-container-high shadow-md">
              <img className="w-full h-full object-cover" src={avatarUrl} alt={profileName} />
            </div>

            <h2 className="text-xl font-bold text-on-surface mb-1">{profileName}</h2>
            <p className="text-xs text-on-surface-variant flex items-center justify-center gap-1 mb-4">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              {locationText}
            </p>

            <div className="w-full mt-2 pt-4 border-t border-outline-variant/60 flex justify-around">
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Experience</p>
                <p className="text-lg font-bold text-primary">3 yrs</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Available</p>
                <p className="text-lg font-bold text-primary">Immed.</p>
              </div>
            </div>
          </div>

          {/* Readiness & Metrics Bento (Spans 8 cols on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Overall Readiness */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm flex flex-col justify-center items-center">
              <h3 className="text-xs font-semibold text-on-surface-variant mb-3 w-full text-left">Readiness Score</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-surface-container-highest" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"></circle>
                  <circle className="text-secondary" strokeWidth="8" strokeDasharray="251.3" strokeDashoffset={251.3 * (1 - readinessValue / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-on-surface">{readinessValue}%</span>
                  <span className="text-[11px] font-bold text-secondary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +5.2%
                  </span>
                </div>
              </div>
            </div>

            {/* Communication Score */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold text-on-surface-variant">Communication</h3>
                  <span className="material-symbols-outlined text-outline text-[20px]">forum</span>
                </div>
                <p className="text-2xl font-bold text-on-surface mt-2">Excellent</p>
              </div>
              <div className="mt-4 w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            {/* Simulation Completion */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold text-on-surface-variant">Simulation</h3>
                  <span className="material-symbols-outlined text-outline text-[20px]">sports_esports</span>
                </div>
                <p className="text-2xl font-bold text-on-surface mt-2">95%</p>
              </div>
              <div className="mt-4 w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            {/* AI Assessment Summary (Spans 3 cols) */}
            <div className="md:col-span-3 bg-surface-container-low rounded-2xl border border-outline-variant p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
              <div className="relative z-10 flex gap-4 items-start">
                <div className="bg-surface p-2.5 rounded-xl shadow-sm border border-outline-variant/60 shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">AI Assessment Summary</h3>
                  <p className="text-xs md:text-sm text-on-surface leading-relaxed italic">
                    "Strong fit for customer-facing roles with high empathy and communication skills. Recommended for immediate interview."
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Details & Pathways Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Professional Profile */}
          <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-base font-bold text-on-surface border-b border-outline-variant/60 pb-3">Professional Profile</h3>
            
            {/* Languages */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">translate</span>
                Languages
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-xs font-medium text-on-surface bg-surface-container-low/50 px-3 py-2 rounded-lg">
                  <span>English</span>
                  <span className="text-on-surface-variant font-bold">Fluent</span>
                </li>
                <li className="flex justify-between items-center text-xs font-medium text-on-surface bg-surface-container-low/50 px-3 py-2 rounded-lg">
                  <span>Arabic</span>
                  <span className="text-on-surface-variant font-bold">Native</span>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                Certifications
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">workspace_premium</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Customer Excellence</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">BloomingPath Verified</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">devices</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Digital Literacy 101</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">BloomingPath Certified</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Key Skills */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface-variant text-on-surface rounded-full text-xs font-medium border border-outline-variant/50">
                  Conflict Resolution
                </span>
                <span className="px-3 py-1 bg-surface-variant text-on-surface rounded-full text-xs font-medium border border-outline-variant/50">
                  CRM Management
                </span>
                <span className="px-3 py-1 bg-surface-variant text-on-surface rounded-full text-xs font-medium border border-outline-variant/50">
                  Active Listening
                </span>
              </div>
            </div>
          </div>

          {/* Learning Pathways */}
          <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-bold text-on-surface border-b border-outline-variant/60 pb-3">Learning Pathways</h3>
            
            <div className="space-y-4 mt-1">
              {/* Course 1 */}
              <div className="group relative flex gap-4 p-4 rounded-xl border border-outline-variant/60 hover:border-primary transition-all bg-surface-container-lowest shadow-sm">
                <div className="shrink-0 w-12 h-12 bg-secondary-container/40 rounded-xl flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Customer Relations 101</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">Completed modules on foundational customer service skills.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-grow bg-surface-container-highest rounded-full h-1.5">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-secondary">Completed</span>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="group relative flex gap-4 p-4 rounded-xl border border-outline-variant/60 hover:border-primary transition-all bg-surface-container-lowest shadow-sm">
                <div className="shrink-0 w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">computer</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Digital Support Systems</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">Mastery of modern ticketing and CRM platforms.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-grow bg-surface-container-highest rounded-full h-1.5">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-secondary">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Action Footer (Sticky at Bottom) */}
      <footer className="bg-surface border-t border-outline-variant p-4 md:px-10 sticky bottom-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="hidden md:block">
            <p className="text-xs font-bold text-on-surface">Ready for next steps?</p>
            <p className="text-[11px] text-on-surface-variant">Engage candidate or save profile for team review.</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <button
              onClick={() => alert("Profile Saved to Employer Bookmarks.")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-on-surface font-bold text-xs hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">bookmark</span> Save
            </button>
            <button
              onClick={() => alert("Requested Candidate Dossier from Institutional Partner.")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-on-surface font-bold text-xs hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">info</span> Request Info
            </button>
            <button
              onClick={() => {
                if (onInviteInterview) onInviteInterview(candidate.id || 'BP-8842');
                alert(`Interview Invitation sent to ${profileName}!`);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span> Invite to Interview
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
