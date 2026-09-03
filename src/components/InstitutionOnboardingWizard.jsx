import React, { useState } from 'react';

export default function InstitutionOnboardingWizard({ userEmail, onComplete, onBack }) {
  // Classification State
  const [institutionType, setInstitutionType] = useState('council');
  const [ukprn, setUkprn] = useState('10048291');
  const [region, setRegion] = useState('West Midlands Combined Authority (WMCA)');

  // Funding Stream State
  const [fundingStream, setFundingStream] = useState('UK Shared Prosperity Fund (UKSPF) - People & Skills');
  const [grantRef, setGrantRef] = useState('UKSPF-WMCA-2024-C88');
  const [fundingCycle, setFundingCycle] = useState('2024-2026 Multi-Year Allocation');
  const [grantAllocation, setGrantAllocation] = useState('480,000');

  // Demographics Tags
  const [demographics, setDemographics] = useState([
    'Women Returners',
    'Career Changers',
    'Neurodivergent Individuals',
    'Long-term Unemployed (18-24 NEET)'
  ]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');

  // Statutory Governance Checkboxes
  const [governance, setGovernance] = useState({
    psed: true,
    section115: true,
    gdprProtocol: true,
    scrutinyExport: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const institutionTypes = [
    {
      id: 'council',
      icon: 'apartment',
      title: 'Local Council / Authority',
      desc: 'County, Borough, Metropolitan, or Unitary Council'
    },
    {
      id: 'fe_college',
      icon: 'school',
      title: 'Further Education College / HEI',
      desc: 'Post-16 FE College, Skills Academy or University Hub'
    },
    {
      id: 'cic',
      icon: 'group_work',
      title: 'Community Interest Company (CIC)',
      desc: 'Social Enterprise / Community Employability Provider'
    },
    {
      id: 'dwp_partner',
      icon: 'handshake',
      title: 'DWP / Combined Authority Partner',
      desc: 'Tier 1 or Tier 2 Prime Skills & Employment Contractor'
    }
  ];

  const handleAddDemographic = (e) => {
    e.preventDefault();
    if (newTagText.trim()) {
      setDemographics(prev => [...prev, newTagText.trim()]);
      setNewTagText('');
      setIsAddingTag(false);
    }
  };

  const removeDemographic = (tag) => {
    setDemographics(prev => prev.filter(t => t !== tag));
  };

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          institutionType,
          ukprn,
          region,
          fundingStream,
          grantRef,
          grantAllocation,
          demographics
        });
      }
    }, 800);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-surface-variant selection:text-primary">
      {/* Linear Task Shell Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Left: Logo & Context Tag */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary tracking-tight leading-tight">BloomingPath</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-primary border border-outline-variant/40 uppercase tracking-wider">
                    Institutional
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">UK Partner Onboarding Portal</p>
              </div>
            </div>
          </div>

          {/* Center: High-Level Stepper */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40">
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
              <span className="text-xs text-on-surface font-medium">Step 2 of 4:</span>
              <span className="text-xs text-primary font-bold">Institution Mandate &amp; Governance</span>
            </div>
          </div>

          {/* Right: Help / Support CTA */}
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Exit to Home
              </button>
            )}
            <button 
              onClick={() => alert('Public Sector Institutional Support desk: cabinet-partners@bloomingpath.gov.uk | +44 020 7946 0912')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors text-xs font-semibold border border-outline-variant/40 bg-surface-container-lowest shadow-sm" 
              type="button"
            >
              <span className="material-symbols-outlined text-lg">help_outline</span>
              <span>Institutional Support</span>
            </button>
          </div>
        </div>

        {/* Stepper Visual Progress Track */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-3">
          <div className="grid grid-cols-4 gap-3 pt-1">
            <div className="flex flex-col gap-1.5">
              <div className="h-1.5 w-full rounded-full bg-secondary"></div>
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="text-xs font-medium">1. Lead Contact</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-1.5 w-full rounded-full bg-primary-container"></div>
              <div className="flex items-center gap-1.5 text-primary">
                <span className="w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="text-xs font-bold">2. Mandate &amp; Governance</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 opacity-60">
              <div className="h-1.5 w-full rounded-full bg-surface-container-high"></div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-medium">3</span>
                <span className="text-xs">3. Funding Cohorts</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 opacity-60">
              <div className="h-1.5 w-full rounded-full bg-surface-container-high"></div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-medium">4</span>
                <span className="text-xs">4. Data Sharing &amp; Outcomes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-8">
        
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container flex items-center gap-3 animate-fadeIn">
            <span className="material-symbols-outlined text-2xl">verified</span>
            <div>
              <p className="font-bold text-sm">Institutional Mandate Configured Successfully</p>
              <p className="text-xs opacity-90">Redirecting to Institutional Partner Portal...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Form Column (8 Cols) */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Header Banner */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold mb-3">
                <span className="material-symbols-outlined text-base">assured_workload</span>
                Statutory Public Sector &amp; DWP Grant Compliance
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">Set Up Your Institutional Mandate</h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Configure funding streams, delivery cohorts, and statutory reporting frameworks to evidence employment outcomes for your local authority or education partnership.
              </p>
            </div>

            {/* Section 1: UK Institutional Classification */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Institutional Classification &amp; Accreditation</h2>
                    <p className="text-xs text-on-surface-variant">Identify your organisation category and UK Register validation</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container-high text-primary">Required</span>
              </div>

              {/* Type Selector Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-on-surface">Select Institutional Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {institutionTypes.map((t) => {
                    const isSelected = institutionType === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setInstitutionType(t.id)}
                        className={`relative flex p-4 rounded-lg cursor-pointer transition-all border-2 select-none ${
                          isSelected
                            ? 'border-primary bg-surface-container-low shadow-sm'
                            : 'border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <span className={`material-symbols-outlined text-2xl mt-0.5 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {t.icon}
                          </span>
                          <div className="flex-1">
                            <span className={`block text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                              {t.title}
                            </span>
                            <span className="block text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                              {t.desc}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UKPRN & Local Authority Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="ukprn-input">UKPRN / Authority Code</label>
                  <div className="relative">
                    <input 
                      className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm outline-none" 
                      id="ukprn-input" 
                      placeholder="e.g. 10048291" 
                      type="text" 
                      value={ukprn}
                      onChange={(e) => setUkprn(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 flex items-center text-secondary">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-secondary">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    <span className="text-[11px] font-bold tracking-wide">UKPRN: {ukprn} - Verified via UKRLP</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="region-select">Operating Authority / Region</label>
                  <select 
                    className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm bg-surface-container-lowest outline-none cursor-pointer" 
                    id="region-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option>West Midlands Combined Authority (WMCA)</option>
                    <option>Greater London Authority (GLA)</option>
                    <option>Greater Manchester Combined Authority (GMCA)</option>
                    <option>Nottinghamshire County Council</option>
                    <option>West Yorkshire Combined Authority (WYCA)</option>
                    <option>North East Combined Authority</option>
                  </select>
                  <p className="text-[11px] text-on-surface-variant mt-1">Pre-populates regional qualification &amp; devolution metric standards</p>
                </div>
              </div>
            </div>

            {/* Section 2: Statutory Funding Streams & Grant Allocation */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Statutory Funding Streams &amp; Grant Allocation</h2>
                    <p className="text-xs text-on-surface-variant">Map grant contracts for milestone evidencing &amp; claim exports</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container-high text-primary">Auditable</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="funding-stream-select">Primary Funding Stream</label>
                  <select 
                    className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm bg-surface-container-lowest outline-none cursor-pointer" 
                    id="funding-stream-select"
                    value={fundingStream}
                    onChange={(e) => setFundingStream(e.target.value)}
                  >
                    <option>UK Shared Prosperity Fund (UKSPF) - People &amp; Skills</option>
                    <option>Adult Education Budget (AEB Devolution)</option>
                    <option>DWP Work and Health Programme</option>
                    <option>Local Skills Improvement Plan (LSIP) Priority Fund</option>
                    <option>National Lottery Community Fund (Building Better Opportunities)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="grant-ref-input">Grant Agreement Reference ID</label>
                  <input 
                    className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm outline-none" 
                    id="grant-ref-input" 
                    placeholder="e.g. UKSPF-WMCA-2024-C88" 
                    type="text" 
                    value={grantRef}
                    onChange={(e) => setGrantRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="funding-cycle-select">Funding Cycle Window</label>
                  <select 
                    className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm bg-surface-container-lowest outline-none cursor-pointer" 
                    id="funding-cycle-select"
                    value={fundingCycle}
                    onChange={(e) => setFundingCycle(e.target.value)}
                  >
                    <option>2024-2026 Multi-Year Allocation</option>
                    <option>2024-2025 Single Academic Year</option>
                    <option>2025-2027 Strategic Commissioning</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface" htmlFor="grant-allocation-input">Total Grant Cohort Allocation</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-on-surface-variant font-bold">£</span>
                    <input 
                      className="w-full rounded-lg border border-outline-variant pl-8 pr-4 py-3 text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm outline-none font-semibold" 
                      id="grant-allocation-input" 
                      type="text" 
                      value={grantAllocation}
                      onChange={(e) => setGrantAllocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Target Demographics Chips */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-on-surface">Target Cohort Demographics (Select all that apply for ESFA / DWP metrics)</label>
                <div className="flex flex-wrap gap-2 pt-1 items-center">
                  {demographics.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary-container text-xs font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">done</span>
                      {tag}
                      <button 
                        type="button"
                        onClick={() => removeDemographic(tag)}
                        className="hover:opacity-75 ml-0.5 text-xs font-bold"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {isAddingTag ? (
                    <form onSubmit={handleAddDemographic} className="inline-flex items-center gap-1">
                      <input 
                        type="text"
                        autoFocus
                        value={newTagText}
                        onChange={(e) => setNewTagText(e.target.value)}
                        placeholder="Tag name..."
                        className="px-2.5 py-1 text-xs rounded-full border border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button type="submit" className="px-2 py-1 bg-primary text-on-primary rounded-full text-xs font-bold">Add</button>
                      <button type="button" onClick={() => setIsAddingTag(false)} className="px-2 py-1 text-xs text-on-surface-variant">Cancel</button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setIsAddingTag(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary text-xs transition-colors" 
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add Demographic Tag
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Statutory Governance, GDPR & Public Sector Compliance */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Statutory Governance &amp; UK Data Compliance</h2>
                    <p className="text-xs text-on-surface-variant">Mandatory legal declarations for public sector scrutiny</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-base">gavel</span>
                  Statutory
                </div>
              </div>

              <div className="space-y-4">
                {/* PSED Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <input 
                    checked={governance.psed} 
                    onChange={(e) => setGovernance(g => ({ ...g, psed: e.target.checked }))}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <div className="space-y-0.5 text-xs leading-relaxed">
                    <span className="block font-bold text-on-surface">Public Sector Equality Duty (PSED - Equality Act 2010)</span>
                    <span className="block text-on-surface-variant">
                      We confirm this programme satisfies the general duty to eliminate unlawful discrimination, advance equality of opportunity, and foster good relations across protected characteristics.
                    </span>
                  </div>
                </label>

                {/* Section 115 Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <input 
                    checked={governance.section115} 
                    onChange={(e) => setGovernance(g => ({ ...g, section115: e.target.checked }))}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <div className="space-y-0.5 text-xs leading-relaxed">
                    <span className="block font-bold text-on-surface">Section 115 Crime and Disorder / Employability Gateway Agreement</span>
                    <span className="block text-on-surface-variant">
                      Authorization to share referral data securely across multi-agency hubs (Jobcentre Plus, Youth Offending Teams, Local Authority Employment Support units).
                    </span>
                  </div>
                </label>

                {/* UK GDPR Controller-to-Processor */}
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <input 
                    checked={governance.gdprProtocol} 
                    onChange={(e) => setGovernance(g => ({ ...g, gdprProtocol: e.target.checked }))}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <div className="space-y-0.5 text-xs leading-relaxed">
                    <span className="block font-bold text-on-surface">UK GDPR Controller-to-Processor Protocol (Participant Grant Audit)</span>
                    <span className="block text-on-surface-variant">
                      Consent records, learner progression milestones, and outcome tracking will be processed in accordance with the Data Protection Act 2018 for ESFA/DWP verification.
                    </span>
                  </div>
                </label>

                {/* Audit & Evidencing agreement */}
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <input 
                    checked={governance.scrutinyExport} 
                    onChange={(e) => setGovernance(g => ({ ...g, scrutinyExport: e.target.checked }))}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                    type="checkbox"
                  />
                  <div className="space-y-0.5 text-xs leading-relaxed">
                    <span className="block font-bold text-on-surface">Automated Scrutiny Export Agreement</span>
                    <span className="block text-on-surface-variant">
                      We authorize BloomingPath to generate pre-formatted CSV and XML outcome audit packets for direct upload to Government Gateway and Local Authority audit panels.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Action Bar */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={onBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors" 
                type="button"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Step 1
              </button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSaveAndContinue}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary text-xs font-semibold" 
                  type="button"
                >
                  Save Draft
                </button>
                <button 
                  onClick={handleSaveAndContinue}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-all shadow-sm" 
                  type="button"
                >
                  Save &amp; Continue to Programme Setup
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

          </section>

          {/* Right Sidebar: Impact Framework & Live Preview (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Live Cohort Dashboard Preview Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-lg text-primary">insights</span>
                  <span>Live Cohort Preview</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container uppercase tracking-wider">
                  Active Stream
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Based on your {region.split('(')[0].trim() || 'Regional'} allocation, here is how candidate milestone tracking is structured:
              </p>
              <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Estimated Cohort Size:</span>
                  <span className="text-primary font-bold">140 Participants</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Target Employment Rate:</span>
                  <span className="text-secondary font-bold">78% sustained (&gt;16 wks)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Reporting Cadence:</span>
                  <span className="text-on-surface font-semibold">Bi-weekly DWP Extract</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
                  <span>Readiness Milestones</span>
                  <span className="font-bold text-primary">75% Audit Compliant</span>
                </div>
              </div>
            </div>

            {/* Grant-Ready Audit Trails */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Grant-Ready Audit Trails</h3>
                  <p className="text-[11px] text-on-surface-variant">ESFA, DWP &amp; UKSPF standards</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All learner progression markers, interview attendance records, and placement verifications are digitally watermarked for single-click compliance inspection.
              </p>
              <ul className="space-y-2 text-xs text-on-surface">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span>
                  Automated ILR (Individualised Learner Record) XML
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span>
                  Annex 3 UKSPF Expenditure &amp; Output Breakdown
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">check</span>
                  HMRC Real Time Information (RTI) job validation
                </li>
              </ul>
            </div>

            {/* Regional Sector Priority */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Local Skills Alignment</h3>
                  <p className="text-[11px] text-on-surface-variant">LSIP Regional Priorities</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Learner pathways will automatically synchronize with registered vacancy gaps:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded bg-surface-container text-xs font-semibold text-primary">NHS Healthcare Support</span>
                <span className="px-2.5 py-1 rounded bg-surface-container text-xs font-semibold text-primary">Primary Education</span>
                <span className="px-2.5 py-1 rounded bg-surface-container text-xs font-semibold text-primary">Green Construction</span>
              </div>
            </div>

            {/* Dedicated Account Director Card */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/50 shadow-sm flex items-start gap-3.5">
              <img 
                className="w-12 h-12 rounded-full object-cover border border-outline-variant" 
                alt="Marcus Thorne, UK Public Sector Partnerships Advisor"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvzzf-ow04VDdVRkH43uHte09tVebyc7OkjtQXSDvQjj7O8u-z_p8LvVwPNg3JRaY6yvOg7nQLsV6zjizDbwScerB-v38S8D_Rw6puxHxvCbv6kPAb0SX5EL_YLs2mqLodu7Vylt3UghvzHJacIF52l-ulwlGqcHXFlhmmw44TJgBpMmqCXrQheVjMdfK4Co9ZzkflXDZmSE58MtJHqHZHkudkBoXzDEIJ9fz7aRXqAHR-RClMcwb4w"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-on-surface">Marcus Thorne</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container-high text-primary font-bold">Cabinet Lead</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-tight">Your Assigned Public Sector Advisor</p>
                <a 
                  className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline pt-1" 
                  href="mailto:marcus.thorne@bloomingpath.gov.uk"
                  onClick={(e) => { e.preventDefault(); alert('Briefing scheduled request sent to marcus.thorne@bloomingpath.gov.uk'); }}
                >
                  <span className="material-symbols-outlined text-xs">mail</span>
                  Schedule Council Briefing
                </a>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/40 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-primary">BloomingPath Institutional Portal</span>
            <span>•</span>
            <span>HM Government Crown Commercial Service Supplier</span>
            <span>•</span>
            <span>Cyber Essentials Plus Certified</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a className="hover:text-primary transition-colors" href="#framework">Framework Agreement</a>
            <a className="hover:text-primary transition-colors" href="#dpa">Information Governance &amp; DPA</a>
            <a className="hover:text-primary transition-colors" href="#foi">FOI Requests</a>
            <a className="hover:text-primary transition-colors" href="#accessibility">Accessibility (WCAG 2.1 AA)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
