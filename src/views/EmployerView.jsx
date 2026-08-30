import React, { useState } from 'react';
import IndividualProfileModal from '../components/IndividualProfileModal';

export default function EmployerView({ onOpenEvidenceTrail }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'individuals', 'analytics', 'profile'
  const [selectedPathwayFilter, setSelectedPathwayFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedAI, setDismissedAI] = useState(false);
  const [selectedCandidateForProfile, setSelectedCandidateForProfile] = useState(null);

  // Sample Candidates Data for Individuals Tab & AI recommendation
  const initialCandidates = [
    {
      id: 'BP-8842',
      name: 'Amina Hassan',
      alias: 'Candidate #8842 (Amina H.)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTvdxfZWs7MzJ6RJP6vJXcXlsU9JDATCpNj_ROppHvQE8PFts5Mflx2wm9Wj_1W4mB5Pmf-ic7ECWU5gLKcOsI5Eomrjac1wZsUIXHkzN42oinK90NT-VysgaPUQX4fL16y9dtncBtUhwgEKsm-w1C6lYYT6eJCmgpZvrFae9RD_Eq4bv152meKqmUQjh3Rrrf-39Mi2XpHCJr1sVuU9IrGvtHnwxoRYxByg72z6jhPhd1o2ku1pC6-w',
      pathway: 'healthcare',
      pathwayLabel: 'Healthcare Administration',
      roleAlignment: 94,
      readinessScore: 92,
      commLevel: 'Exceeded (95%)',
      protocolMatch: 'Demonstrated (92%)',
      problemSolving: 'Demonstrated (88%)',
      location: 'London, UK (Greater London NHS Trust)',
      topSkills: ['NHS Triage Protocol', 'Patient Appointment Booking', 'CRM Management'],
      simulationSnippet: 'GP Surgery Emergency Triage Simulation — 100% Protocol Match',
      invited: false,
      statusBadge: '88% Ready'
    },
    {
      id: 'BP-7721',
      name: 'Maria Garcia',
      alias: 'Candidate #7721 (Maria G.)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADszFpR-Wvl8pTW6TBw9pZDmhVmz_df6XC1U-GLPlmiJMXaobbO3TsTZznY3RuEUx57Y_tKhXF4-nAK9taU5t0q_Npi1sPuXbYsov8Wx-pG2QKCWLnCppRYHod8ODTPhGU0NcROe6mtlBNrI8-P89r8wTmDdlpq5ZTerqE08EQMI6TeoEVFbQVUhGAriX6WJXqjwyPRREtbWC_ZRA5dUQCloc9r48-47tRW10i_g4dgO7dMruy8Nz4GA',
      pathway: 'school',
      pathwayLabel: 'School Support (LSA)',
      roleAlignment: 88,
      readinessScore: 86,
      commLevel: 'Strong (89%)',
      protocolMatch: 'Demonstrated (88%)',
      problemSolving: 'Demonstrated (84%)',
      location: 'Manchester, UK (North West Schools)',
      topSkills: ['Classroom Support', 'Parent Communication', 'Special Needs Assistance'],
      simulationSnippet: 'LSA Parent De-escalation & Scheduling Scenario — 92% Match',
      invited: false,
      statusBadge: '82% Ready'
    },
    {
      id: 'BP-9903',
      name: 'Fatima Zahra',
      alias: 'Candidate #9903 (Fatima Z.)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDd40mYg5_0H8KQW8GRtyGV3Ol6H-jCQeTAQvCBL6V9oLhfEAXA5dZNbSRh7yWloqjsNyoQjLH8Dyuh-pigQAaL2ztDsrmT7HLanomdmL3fyXO8Y3B5miTuoZ15Bs2PjVfm1bBa1reE04AkZOH8XKai0P6MWn5kSjZEruCWE45yo19C7Y4aN_ig4n_bxH4PNqSaPUn0Zz54iGxcf4_l3a2XoDlSCycv-hOSNvBKA5bnLHE98l7RqaGcA',
      pathway: 'office',
      pathwayLabel: 'Admin & Office Support',
      roleAlignment: 91,
      readinessScore: 89,
      commLevel: 'Excellent (92%)',
      protocolMatch: 'Demonstrated (90%)',
      problemSolving: 'Demonstrated (87%)',
      location: 'Birmingham, UK (Central Business Hub)',
      topSkills: ['Executive Scheduling', 'Logistics Management', 'Document Control'],
      simulationSnippet: 'Executive Calendar Conflict Resolution — 95% Match',
      invited: false,
      statusBadge: '79% Ready'
    }
  ];

  const [candidateList, setCandidateList] = useState(initialCandidates);

  const filteredCandidates = candidateList.filter((c) => {
    const matchesPathway = selectedPathwayFilter === 'all' || c.pathway === selectedPathwayFilter;
    const matchesSearch = c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.pathwayLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPathway && matchesSearch;
  });

  const handleInvite = (id) => {
    setCandidateList(candidateList.map(c => c.id === id ? { ...c, invited: true } : c));
  };

  return (
    <div className="min-h-screen bg-background text-on-background pb-24 md:pb-8 pt-4">
      
      {/* Individual Profile Full Detail Overlay */}
      {selectedCandidateForProfile && (
        <IndividualProfileModal
          candidate={selectedCandidateForProfile}
          onClose={() => setSelectedCandidateForProfile(null)}
          onInviteInterview={(id) => handleInvite(id)}
        />
      )}

      {/* Sub-Header Navigation Bar for Employer Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mb-6 flex justify-between items-center border-b border-outline-variant/60 pb-3">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-bold text-xs md:text-sm py-2 border-b-2 transition-all ${
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('individuals')}
            className={`font-bold text-xs md:text-sm py-2 border-b-2 transition-all ${
              activeTab === 'individuals'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`font-bold text-xs md:text-sm py-2 border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`font-bold text-xs md:text-sm py-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Organization Profile
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-secondary bg-secondary-container/20 px-3 py-1 rounded-full border border-secondary/30">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>GDPR Compliant Anonymized Portal</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10">
        
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Welcome Section */}
            <div className="flex justify-between items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">Welcome back, Sarah</h2>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">Here's what's happening with your individuals today.</p>
              </div>

              <button
                onClick={() => setActiveTab('individuals')}
                className="hidden md:flex items-center gap-2 bg-primary-container text-on-primary rounded-xl px-4 py-2.5 font-bold text-xs hover:bg-primary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add Candidate
              </button>
            </div>

            {/* Metrics Bento Grid (4 Metric Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Metric 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-xl text-[20px]">group</span>
                  <span className="text-xs font-bold text-secondary flex items-center bg-secondary-container/20 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                  </span>
                </div>
                <p className="text-xs font-medium text-on-surface-variant mb-1">Job-Ready Individuals</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">1,240</p>
              </div>

              {/* Metric 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-surface-tint bg-surface-container-low p-2 rounded-xl text-[20px]">pending_actions</span>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container rounded-full px-2 py-0.5">Requires Action</span>
                </div>
                <p className="text-xs font-medium text-on-surface-variant mb-1">Awaiting Review</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">42</p>
              </div>

              {/* Metric 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-tertiary bg-surface-container-low p-2 rounded-xl text-[20px]">event_available</span>
                </div>
                <p className="text-xs font-medium text-on-surface-variant mb-1">Interviews Scheduled</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">12</p>
              </div>

              {/* Metric 4 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-secondary bg-surface-container-low p-2 rounded-xl text-[20px]">work</span>
                </div>
                <p className="text-xs font-medium text-on-surface-variant mb-1">Active Job Roles</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">5</p>
              </div>

            </div>

            {/* AI Insights & Recent Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* AI Recommendation Panel (Spans 2 Cols) */}
              {!dismissedAI ? (
                <div className="md:col-span-2 bg-gradient-to-br from-surface-container-low to-surface-container rounded-2xl p-6 border border-primary-fixed shadow-sm relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-fixed rounded-full opacity-30 blur-2xl"></div>
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="bg-surface-container-lowest p-3 rounded-full shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-on-background mb-1">AI Recommendation</h3>
                      <p className="text-xs md:text-sm text-on-surface-variant mb-4 leading-relaxed">
                        Top Individual Recommendation: <strong className="text-on-background font-bold">Amina Hassan</strong> for Customer Service Role. High communication score (95%).
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedCandidateForProfile(candidateList[0])}
                          className="bg-primary-container text-on-primary px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary transition-colors shadow-sm"
                        >
                          Review Profile
                        </button>
                        <button
                          onClick={() => setDismissedAI(true)}
                          className="bg-surface-container-lowest text-on-surface px-4 py-2 rounded-xl font-semibold text-xs border border-outline-variant hover:bg-surface-variant transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant flex items-center justify-between">
                  <p className="text-xs text-on-surface-variant font-medium">AI Recommendation dismissed.</p>
                  <button onClick={() => setDismissedAI(false)} className="text-xs font-bold text-primary hover:underline">
                    Restore Recommendation
                  </button>
                </div>
              )}

              {/* Recent Applications (Spans 1 Col) */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                  <h3 className="text-base font-bold text-on-background">Recent Applications</h3>
                  <button onClick={() => setActiveTab('individuals')} className="text-primary font-bold text-xs hover:underline">
                    View All
                  </button>
                </div>

                <ul className="divide-y divide-outline-variant/60 flex-1">
                  {candidateList.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => setSelectedCandidateForProfile(c)}
                      className="p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={c.avatar} alt={c.name} />
                        <div>
                          <p className="text-xs font-bold text-on-background group-hover:text-primary transition-colors">{c.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{c.pathwayLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>{c.statusBadge}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 2: INDIVIDUALS / CANDIDATES DIRECTORY ================= */}
        {activeTab === 'individuals' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Search & Sector Filter Cluster */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search candidate profiles by skill or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-on-surface-variant shrink-0">Filter Pathway:</span>
                <button
                  onClick={() => setSelectedPathwayFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPathwayFilter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  All Pathways
                </button>
                <button
                  onClick={() => setSelectedPathwayFilter('healthcare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPathwayFilter === 'healthcare' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  Healthcare Admin
                </button>
                <button
                  onClick={() => setSelectedPathwayFilter('school')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPathwayFilter === 'school' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  School Support
                </button>
                <button
                  onClick={() => setSelectedPathwayFilter('office')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPathwayFilter === 'office' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  Admin & Office
                </button>
              </div>
            </div>

            {/* De-identified Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCandidates.map((c) => (
                <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant flex flex-col justify-between hover:shadow-lg transition-all relative group shadow-sm">
                  
                  <div>
                    {/* Top Badge & Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div
                        onClick={() => setSelectedCandidateForProfile(c)}
                        className="flex items-center gap-3 cursor-pointer group-hover:opacity-90 transition-opacity"
                      >
                        <img src={c.avatar} alt={c.alias} className="w-12 h-12 rounded-full object-cover border-2 border-surface-container-high" />
                        <div>
                          <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                            {c.alias}
                            <span className="material-symbols-outlined text-[16px] text-primary">open_in_new</span>
                          </h3>
                          <p className="text-xs text-on-surface-variant">{c.pathwayLabel}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-extrabold">
                        {c.roleAlignment}% Alignment
                      </span>
                    </div>

                    {/* Readiness Metrics */}
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Workforce Readiness:</span>
                        <span className="font-bold text-primary">{c.readinessScore}% Score</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Communication:</span>
                        <span className="font-bold text-secondary">{c.commLevel}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Protocol Compliance:</span>
                        <span className="font-bold text-tertiary">{c.protocolMatch}</span>
                      </div>
                    </div>

                    {/* Simulation Proof Snippet */}
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">AI Simulation Evidence:</p>
                      <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-[11px] text-on-surface italic leading-relaxed">
                        "{c.simulationSnippet}"
                      </div>
                    </div>

                    {/* Top Skills Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {c.topSkills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface text-[11px] font-medium border border-outline-variant/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-outline-variant">
                    <button
                      onClick={() => setSelectedCandidateForProfile(c)}
                      className="w-full py-2 rounded-xl bg-surface-container-high text-primary font-bold text-xs hover:bg-surface-variant border border-outline-variant transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">account_box</span>
                      View Full Candidate Profile
                    </button>

                    <button
                      onClick={() => onOpenEvidenceTrail(c.alias, c.pathwayLabel, c.readinessScore + '%', c.simulationSnippet)}
                      className="w-full py-2 rounded-xl bg-secondary-container/20 text-secondary font-bold text-xs hover:bg-secondary-container/40 border border-secondary/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
                      Inspect Evidence Traceability Chain
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInvite(c.id)}
                        disabled={c.invited}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          c.invited
                            ? 'bg-surface-variant text-on-surface-variant cursor-default'
                            : 'bg-primary-container text-on-primary hover:bg-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {c.invited ? 'check_circle' : 'calendar_add_on'}
                        </span>
                        {c.invited ? 'Interview Invited' : 'Invite to Interview'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: READINESS ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-outline-variant/60">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Recruitment & Capability Metrics
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Readiness Analytics</h2>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Overview of candidate performance and pipeline metrics.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => alert("Readiness Analytics Report Exported.")}
                  className="px-4 py-2.5 bg-surface border border-outline-variant text-primary rounded-xl font-bold text-xs hover:bg-surface-container-low transition-colors shadow-sm"
                >
                  Export Report
                </button>
                <button
                  onClick={() => alert("Filter Data Modal Opened.")}
                  className="px-4 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Filter Data
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
                <h3 className="text-base font-bold text-primary mb-6 self-start">Average Readiness</h3>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="78 100" strokeWidth="3"></path>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-primary">78<span className="text-xl font-bold">%</span></span>
                    <span className="text-xs font-bold text-secondary flex items-center gap-1 mt-1 bg-secondary-container/20 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> +5.2%
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                      <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                    </div>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                      High Performing
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant mb-1">Interview Conversion Rate</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-extrabold text-primary">42.5%</span>
                      <span className="text-xs font-medium text-on-surface-variant mb-1">avg.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                      <span className="material-symbols-outlined text-[22px]">group</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant mb-1">Total Active Candidates</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-extrabold text-primary">1,248</span>
                      <span className="text-xs font-bold text-secondary flex items-center mb-1">
                        <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 min-h-[350px] shadow-sm">
                <h3 className="text-base font-bold text-primary mb-6">Skill Distribution</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-on-surface">Customer Service</span>
                      <span className="text-primary font-bold">85%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-on-surface">Communication</span>
                      <span className="text-primary font-bold">72%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-on-surface">Tech Literacy</span>
                      <span className="text-primary font-bold">68%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-surface-tint rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-on-surface">Problem Solving</span>
                      <span className="text-primary font-bold">60%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-outline rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 min-h-[350px] shadow-sm">
                <h3 className="text-base font-bold text-primary mb-6">Candidate Pipeline</h3>
                <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto">
                  <div className="w-full relative group">
                    <div className="h-12 bg-surface-container-high rounded-t-xl flex items-center justify-between px-4 transition-all hover:bg-surface-variant cursor-default border-b border-surface">
                      <span className="text-xs font-bold text-on-surface">Applied</span>
                      <span className="text-base font-bold text-primary">100%</span>
                    </div>
                  </div>
                  <div className="w-[91%] relative group">
                    <div className="h-12 bg-primary-fixed rounded-md flex items-center justify-between px-4 transition-all hover:bg-inverse-primary cursor-default border-b border-surface">
                      <span className="text-xs font-bold text-on-primary-fixed">Screened</span>
                      <span className="text-base font-bold text-on-primary-fixed">65%</span>
                    </div>
                  </div>
                  <div className="w-[80%] relative group">
                    <div className="h-12 bg-surface-tint text-on-primary flex items-center justify-between px-4 rounded-md transition-all hover:opacity-90 cursor-default border-b border-surface">
                      <span className="text-xs font-bold">Interviewed</span>
                      <span className="text-base font-bold">42%</span>
                    </div>
                  </div>
                  <div className="w-[60%] relative group">
                    <div className="h-12 bg-primary-container text-on-primary-container flex items-center justify-between px-4 rounded-b-xl transition-all hover:opacity-90 cursor-default shadow-sm">
                      <span className="text-xs font-bold">Hired</span>
                      <span className="text-base font-bold">18%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 4: ORGANIZATION PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
              <span>Settings</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="font-bold text-on-surface">Organization Profile</span>
            </div>

            {/* Header: Organization Identity (Bento Hero) */}
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface-container-high rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              {/* Logo Container */}
              <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-center p-4 relative z-10 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[56px]">spa</span>
              </div>

              {/* Identity Content */}
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">BloomingPath Enterprise</h2>
                  <span className="material-symbols-outlined text-primary text-[24px]" title="Verified Employer">verified</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs border border-primary-fixed-dim">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    Education
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs border border-primary-fixed-dim">
                    <span className="material-symbols-outlined text-[14px]">local_hospital</span>
                    Healthcare
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-bold text-xs border border-outline-variant">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    London, UK
                  </span>
                </div>

                <p className="text-xs md:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                  Empowering the next generation of professionals by bridging the gap between rigorous academic training and real-world clinical and educational environments. We build intuitive pathways for career advancement.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Sarah Jenkins (Talent Lead)</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    <span>talent@bloomingpath.edu</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 self-start md:self-center">
                <button
                  onClick={() => alert("Organization Profile Edit Modal Opened.")}
                  className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl font-bold text-xs text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profile
                </button>
              </div>
            </section>

            {/* Bento Grid Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Job Roles (Span 8) */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
                    <div>
                      <h3 className="text-base font-bold text-on-surface">Active Job Roles & Criteria</h3>
                      <p className="text-xs text-on-surface-variant mt-1">Currently open requisitions for placement and required competency frameworks.</p>
                    </div>
                    <button onClick={() => setActiveTab('individuals')} className="text-primary hover:underline font-bold text-xs flex items-center gap-1">
                      View All <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Role Card 1 */}
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant hover:border-primary transition-all group cursor-pointer relative overflow-hidden flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                              <span className="material-symbols-outlined text-[20px]">menu_book</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Teaching Assistant</h4>
                              <span className="px-2 py-0.5 mt-1 inline-block bg-surface-variant text-primary rounded text-[10px] font-bold uppercase tracking-wider">Education</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-4">Supporting primary education environments with specialized learning plans.</p>
                        <div className="flex items-center gap-4 text-on-surface-variant text-xs font-semibold pt-2">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> 12 Placements</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> Full-time</span>
                        </div>
                      </div>

                      <div className="sm:w-64 relative z-10 border-t sm:border-t-0 sm:border-l border-outline-variant pt-4 sm:pt-0 sm:pl-6 flex flex-col justify-center">
                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Pathway Alignment</span>
                          <span className="text-xs font-semibold text-on-surface">Primary Ed. Level 3+</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Readiness Threshold</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Min 80% Readiness
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Key Capabilities</span>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-surface-container-lowest rounded border border-outline-variant text-[11px] text-on-surface font-medium">Behavior Mgmt</span>
                            <span className="px-2 py-1 bg-surface-container-lowest rounded border border-outline-variant text-[11px] text-on-surface font-medium">Literacy Support</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Role Card 2 */}
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant hover:border-primary transition-all group cursor-pointer relative overflow-hidden flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/40 text-tertiary flex items-center justify-center">
                              <span className="material-symbols-outlined text-[20px]">event_available</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Patient Booking Clerk</h4>
                              <span className="px-2 py-0.5 mt-1 inline-block bg-surface-variant text-primary rounded text-[10px] font-bold uppercase tracking-wider">Healthcare</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-4">Managing outpatient schedules and preliminary intake coordination.</p>
                        <div className="flex items-center gap-4 text-on-surface-variant text-xs font-semibold pt-2">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> 8 Placements</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> Part-time</span>
                        </div>
                      </div>

                      <div className="sm:w-64 relative z-10 border-t sm:border-t-0 sm:border-l border-outline-variant pt-4 sm:pt-0 sm:pl-6 flex flex-col justify-center">
                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Pathway Alignment</span>
                          <span className="text-xs font-semibold text-on-surface">Healthcare Admin</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Readiness Threshold</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Min 75% Readiness
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Key Capabilities</span>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-surface-container-lowest rounded border border-outline-variant text-[11px] text-on-surface font-medium">Intake Coord.</span>
                            <span className="px-2 py-1 bg-surface-container-lowest rounded border border-outline-variant text-[11px] text-on-surface font-medium">Scheduling</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>
              </div>

              {/* Right Column: Admin & Info (Span 4) */}
              <div className="md:col-span-4 flex flex-col gap-6">
                
                {/* Subscription & Licensing */}
                <section className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Subscription Status</h3>
                    <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container font-extrabold text-[11px] rounded-full">ACTIVE</span>
                  </div>
                  <div className="space-y-3 border-b border-outline-variant pb-4 mb-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Tier Plan</span>
                      <span className="font-bold text-on-surface">Monthly Enterprise</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Licence Fee</span>
                      <span className="font-bold text-on-surface">£500/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Pipeline Allowance</span>
                      <span className="font-bold text-on-surface">150 Candidates</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Next Renewal</span>
                    <span className="font-bold text-on-surface">Oct 15, 2024</span>
                  </div>
                </section>

                {/* Admin Members */}
                <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-on-surface">Admin Members</h3>
                    <button
                      onClick={() => alert("Add Team Admin Seat Modal Opened.")}
                      className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"
                      title="Add Admin"
                    >
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjxS_RhCipKkN87W8w_kfioYoEGCccVv-AVXHPkKA8DwlTx_dZzV6YVNgl0z9uto3ZKABWpAJWwXFCNzfv32ohK9yb3VToZ5nE0C3ljaqlrPVhCgZj4i_56AZgsAhthhxh_A3lBkOihFlRhKVTynxDm-s4jbBQ5wmQkqw9paojC_793elJz_WpGxAoeCMk5n4tdvzA1Fsmqkp3ZvMFPDvB89tktzg0vbSV_zx4FHlCKHNuGIWow8D-fQ" alt="Sarah Jenkins" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">Sarah Jenkins</p>
                        <p className="text-[11px] text-on-surface-variant truncate">Primary Administrator</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoSpeBrVYgN-eF88-7IoITGBKtvs0tSe2EldEML_iWMxyihnfzwdlCMUnyPnwu8gUe_vAdXllxypfdlWv5klbX8XwArzyZs53GSEx2WmbQC1JD9ZF_hdibwnMnKDqez5Hg07qUttFPN9uu9Wey2ovze0zWBZfkAHxfVwL6Q6SldLpbdUIyILq-ac7p0P9M9n39A6VIuofkpPDbWR71-rYuM_ERO9vPsw3woAegagC-I716BKl4vns_lQ" alt="David Chen" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">David Chen</p>
                        <p className="text-[11px] text-on-surface-variant truncate">Recruitment Lead</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-xs border border-outline-variant">
                        EJ
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">Elena Jimenez</p>
                        <p className="text-[11px] text-on-surface-variant truncate">HR Coordinator</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Quick Stats/Metrics */}
                <section className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Platform Engagement</h3>
                  <div className="flex justify-between items-end border-b border-outline-variant pb-3 mb-3">
                    <span className="text-xs font-semibold text-on-surface">Total Placements</span>
                    <span className="text-2xl font-extrabold text-primary">142</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold text-on-surface">Active Learners</span>
                    <span className="text-xl font-bold text-on-surface">28</span>
                  </div>
                </section>

              </div>

            </div>

            {/* Bottom Section: Data Governance & Security */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Data Governance & Compliance */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-on-surface">Data Governance & Compliance</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Manage organizational data policies and audit logs.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">GDPR Compliance</p>
                        <p className="text-[11px] text-on-surface-variant">Data processing agreement active</p>
                      </div>
                    </div>
                    <span className="text-secondary text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Compliant
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Audit Logging</p>
                        <p className="text-[11px] text-on-surface-variant">90-day retention policy</p>
                      </div>
                    </div>
                    <button onClick={() => alert("Audit Log Configuration Opened.")} className="text-primary hover:underline font-bold text-xs">
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              {/* Access Control & Security */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-on-surface">Access Control & RBAC</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Manage team member seats and role permissions.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">group</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Team Member Seats</p>
                        <p className="text-[11px] text-on-surface-variant">3 of 5 allocated seats used</p>
                      </div>
                    </div>
                    <button onClick={() => alert("Team Seat Management Opened.")} className="text-primary hover:underline font-bold text-xs">
                      Manage Seats
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">RBAC Policies</p>
                        <p className="text-[11px] text-on-surface-variant">Custom role definitions active</p>
                      </div>
                    </div>
                    <button onClick={() => alert("RBAC Policy Matrix Opened.")} className="text-primary hover:underline font-bold text-xs">
                      View Roles
                    </button>
                  </div>
                </div>
              </div>

            </section>

          </div>
        )}

      </main>

    </div>
  );
}
