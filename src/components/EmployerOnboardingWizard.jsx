import React, { useState } from 'react';

export default function EmployerOnboardingWizard({ userEmail, onComplete, onBack }) {
  // Form State
  const [orgName, setOrgName] = useState('Midlands Partnership NHS University Foundation Trust');
  const [regNumber, setRegNumber] = useState('ODS-R1A-NHSUK');
  const [sector, setSector] = useState('Healthcare & Social Care (NHS / Integrated Care Systems)');
  const [leadContact, setLeadContact] = useState('Dr. Sarah Jenkins');
  const [leadRole, setLeadRole] = useState('Head of Clinical Workforce & Talent Acquisition');
  
  // Operating Regions State
  const [selectedRegions, setSelectedRegions] = useState(['West Midlands', 'East Midlands']);
  const availableRegions = [
    'West Midlands',
    'East Midlands',
    'Greater Manchester & North West',
    'Greater London',
    'Yorkshire & The Humber',
    'Nationwide / Remote Support'
  ];

  // Pathways Selection State
  const [pathways, setPathways] = useState({
    wardAdmin: true,
    patientExp: true,
    classroom: false
  });

  // Verification & Compliance State
  const [readinessThreshold, setReadinessThreshold] = useState(80);
  const [requireDBS, setRequireDBS] = useState(true);
  const [requireBPSS, setRequireBPSS] = useState(true);
  const [icoNumber, setIcoNumber] = useState('ZA928174 / Tier 3 Controller');
  const [dpoEmail, setDpoEmail] = useState('dpo-compliance@mpft.nhs.uk');
  
  // Mandatory Declarations
  const [declarations, setDeclarations] = useState({
    blindScreening: true,
    gdprDPA: true,
    socialValue: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleRegion = (region) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          orgName,
          regNumber,
          sector,
          readinessThreshold,
          selectedRegions
        });
      }
    }, 800);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      {/* Header Shell: Transactional Onboarding Top Bar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Brand & Flow Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <div>
                <span className="text-lg font-bold text-primary tracking-tight block leading-tight">BloomingPath</span>
                <span className="block text-xs text-on-surface-variant font-normal">Employer Readiness Portal</span>
              </div>
            </div>
            <div className="hidden md:block h-6 w-px bg-outline-variant/50 mx-1"></div>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-xs text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Employer Partner Onboarding
            </span>
          </div>

          {/* Linear Stepper Navigation Indicator */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs text-on-surface-variant line-through opacity-70">1. Account &amp; Admin</span>
            </div>
            <div className="w-8 h-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary font-bold">2. UK Entity &amp; Verification</span>
                <span className="text-[11px] text-secondary font-medium">In Progress</span>
              </div>
            </div>
            <div className="w-8 h-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-xs text-on-surface-variant">3. Hiring Pathways</span>
            </div>
            <div className="w-8 h-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">
                4
              </div>
              <span className="text-xs text-on-surface-variant">4. DPA &amp; Terms</span>
            </div>
          </div>

          {/* Action & Support */}
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Exit to Home
              </button>
            )}
            <a 
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary text-xs font-medium transition-colors" 
              href="#support"
              onClick={(e) => { e.preventDefault(); alert('Our UK Employer verification liaisons are available Mon-Fri 08:00 - 18:00 GMT at employers@bloomingpath.gov.uk'); }}
            >
              <span className="material-symbols-outlined text-[18px]">contact_support</span>
              <span className="hidden sm:inline">Verification Support</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-10">
        {/* Title Area */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary mb-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            Stage 2 of 4 • Official Institution Onboarding
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Verify your UK Organization</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-3xl">
            Complete institutional validation to access de-identified candidate pipelines, verified skill benchmarks, and automated Crown Commercial / Social Value compliance reporting.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container flex items-center gap-3 animate-fadeIn">
            <span className="material-symbols-outlined text-2xl">verified</span>
            <div>
              <p className="font-bold text-sm">Entity Verified Successfully</p>
              <p className="text-xs opacity-90">Redirecting to Employer Hub dashboard...</p>
            </div>
          </div>
        )}

        {/* 2-Column Content Grid: Form Canvas & Benefit/Live Preview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Multi-section Verification Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 1: UK Corporate Identity & Verification */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">domain</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">1. UK Corporate Identity &amp; Regulatory Verification</h2>
                    <p className="text-xs text-on-surface-variant">Validated via Companies House &amp; NHS Trust Directory APIs</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-container/30 text-on-secondary-container text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  API Synced
                </span>
              </div>

              <div className="space-y-5">
                {/* Organization Legal Name */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="org-name">
                    Organization Legal Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                      id="org-name" 
                      type="text" 
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 flex items-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                    Matched with Official UK NHS Trust Provider List (ODS Code: R1A)
                  </p>
                </div>

                {/* 2-col ID & Sector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="reg-number">
                      Registration / NHS / Charity Number <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                        id="reg-number" 
                        type="text" 
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                      />
                      <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        Live Verified
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="sector">
                      Primary Sector <span className="text-error">*</span>
                    </label>
                    <select 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none cursor-pointer" 
                      id="sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                    >
                      <option>Healthcare &amp; Social Care (NHS / Integrated Care Systems)</option>
                      <option>Primary &amp; Secondary Education (Multi-Academy Trusts)</option>
                      <option>Public Sector &amp; Municipal Borough Councils</option>
                      <option>Commercial, Digital &amp; Admin Enterprises</option>
                      <option>Hospitality, Facilities &amp; Retail Services</option>
                    </select>
                  </div>
                </div>

                {/* Operating Regions */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2">
                    Primary Operating Regions in UK (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableRegions.map((region) => {
                      const isSelected = selectedRegions.includes(region);
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-primary-container text-on-primary shadow-sm'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          <span>{region}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Lead */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="contact-name">
                      Authorized Lead Contact <span className="text-error">*</span>
                    </label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                      id="contact-name" 
                      type="text" 
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="contact-role">
                      Official Role / Department <span className="text-error">*</span>
                    </label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                      id="contact-role" 
                      type="text" 
                      value={leadRole}
                      onChange={(e) => setLeadRole(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Talent Pathways & Hiring Criteria */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm">
              <div className="border-b border-outline-variant/30 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">route</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">2. Talent Pathways &amp; Verified Readiness Rubrics</h2>
                    <p className="text-xs text-on-surface-variant">Define threshold criteria for de-identified candidate shortlists</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="block text-xs font-bold text-on-surface mb-3">
                    Target Capability Pathways to Activate Now
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Pathway Card 1 */}
                    <div 
                      onClick={() => setPathways(prev => ({ ...prev, wardAdmin: !prev.wardAdmin }))}
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                        pathways.wardAdmin
                          ? 'border-primary-container bg-surface-container-low/60'
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">local_hospital</span>
                        <input 
                          checked={pathways.wardAdmin} 
                          readOnly
                          className="rounded text-primary-container focus:ring-primary-container w-4 h-4 pointer-events-none" 
                          type="checkbox"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Ward &amp; Clinic Admin</span>
                      <span className="text-[11px] text-on-surface-variant mt-1">EPR systems, patient confidentiality, triage booking</span>
                      <span className="mt-3 inline-flex items-center text-[11px] font-bold text-secondary">
                        42 Verified candidates ready
                      </span>
                    </div>

                    {/* Pathway Card 2 */}
                    <div 
                      onClick={() => setPathways(prev => ({ ...prev, patientExp: !prev.patientExp }))}
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                        pathways.patientExp
                          ? 'border-primary-container bg-surface-container-low/60'
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">support_agent</span>
                        <input 
                          checked={pathways.patientExp} 
                          readOnly
                          className="rounded text-primary-container focus:ring-primary-container w-4 h-4 pointer-events-none" 
                          type="checkbox"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Patient Experience &amp; Desk</span>
                      <span className="text-[11px] text-on-surface-variant mt-1">Escalation handling, empathetic triage, record lookup</span>
                      <span className="mt-3 inline-flex items-center text-[11px] font-bold text-secondary">
                        31 Verified candidates ready
                      </span>
                    </div>

                    {/* Pathway Card 3 */}
                    <div 
                      onClick={() => setPathways(prev => ({ ...prev, classroom: !prev.classroom }))}
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                        pathways.classroom
                          ? 'border-primary-container bg-surface-container-low/60'
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-[22px]">school</span>
                        <input 
                          checked={pathways.classroom} 
                          readOnly
                          className="rounded text-primary-container focus:ring-primary-container w-4 h-4 pointer-events-none" 
                          type="checkbox"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface">School &amp; Classroom Support</span>
                      <span className="text-[11px] text-on-surface-variant mt-1">Safeguarding Level 1, student behavioral logging</span>
                      <span className="mt-3 inline-flex items-center text-[11px] font-medium text-on-surface-variant">
                        19 Candidates in pipeline
                      </span>
                    </div>
                  </div>
                </div>

                {/* Readiness Threshold Slider & DBS Flag */}
                <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-on-surface">Minimum Verified Readiness Threshold</span>
                      <p className="text-[11px] text-on-surface-variant">Candidates must score at or above this simulated benchmark score.</p>
                    </div>
                    <div className="px-3 py-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-primary font-bold text-lg">
                      {readinessThreshold}%
                    </div>
                  </div>
                  <input 
                    className="w-full accent-primary h-2 bg-outline-variant/40 rounded-lg cursor-pointer" 
                    max="95" 
                    min="60" 
                    type="range" 
                    value={readinessThreshold}
                    onChange={(e) => setReadinessThreshold(Number(e.target.value))}
                  />
                  <div className="pt-2 border-t border-outline-variant/30 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-on-surface font-medium">
                      <input 
                        checked={requireDBS} 
                        onChange={(e) => setRequireDBS(e.target.checked)}
                        className="rounded text-primary-container focus:ring-primary-container w-4 h-4" 
                        type="checkbox"
                      />
                      <span>Require Enhanced DBS Clearance on file</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-on-surface font-medium">
                      <input 
                        checked={requireBPSS} 
                        onChange={(e) => setRequireBPSS(e.target.checked)}
                        className="rounded text-primary-container focus:ring-primary-container w-4 h-4" 
                        type="checkbox"
                      />
                      <span>Require BPSS (Baseline Personnel Security Standard)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: UK Data Protection & GDPR/ICO Compliance */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm">
              <div className="border-b border-outline-variant/30 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">policy</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">3. UK Data Protection, ICO &amp; Blind Talent Protocols</h2>
                    <p className="text-xs text-on-surface-variant">Compliant with UK Data Protection Act 2018 &amp; UK GDPR Article 28</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* ICO Registration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="ico-num">
                      Information Commissioner’s Office (ICO) Tier / Number <span className="text-error">*</span>
                    </label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                      id="ico-num" 
                      type="text" 
                      value={icoNumber}
                      onChange={(e) => setIcoNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="dpo-email">
                      Designated Data Protection Officer (DPO) Email <span className="text-error">*</span>
                    </label>
                    <input 
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 text-xs sm:text-sm text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none" 
                      id="dpo-email" 
                      type="email" 
                      value={dpoEmail}
                      onChange={(e) => setDpoEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mandatory Legal Declarations */}
                <div className="p-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/30 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      checked={declarations.blindScreening} 
                      onChange={(e) => setDeclarations(d => ({ ...d, blindScreening: e.target.checked }))}
                      className="mt-1 rounded text-primary-container focus:ring-primary-container w-4 h-4" 
                      type="checkbox"
                    />
                    <div className="text-xs text-on-surface leading-relaxed">
                      <span className="font-bold">Mandatory Blind Screening &amp; Anti-Bias Commitment:</span>{' '}
                      I confirm our recruitment teams will evaluate candidates on validated practical capability rubrics without demanding un-redacted personal identifiable information (name, address, age, gender) prior to formal interview scheduling.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      checked={declarations.gdprDPA} 
                      onChange={(e) => setDeclarations(d => ({ ...d, gdprDPA: e.target.checked }))}
                      className="mt-1 rounded text-primary-container focus:ring-primary-container w-4 h-4" 
                      type="checkbox"
                    />
                    <div className="text-xs text-on-surface leading-relaxed">
                      <span className="font-bold">UK GDPR Article 28 Data Processing Addendum:</span>{' '}
                      I agree to the BloomingPath Master Data Processing Agreement (DPA) acting as Data Controller with BloomingPath as Data Processor for pre-employment skill simulation logs.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      checked={declarations.socialValue} 
                      onChange={(e) => setDeclarations(d => ({ ...d, socialValue: e.target.checked }))}
                      className="mt-1 rounded text-primary-container focus:ring-primary-container w-4 h-4" 
                      type="checkbox"
                    />
                    <div className="text-xs text-on-surface leading-relaxed">
                      <span className="font-bold">Public Services (Social Value) Act 2012 Consent:</span>{' '}
                      Allow aggregated, anonymized hiring outcome metrics to be cataloged for local authority social mobility and levelling-up audits.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Flow Footer Controls */}
            <div className="flex items-center justify-between pt-4 pb-12">
              <button 
                onClick={handleSaveAndContinue}
                className="px-5 py-2.5 rounded-lg border border-outline-variant/60 text-on-surface hover:bg-surface-container text-xs font-semibold transition-colors flex items-center gap-2" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Progress &amp; Exit
              </button>
              <button 
                onClick={handleSaveAndContinue}
                className="px-6 py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-bold shadow transition-all flex items-center gap-2" 
                type="button"
              >
                <span>Agree &amp; Continue to Pathway Setup</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

          </div>

          {/* Right 4 Columns: Employer Trust Anchor & Live Verification Badge */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Live Preview Verification Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Verified Badge Preview</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-low/60 border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                    {orgName.includes('NHS') ? 'NHS' : orgName.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface truncate">{orgName}</h4>
                    <p className="text-[11px] text-on-surface-variant truncate">{selectedRegions.join(', ') || 'UK Regional Partner'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded bg-surface-container-lowest">
                    <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Entity Status</span>
                    <span className="text-xs font-bold text-secondary flex items-center justify-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-lowest">
                    <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Min. Score</span>
                    <span className="text-xs font-bold text-primary mt-0.5 block">{readinessThreshold}% Required</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant text-center mt-3">
                This verification seal appears to candidates on job opportunities &amp; blind shortlists.
              </p>
            </div>

            {/* Pillar Value Prop Cards */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm space-y-5">
              <h3 className="text-xs text-on-surface font-bold uppercase tracking-wider">
                Why UK Employers Partner with BloomingPath
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">100% Verified Capability</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Zero generic CV screening. Every talent referral is backed by 4+ hours of realistic workplace scenario execution.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Fair Hiring &amp; Anti-Bias Shield</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Blind evaluation guarantees hiring on observable competency, ensuring compliance with Equality Act 2010 mandates.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Social Value Act Compliant</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Direct data exports quantifying community impact and local workforce integration for public sector tender scoring.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Callout Box */}
              <div className="mt-6 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">security</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Encrypted with UK Crown-accredited TLS 1.3 standards. Registered with the UK Information Commissioner's Office (Ref: BP-849103).
                </p>
              </div>
            </div>

            {/* Direct Support Help Card */}
            <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-primary text-[28px]">headset_mic</span>
              <h4 className="text-xs font-bold text-on-surface mt-1">Need help with NHS / Academy verification?</h4>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                Our UK onboarding liaisons can verify your regulatory codes manually within 1 business hour.
              </p>
              <button 
                onClick={() => alert('Support request submitted. An onboarding liaison will reach out shortly.')}
                className="inline-flex items-center gap-1.5 text-primary text-xs font-bold mt-3 hover:underline"
              >
                <span>Connect with Employer Verification Team</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
