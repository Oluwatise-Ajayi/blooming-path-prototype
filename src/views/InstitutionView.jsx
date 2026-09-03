import React, { useState } from 'react';

export default function InstitutionView({ onOpenOnboarding }) {
  const [activeNavTab, setActiveNavTab] = useState('dashboard'); // 'dashboard', 'programmes', 'individuals', 'analytics', 'reports'
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Filters State for Individuals Tab
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filters State for Programmes Tab
  const [progCategoryFilter, setProgCategoryFilter] = useState('');
  const [progStatusFilter, setProgStatusFilter] = useState('');

  // Sample Individuals Data
  const individualsData = [
    {
      id: 'IND-101',
      name: 'Sarah Jenkins',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_UaM3AU3J4RaKV_y8fd5MGEn7JqtRKRgBJJDDY2oTWff7WaK1QY_cPRuwdoxHw7RQRgMqOrwU8-DmGMWDA3mqLqyvMPOQFc7D_1UaLmJRVbMK_TA6yB-LmjbwaTwVMboemvLxbLvCxTWuHsdmN-cgazoHteSPZ_R7ECjxIkKD3zbcl2pMwfXuorrCcUYVego_6WfWn_JLzysMo_YAzUyr8dbGdq6hZWwRzvXLP1_O1yfo3AxuvQXUbw',
      activeTime: 'Active 2 hrs ago',
      pathway: 'Healthcare Administration',
      module: 'Mod 4: Patient Triage & Booking',
      completion: 78,
      readiness: 85,
      stars: 4,
      status: 'In Progress',
      statusClass: 'bg-primary-fixed text-on-primary-fixed'
    },
    {
      id: 'IND-102',
      name: 'Michael Kwan',
      avatar: null,
      initials: 'MK',
      activeTime: 'Active 1 day ago',
      pathway: 'School Support (LSA)',
      module: 'Mod 12: Classroom Safeguarding',
      completion: 100,
      readiness: 92,
      stars: 5,
      status: 'Ready',
      statusClass: 'bg-secondary-container text-on-secondary-container font-bold'
    },
    {
      id: 'IND-103',
      name: 'David Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeXD-rbGPQFx_50gzDyOJ62KZcOdpPg6xH4N2BxiG-ED8qgm3qFyKKF2wBqL3OB_pPAon-Ldhjlb_Oe_FLCpcouf7VAVx2L37GfkZ1VALyNTUfqRYsYToQYMaVTd_UgJY_FMqmNicaq-LPdInccr4vd7vgiyQeUR9D1ol5ArZ-Q45EEUw0u1geyLhRYItxOAN7LZUtGciiWqetidnSBC2CRmVW8oPfoQqk37D_YQ4olS3v3ARU4Cvgzw',
      activeTime: 'Inactive for 7 days',
      activeTimeClass: 'text-error font-medium',
      pathway: 'Admin & Office Support',
      module: 'Mod 2: Calendar Logistics',
      completion: 15,
      readiness: 42,
      stars: 2,
      status: 'Needs Support',
      statusClass: 'bg-error-container text-on-error-container font-bold'
    },
    {
      id: 'IND-104',
      name: 'Amina Hassan',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr0moT1iKvNUVfGjN9Dfhs6eqB0fZ2Oh7YrM_C-3qYIHA8sHD75zhB4lo1CrYj4h2c4csIYi7SYq9s96lQNOERD09TPEAXojG3x_YAYpDXgbhDwZ_9AX_FDhgTBaXM1onzonD8KlsdwrUzONeHX0eOsrFGXFjUquNU66yvIpqJGj7GMcrzRawKxlJEvuJNT0T7_CF-g0AweLmAe8uYaL_Hdc6BfsS0WGgO9Rva_wa0ei2Ngoj5NwXdhQ',
      activeTime: 'Active 30 mins ago',
      pathway: 'Healthcare Administration',
      module: 'Mod 8: Emergency GP Triage',
      completion: 94,
      readiness: 95,
      stars: 5,
      status: 'Ready',
      statusClass: 'bg-secondary-container text-on-secondary-container font-bold'
    }
  ];

  // Sample Programmes Data
  const programmesList = [
    {
      id: 'PROG-1',
      title: 'School Support Readiness',
      category: 'pathways',
      funding: 'Funding: ASF',
      status: 'Active',
      icon: 'school',
      desc: 'Core technical & safeguarding skills for entry-level school support roles.',
      total: '1,250',
      active: '840',
      completion: 65,
      readiness: '8.2 / 10'
    },
    {
      id: 'PROG-2',
      title: 'Healthcare Admin Readiness',
      category: 'pathways',
      funding: 'Funding: UKSPF',
      status: 'Active',
      icon: 'medical_services',
      desc: 'GP clinic triage, NHS appointment protocols, and patient operations.',
      total: '450',
      active: '320',
      completion: 88,
      readiness: '9.1 / 10'
    },
    {
      id: 'PROG-3',
      title: 'Women Returner Initiative',
      category: 'return',
      funding: 'Funding: Local Authority Skills',
      status: 'Draft',
      icon: 'woman',
      desc: 'Digital confidence, transferable skills, and flexible workplace reintegration.',
      total: '120',
      active: '--',
      completion: 0,
      readiness: '-- / 10'
    },
    {
      id: 'PROG-4',
      title: 'Admin & Office Support Readiness',
      category: 'pathways',
      funding: 'Funding: AEB',
      status: 'Active',
      icon: 'work',
      desc: 'Executive scheduling, document management, and business customer support.',
      total: '850',
      active: '610',
      completion: 76,
      readiness: '8.7 / 10'
    }
  ];

  // Sample Recent Reports Data
  const recentReports = [
    {
      id: 'REP-1',
      title: 'UKSPF Q3 Impact Audit',
      category: 'Programme',
      date: 'Oct 24, 2023',
      icon: 'insert_chart',
      iconClass: 'text-primary group-hover:bg-primary-container group-hover:text-on-primary'
    },
    {
      id: 'REP-2',
      title: 'AEB Diagnostic Completion Summary',
      category: 'Impact',
      date: 'Oct 15, 2023',
      icon: 'pie_chart',
      iconClass: 'text-secondary group-hover:bg-secondary group-hover:text-on-secondary'
    },
    {
      id: 'REP-3',
      title: 'Local Authority Outcomes Report',
      category: 'Readiness',
      date: 'Oct 02, 2023',
      icon: 'analytics',
      iconClass: 'text-tertiary-container group-hover:bg-tertiary-container group-hover:text-on-tertiary-container'
    },
    {
      id: 'REP-4',
      title: 'Multiply Skills Progress Tracker',
      category: 'Programme',
      date: 'Jul 12, 2023',
      icon: 'insert_chart',
      iconClass: 'text-primary group-hover:bg-primary-container group-hover:text-on-primary'
    }
  ];

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Individual_ID,Name,Pathway,Current_Module,Completion,Readiness_Score,Status\n` +
      individualsData.map(i => `${i.id},"${i.name}","${i.pathway}","${i.module}",${i.completion}%,${i.readiness}/100,"${i.status}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "BloomingPath_Institutional_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 4000);
  };

  const filteredIndividuals = individualsData.filter(item => {
    if (programmeFilter !== 'All' && !item.pathway.includes(programmeFilter)) return false;
    if (readinessFilter === 'High' && item.readiness <= 80) return false;
    if (readinessFilter === 'AtRisk' && item.readiness >= 50) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    return true;
  });

  const filteredProgrammes = programmesList.filter(p => {
    if (progCategoryFilter && p.category !== progCategoryFilter) return false;
    if (progStatusFilter && p.status.toLowerCase() !== progStatusFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      
      {/* SideNavBar (Positioned cleanly below top header at top-[80px]) */}
      <nav className="hidden md:flex fixed left-0 top-[80px] h-[calc(100vh-80px)] flex-col z-30 bg-surface border-r border-outline-variant shadow-sm w-64">
        
        {/* Navigation Section Label */}
        <div className="px-6 py-4 border-b border-outline-variant/60 bg-surface-container-low/40">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Institutional Portal</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Programme & Cohort Health</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 py-4 px-3 flex flex-col gap-1.5 overflow-y-auto">
          
          {/* TAB 1: Dashboard */}
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
              activeNavTab === 'dashboard'
                ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm scale-[1.01]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeNavTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span>Dashboard</span>
          </button>

          {/* TAB 2: Programmes */}
          <button
            onClick={() => setActiveNavTab('programmes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
              activeNavTab === 'programmes'
                ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm scale-[1.01]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeNavTab === 'programmes' ? "'FILL' 1" : "'FILL' 0" }}>school</span>
            <span>Programmes</span>
          </button>

          {/* TAB 3: Individuals */}
          <button
            onClick={() => setActiveNavTab('individuals')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
              activeNavTab === 'individuals'
                ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm scale-[1.01]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Individuals</span>
          </button>

          {/* TAB 4: Analytics */}
          <button
            onClick={() => setActiveNavTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
              activeNavTab === 'analytics'
                ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm scale-[1.01]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">leaderboard</span>
            <span>Analytics</span>
          </button>

          {/* TAB 5: Reports */}
          <button
            onClick={() => setActiveNavTab('reports')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
              activeNavTab === 'reports'
                ? 'bg-secondary-container text-on-secondary-container font-extrabold shadow-sm scale-[1.01]'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeNavTab === 'reports' ? "'FILL' 1" : "'FILL' 0" }}>description</span>
            <span>Reports</span>
          </button>
        </div>

        {/* Action Button & Setup */}
        <div className="p-3 border-t border-outline-variant space-y-2">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="w-full bg-secondary-container/60 hover:bg-secondary-container text-on-secondary-container text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-secondary/30 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">assured_workload</span>
              <span>Governance &amp; Setup</span>
            </button>
          )}
          <button
            onClick={() => alert("New Programme Creator Dialog Launched.")}
            className="w-full bg-primary text-on-primary text-xs font-bold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            New Programme
          </button>
        </div>

        {/* Footer Links */}
        <div className="border-t border-outline-variant p-2 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg text-xs" href="#">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg text-xs" href="#">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Support</span>
          </a>
        </div>
      </nav>

      {/* Main Content Canvas (Positioned with ml-64 and mt-[80px] offset) */}
      <main className="flex-1 ml-0 md:ml-64 mt-[80px] h-[calc(100vh-80px)] overflow-y-auto p-4 sm:p-6 md:p-8 bg-background pb-24">
        
        {/* Mobile Navigation Horizontal Tab Bar */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-outline-variant scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            { id: 'programmes', label: 'Programmes', icon: 'auto_stories' },
            { id: 'individuals', label: 'Individuals', icon: 'group' },
            { id: 'analytics', label: 'Analytics', icon: 'analytics' },
            { id: 'reports', label: 'Reports', icon: 'description' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeNavTab === tab.id
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================= TAB CONTENT 1: INSTITUTION OVERVIEW DASHBOARD ================= */}
        {activeNavTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-outline-variant/60 gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Live System Overview
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">Institution Overview</h1>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Real-time insights across all active programmes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => alert("Comprehensive Impact Report Generated.")}
                  className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold text-xs rounded-xl flex items-center gap-2 hover:bg-surface-container-low transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Impact Report
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">file_export</span>
                  {downloadNotice ? 'Exported!' : 'Export Data'}
                </button>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* 7 KPI Cards */}
              <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Total Enrolled</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">group</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-on-background">2,450</p>
                    <p className="text-[11px] font-bold text-secondary mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +12% this month
                    </p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Active Individuals</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">directions_run</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-on-background">1,820</p>
                    <p className="text-[11px] font-bold text-secondary mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +5% this week
                    </p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Completion Rate</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">task_alt</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-on-background">74%</p>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Avg Readiness</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">psychology</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-on-background">72<span className="text-xs font-normal text-on-surface-variant">/100</span></p>
                    <p className="text-[11px] text-outline mt-1 font-medium">Target: 75</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Ready for Work</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">work</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-secondary">156</p>
                    <p className="text-[11px] text-outline mt-1 font-medium">Pending placement</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 border border-outline-variant bg-surface-container-lowest shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-on-surface-variant">Placement Rate</p>
                    <span className="material-symbols-outlined text-outline text-[20px] opacity-60">handshake</span>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-on-background">22%</p>
                    <p className="text-[11px] font-bold text-secondary mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2% this month
                    </p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 col-span-2 bg-error-container/20 border border-error-container shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-on-surface-variant">Requiring Support</p>
                    <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-extrabold text-error">42</p>
                      <p className="text-[11px] font-bold text-error mt-0.5">Learners at risk of dropping out</p>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('individuals')}
                      className="text-error text-xs font-bold hover:underline"
                    >
                      View List
                    </button>
                  </div>
                </div>
              </div>

              {/* Lumina AI Insights */}
              <div className="md:col-span-4 bg-gradient-to-br from-primary-container via-primary to-secondary p-[1px] rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-tertiary-fixed/20 rounded-full blur-xl -ml-5 -mb-5"></div>
                
                <div className="bg-inverse-surface h-full rounded-2xl p-6 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-tertiary-fixed text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      <h3 className="text-lg font-bold text-white">Lumina AI Insights</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-secondary-fixed text-[20px] mt-0.5">trending_up</span>
                          <p className="text-xs text-white/90 leading-snug">
                            Customer Service pathway has the highest completion rate this quarter.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary-fixed-dim text-[20px] mt-0.5">school</span>
                          <p className="text-xs text-white/90 leading-snug">
                            <strong className="text-white">18 individuals</strong> are currently close to employment readiness thresholds.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3.5 border border-error/50 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-error-container text-[20px] mt-0.5">campaign</span>
                          <div>
                            <p className="text-xs text-white/90 leading-snug">
                              Recommend triggering mentor check-ins for 12 individuals showing declining activity.
                            </p>
                            <button
                              onClick={() => setActiveNavTab('individuals')}
                              className="mt-2 text-xs font-bold text-tertiary-fixed hover:underline inline-block"
                            >
                              Review Candidates
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="md:col-span-12 glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest shadow-sm mt-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-on-background">Recent Activity</h3>
                  <button className="text-primary font-bold text-xs hover:underline">View All</button>
                </div>

                <div className="space-y-2 divide-y divide-outline-variant/50">
                  <div className="flex items-center gap-4 pt-3 first:pt-0 pb-3 hover:bg-surface-container-low/50 px-2 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-on-background">New enrollment surge in <strong className="text-primary">Tech Foundations</strong></p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">45 new individuals onboarded in the last 24 hours.</p>
                    </div>
                    <span className="text-[11px] text-outline font-semibold shrink-0">2h ago</span>
                  </div>

                  <div className="flex items-center gap-4 pt-3 pb-3 hover:bg-surface-container-low/50 px-2 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-on-background">Simulation Cohort Alpha completed</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">82% average pass rate for the communication module.</p>
                    </div>
                    <span className="text-[11px] text-outline font-semibold shrink-0">5h ago</span>
                  </div>

                  <div className="flex items-center gap-4 pt-3 pb-1 hover:bg-surface-container-low/50 px-2 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">event</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-on-background">Employer interviews scheduled</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">5 individuals from the Retail pathway scheduled for final round interviews.</p>
                    </div>
                    <span className="text-[11px] text-outline font-semibold shrink-0">1d ago</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB CONTENT 2: PROGRAMMES DIRECTORY ================= */}
        {activeNavTab === 'programmes' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Training Initiatives
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">Programmes Directory</h1>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">Manage and track your active training initiatives.</p>
              </div>

              <button
                onClick={() => alert("New Programme Dialog Opened.")}
                className="px-4 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-sm self-start md:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Programme
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Filters:</span>
                </div>

                <select
                  value={progCategoryFilter}
                  onChange={(e) => setProgCategoryFilter(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container min-w-[160px]"
                >
                  <option value="">All Categories</option>
                  <option value="workforce">Workforce Inclusion</option>
                  <option value="return">Return-to-Work</option>
                  <option value="local">Local Authority Schemes</option>
                  <option value="esol">ESOL Integration</option>
                  <option value="pathways">Role-Specific Pathways</option>
                </select>

                <select
                  value={progStatusFilter}
                  onChange={(e) => setProgStatusFilter(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-xl py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container min-w-[150px]"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="text-on-surface-variant text-xs">
                Showing <strong className="font-bold text-on-surface">{filteredProgrammes.length}</strong> programmes
              </div>
            </div>

            {/* Bento Grid of Programmes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProgrammes.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-primary w-fit">
                        <span className="material-symbols-outlined text-[24px]">{prog.icon}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-container/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {prog.funding}
                      </span>
                    </div>

                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      prog.status === 'Active'
                        ? 'bg-secondary-container/20 text-secondary'
                        : 'bg-outline-variant/30 text-on-surface-variant'
                    }`}>
                      {prog.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{prog.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 flex-1 leading-relaxed">{prog.desc}</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Total</p>
                        <p className="text-xs text-on-surface font-bold">{prog.total} <span className="text-[10px] font-normal text-on-surface-variant">indiv.</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Active</p>
                        <p className="text-xs text-on-surface font-bold">{prog.active} <span className="text-[10px] font-normal text-on-surface-variant">indiv.</span></p>
                      </div>
                    </div>

                    <div className={prog.status === 'Draft' ? 'opacity-50' : ''}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">Completion Rate</span>
                        <span className="font-bold text-on-surface">{prog.completion}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: `${prog.completion}%` }}></div>
                      </div>
                    </div>

                    <div className={`pt-4 border-t border-outline-variant/30 flex justify-between items-center ${prog.status === 'Draft' ? 'opacity-50' : ''}`}>
                      <span className="text-xs text-on-surface-variant">Avg. Readiness</span>
                      <span className="text-xs font-bold text-secondary bg-secondary-container/10 px-2.5 py-1 rounded-lg">
                        {prog.readiness}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Programme Action Card */}
              <div
                onClick={() => alert("Create New Training Initiative Dialog Opened.")}
                className="rounded-2xl border-2 border-dashed border-outline-variant/60 p-6 flex flex-col items-center justify-center h-full min-h-[300px] hover:border-primary hover:bg-surface-container-lowest/60 transition-all cursor-pointer group"
              >
                <div className="bg-surface-container-low p-4 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Create Programme</h3>
                <p className="text-xs text-on-surface-variant text-center max-w-[200px]">Start a new training initiative for your organization.</p>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB CONTENT 3: INDIVIDUALS PROGRESS ================= */}
        {activeNavTab === 'individuals' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-outline-variant/60">
              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Cohort Roster View
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">Individual Progress</h1>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Monitor, evaluate, and support individual pathway progression.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 border border-outline bg-surface-container-lowest text-on-surface font-semibold text-xs rounded-xl flex items-center gap-2 hover:bg-surface-container-low transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  {downloadNotice ? 'Exported CSV!' : 'Export CSV'}
                </button>
                <button
                  onClick={() => alert("Message Cohort Dialog Opened.")}
                  className="px-4 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Message Cohort
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/50">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Filters</span>
              </div>

              <select
                value={programmeFilter}
                onChange={(e) => setProgrammeFilter(e.target.value)}
                className="min-w-[170px] py-2 px-3 border border-outline-variant rounded-xl bg-surface text-xs text-on-surface focus:ring-2 focus:ring-primary-container font-medium"
              >
                <option value="All">All Programmes</option>
                <option value="Healthcare">Healthcare Administration</option>
                <option value="School">School Support (LSA)</option>
                <option value="Admin">Admin & Office Support</option>
              </select>

              <select
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                className="min-w-[160px] py-2 px-3 border border-outline-variant rounded-xl bg-surface text-xs text-on-surface focus:ring-2 focus:ring-primary-container font-medium"
              >
                <option value="All">Any Readiness</option>
                <option value="High">High (&gt;80)</option>
                <option value="AtRisk">At Risk (&lt;50)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[160px] py-2 px-3 border border-outline-variant rounded-xl bg-surface text-xs text-on-surface focus:ring-2 focus:ring-primary-container font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Needs Support">Needs Support</option>
              </select>
            </div>

            {/* Data Table Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Individual Name</th>
                      <th className="py-3.5 px-4">Assigned Pathway</th>
                      <th className="py-3.5 px-4">Current Module</th>
                      <th className="py-3.5 px-4">Completion</th>
                      <th className="py-3.5 px-4">Readiness</th>
                      <th className="py-3.5 px-4">Communication</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {filteredIndividuals.map((ind) => (
                      <tr key={ind.id} className="hover:bg-surface-bright transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {ind.avatar ? (
                              <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={ind.avatar} alt={ind.name} />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant font-bold text-sm">
                                {ind.initials}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{ind.name}</p>
                              <p className={`text-[11px] ${ind.activeTimeClass || 'text-on-surface-variant'}`}>{ind.activeTime}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-semibold text-on-surface">{ind.pathway}</td>
                        <td className="py-4 px-4 text-on-surface-variant font-medium">{ind.module}</td>
                        
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-surface-container-highest rounded-full h-1.5 min-w-[80px]">
                              <div
                                className={`h-1.5 rounded-full ${ind.completion < 30 ? 'bg-error' : ind.completion === 100 ? 'bg-secondary' : 'bg-primary-container'}`}
                                style={{ width: `${ind.completion}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-on-surface-variant">{ind.completion}%</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`font-bold ${ind.readiness < 50 ? 'text-error' : 'text-secondary'}`}>
                            {ind.readiness}/100
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center text-secondary">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`material-symbols-outlined text-[16px] ${star <= ind.stars ? 'text-secondary' : 'text-outline-variant'}`}
                                style={{ fontVariationSettings: star <= ind.stars ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${ind.statusClass}`}>
                            {ind.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-outline-variant bg-surface flex items-center justify-between text-xs">
                <p className="text-on-surface-variant font-medium">Showing 1 to {filteredIndividuals.length} of 45 individuals</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container-low transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB CONTENT 4: PROGRAMME ANALYTICS ================= */}
        {activeNavTab === 'analytics' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* 1. Page Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-outline-variant/60 gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Institutional Intelligence
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">Programme Analytics</h1>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Monitor individual progress, programme efficacy, and cohort health in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all text-primary shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  {downloadNotice ? 'Exported Report!' : 'Export Analytics CSV'}
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Last 12 Months
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
              </div>
            </div>

            {/* 2. KPI Row (4 Fluid Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-5 border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Active Individuals</div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-extrabold text-primary">12,450</span>
                  <span className="text-xs font-bold text-secondary flex items-center bg-secondary-container/30 px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> 14%
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Avg. Completion Rate</div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-extrabold text-on-background">87.2%</span>
                  <span className="text-xs font-bold text-secondary flex items-center bg-secondary-container/30 px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> 2.1%
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Readiness Benchmark</div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-extrabold text-on-background">91/100</span>
                  <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-lg">
                    Top Quartile
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Simulations Passed</div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-extrabold text-on-background">34.2k</span>
                  <span className="text-xs font-semibold text-tertiary bg-tertiary-container/20 px-2 py-1 rounded-lg">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Bento Grid Analytics Canvas */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Monthly Individual Enrolment Line Chart */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-8 flex flex-col min-h-[340px] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Monthly Individual Enrolment</h2>
                    <p className="text-xs text-on-surface-variant">Comparative growth trajectories over the past 12 months</p>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">more_horiz</span></button>
                </div>
                
                <div className="flex-1 relative w-full mt-2">
                  <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <line stroke="#c5c5d3" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="50" y2="50" />
                    <line stroke="#c5c5d3" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="100" y2="100" />
                    <line stroke="#c5c5d3" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="150" y2="150" />
                    <path d="M0,180 C100,160 200,120 300,140 C400,160 500,80 600,60 C700,40 800,20 800,20" fill="none" stroke="#1e3a8a" strokeLinecap="round" strokeWidth="3" />
                    <path d="M0,190 C150,180 250,150 350,160 C450,170 600,100 800,90" fill="none" stroke="#00c1ad" strokeDasharray="6,4" strokeWidth="2" />
                    <circle cx="600" cy="60" fill="#1e3a8a" r="5" />
                  </svg>
                  <div className="flex justify-between mt-4 text-xs font-medium text-on-surface-variant">
                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                  </div>
                </div>
              </div>

              {/* Readiness Score Distribution Bell Curve */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-4 flex flex-col min-h-[340px] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Readiness Distribution</h2>
                    <p className="text-xs text-on-surface-variant">Bell curve distribution</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
                </div>
                
                <div className="flex-1 relative flex flex-col justify-end pb-4">
                  <svg className="w-full h-36 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                    <path d="M0,200 Q100,200 150,100 T200,20 T250,100 T400,200 Z" fill="#eff4ff" />
                    <path d="M0,200 Q100,200 150,100 T200,20 T250,100 T400,200" fill="none" stroke="#1e3a8a" strokeWidth="2" />
                    <line stroke="#00c1ad" strokeDasharray="4" strokeWidth="2" x1="200" x2="200" y1="20" y2="200" />
                    <circle cx="200" cy="20" fill="#00c1ad" r="4" />
                  </svg>
                  <div className="flex justify-between mt-4 text-xs text-on-surface-variant px-1">
                    <span>Needs Focus</span>
                    <span className="text-secondary font-bold">Target Zone</span>
                    <span>Exceeds</span>
                  </div>
                </div>
              </div>

              {/* Completion Rates by Programme */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-6 shadow-sm">
                <h2 className="text-base font-bold text-on-surface mb-4">Completion Rates by Programme</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-on-surface">AI Foundation</span>
                      <span className="text-primary font-bold">94%</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5">
                      <div className="bg-primary-container h-2.5 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-on-surface">Leadership & Tech</span>
                      <span className="text-primary font-bold">88%</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5">
                      <div className="bg-primary-container h-2.5 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-on-surface">Data Literacy 101</span>
                      <span className="text-secondary font-bold">76%</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5">
                      <div className="bg-secondary h-2.5 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-on-surface">Ethics in AI</span>
                      <span className="text-primary font-bold">91%</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5">
                      <div className="bg-primary-container h-2.5 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Performance Breakdown */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-6 shadow-sm">
                <h2 className="text-base font-bold text-on-surface mb-4">Simulation Performance Breakdown</h2>
                <div className="flex items-center justify-between flex-col sm:flex-row gap-6 pt-2">
                  <div className="w-full sm:w-1/2 flex justify-center">
                    <div className="relative w-36 h-36 rounded-full border-[10px] border-surface-container-high flex items-center justify-center border-t-primary-container border-r-primary-container border-b-secondary-container transform rotate-45 shadow-sm">
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center transform -rotate-45">
                        <span className="text-2xl font-extrabold text-on-surface">82%</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm bg-primary-container"></div>
                      <span className="font-semibold text-on-surface-variant">Critical Thinking (45%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm bg-secondary-container"></div>
                      <span className="font-semibold text-on-surface-variant">Problem Solving (30%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm bg-surface-container-high"></div>
                      <span className="font-semibold text-on-surface-variant">Time Management (25%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cohort Performance Comparison Table */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-8 shadow-sm">
                <h2 className="text-base font-bold text-on-surface mb-4">Cohort Performance Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant text-on-surface-variant uppercase font-bold tracking-wider">
                        <th className="pb-3">Cohort / Organization</th>
                        <th className="pb-3 text-right">Avg Score</th>
                        <th className="pb-3 text-right">Completion Rate</th>
                        <th className="pb-3 text-right w-1/3">Progress Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-bold text-on-surface">Global Tech Solutions (Q3)</td>
                        <td className="py-3 text-right font-extrabold text-primary">92.4</td>
                        <td className="py-3 text-right font-semibold">96%</td>
                        <td className="py-3">
                          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[96%] rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-bold text-on-surface">FinServe Partners (Q3)</td>
                        <td className="py-3 text-right font-extrabold text-primary">88.1</td>
                        <td className="py-3 text-right font-semibold">84%</td>
                        <td className="py-3">
                          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-primary-container w-[84%] rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 font-bold text-on-surface">Retail Innovations (Q4)</td>
                        <td className="py-3 text-right font-extrabold text-primary">81.5</td>
                        <td className="py-3 text-right font-semibold">62%</td>
                        <td className="py-3">
                          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary w-[62%] rounded-full"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Retention Analysis Funnel */}
              <div className="glass-card rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest col-span-12 lg:col-span-4 flex flex-col justify-between shadow-sm">
                <h2 className="text-base font-bold text-on-surface mb-4">Retention Analysis</h2>
                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  <div className="w-full h-11 bg-primary-container/20 rounded-xl flex items-center justify-between px-4 text-xs font-semibold">
                    <span>Initial Enrolment</span>
                    <span className="font-extrabold text-primary">100%</span>
                  </div>
                  <div className="w-[88%] mx-auto h-11 bg-primary-container/30 rounded-xl flex items-center justify-between px-4 text-xs font-semibold">
                    <span>Module 1 Completed</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="w-[75%] mx-auto h-11 bg-primary-container/40 rounded-xl flex items-center justify-between px-4 text-xs font-semibold">
                    <span>Simulation Started</span>
                    <span className="font-bold">70%</span>
                  </div>
                  <div className="w-[65%] mx-auto h-11 bg-primary text-on-primary rounded-xl flex items-center justify-between px-4 text-xs font-bold shadow-sm">
                    <span>Fully Certified</span>
                    <span>62%</span>
                  </div>

                  <div className="text-center pt-3 text-xs font-bold text-error flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Highest drop-off after Module 1
                  </div>
                </div>
              </div>

            </div>

            {/* Employment Outcomes Section */}
            <div className="pt-8 border-t border-outline-variant/80 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                    Post-Programme Outcomes
                  </span>
                  <h2 className="text-2xl font-extrabold text-on-background tracking-tight">Employment Outcomes</h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Monitor placement performance, time-to-hire metrics, and industry distributions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-xs font-medium hover:bg-surface-container-low transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    This Quarter
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary font-bold text-xs rounded-xl hover:bg-primary transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export Outcomes Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">event_available</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary font-bold text-xs">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant mb-1">Interviews Scheduled</p>
                    <p className="text-4xl font-extrabold text-on-background">84</p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">apartment</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary font-bold text-xs">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> 8%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant mb-1">Employer Placements</p>
                    <p className="text-4xl font-extrabold text-on-background">32</p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined">work</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary font-bold text-xs">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> 15%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant mb-1">Job Offers Accepted</p>
                    <p className="text-4xl font-extrabold text-on-background">28</p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">timer</span>
                      </div>
                      <h3 className="text-base font-bold text-on-background">Average Time to Employment</h3>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 mt-auto">
                    <p className="text-4xl font-extrabold text-on-background leading-none">4.5</p>
                    <p className="text-sm font-semibold text-on-surface-variant mb-1">weeks</p>
                  </div>
                  <div className="mt-6 w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[45%] relative">
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-3 text-right font-medium">Target: &lt; 6 weeks</p>
                </div>

                <div className="col-span-12 md:col-span-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                      </div>
                      <h3 className="text-base font-bold text-on-background">Employment Rate</h3>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mt-auto">
                    <p className="text-4xl font-extrabold text-on-background leading-none">68</p>
                    <p className="text-sm font-semibold text-on-surface-variant mb-1">%</p>
                  </div>
                  <div className="mt-6 w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full w-[68%] relative">
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-3 text-right font-medium">Across all programmes</p>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-on-background">Placements by Industry</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Distribution of accepted offers across sectors</p>
                    </div>
                    <button className="text-primary font-bold text-xs hover:underline">View All Data</button>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-28 text-xs font-bold text-on-surface truncate">Technology</div>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary rounded-full w-[45%]"></div>
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-on-surface-variant">45%</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-28 text-xs font-bold text-on-surface truncate">Finance</div>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary/80 rounded-full w-[25%]"></div>
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-on-surface-variant">25%</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-28 text-xs font-bold text-on-surface truncate">Healthcare</div>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary/60 rounded-full w-[18%]"></div>
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-on-surface-variant">18%</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-28 text-xs font-bold text-on-surface truncate">Education</div>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary/40 rounded-full w-[12%]"></div>
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-on-surface-variant">12%</div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-span-1 rounded-2xl relative overflow-hidden shadow-sm border border-outline-variant min-h-[280px] flex items-center justify-center p-6 group cursor-pointer"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCENsOwyG66mBMDnNgDkUaHVO4jvRx-EYKr0OxaUUNuAB4eKay0HEPAxhCmKf5piR2R0VF1tCx9FAS0rJ-w4wxtugQ8JpuE4QcT74E5-uJTuET0zV1ikfUYyrvqXrbG9AuM-xSQ_lR5GH-NhKxn_dFqSKcCUhHjxGsN7c5pJbCk13--6FXXK8IrTv2Ui530Vm1zELINEy1eNeLHDMWQoZMnYKJnarhcP68eyZtJ9w6Qs244KVaB1zThA')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-inverse-surface/40 group-hover:bg-inverse-surface/30 transition-colors"></div>
                  <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-6 w-full text-center border border-white/40 shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 mx-auto bg-primary text-on-primary rounded-full flex items-center justify-center shadow-sm mb-3">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <h3 className="text-base font-extrabold text-on-background mb-1">Impact Summary</h3>
                    <p className="text-xs text-on-surface-variant mb-5">
                      Generate a comprehensive summary for government agencies and strategic partners.
                    </p>
                    <button
                      onClick={() => alert("Comprehensive Government Impact Report Generated!")}
                      className="w-full py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= TAB CONTENT 5: REPORTS ================= */}
        {activeNavTab === 'reports' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Compliance & Analytics Export
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Reports</h1>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
                  Generate, view, and export institutional performance metrics and impact analyses.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-primary-container text-on-primary font-bold text-xs py-3 px-6 rounded-xl shadow-sm hover:bg-primary transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                {downloadNotice ? 'Exported CSV!' : 'Download All Data'}
              </button>
            </div>

            {/* Generation Tiles Grid (4 Action Tiles) */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Tile 1 */}
              <button
                onClick={handleExportCSV}
                className="flex flex-col text-left bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 hover:border-primary hover:shadow-md transition-all group h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors text-primary relative z-10 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">assignment</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 relative z-10 group-hover:text-primary transition-colors">Export Programme Report</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed flex-1 relative z-10">
                  Detailed metrics on learner engagement and completion. Generate structured verification for grant funders and government bodies.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary relative z-10">
                  Generate <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>

              {/* Tile 2 */}
              <button
                onClick={handleExportCSV}
                className="flex flex-col text-left bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 hover:border-secondary hover:shadow-md transition-all group h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-on-secondary transition-colors text-secondary relative z-10 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">moving</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 relative z-10 group-hover:text-secondary transition-colors">Download Impact Report</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed flex-1 relative z-10">
                  Comprehensive analysis of long-term outcomes and institutional ROI metrics.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-secondary relative z-10">
                  Generate <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>

              {/* Tile 3 */}
              <button
                onClick={() => alert("AI Readiness Assessment Report Generated.")}
                className="flex flex-col text-left bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 hover:border-tertiary-container hover:shadow-md transition-all group h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-tertiary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-tertiary-container group-hover:text-on-tertiary-container transition-colors text-tertiary-container relative z-10 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">fact_check</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 relative z-10 group-hover:text-tertiary-container transition-colors">Generate Readiness Report</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed flex-1 relative z-10">
                  Assess organizational preparedness for upcoming AI integration initiatives.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-tertiary-container relative z-10">
                  Generate <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>

              {/* Tile 4 */}
              <button
                onClick={() => alert("Employer Performance Summary Shared.")}
                className="flex flex-col text-left bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 hover:border-primary hover:shadow-md transition-all group h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors text-primary relative z-10 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">share</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 relative z-10 group-hover:text-primary transition-colors">Share Employer Performance</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed flex-1 relative z-10">
                  External-facing summary of partnership achievements for stakeholder review.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary relative z-10">
                  Share <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>

            </section>

            {/* Bento Grid Layout for Lists & Glassmorphism Impact Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Reports (List View, Spans 2 Cols) */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                  <h3 className="text-base font-bold text-on-surface">Recent Reports</h3>
                  <button className="text-xs font-bold text-primary hover:underline">View All</button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ul className="divide-y divide-outline-variant/50">
                    {recentReports.map((rep) => (
                      <li
                        key={rep.id}
                        onClick={handleExportCSV}
                        className="px-6 py-4 hover:bg-surface-container-low transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center transition-colors ${rep.iconClass}`}>
                              <span className="material-symbols-outlined text-[20px]">{rep.icon}</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-on-surface mb-0.5 group-hover:text-primary transition-colors">{rep.title}</p>
                              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                <span className="inline-flex items-center gap-1 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-secondary"></span> {rep.category}
                                </span>
                                <span>•</span>
                                <span>{rep.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleExportCSV(); }}
                              className="text-outline hover:text-primary transition-colors p-2"
                              title="Download Report CSV"
                            >
                              <span className="material-symbols-outlined text-[20px]">download</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Impact Summaries (Glassmorphism Card, Spans 1 Col) */}
              <div className="bg-primary text-on-primary rounded-2xl border border-primary-fixed-dim/30 shadow-lg overflow-hidden relative h-[500px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-container/30 rounded-full mix-blend-screen filter blur-2xl -translate-x-1/4 translate-y-1/4"></div>
                
                <div className="relative z-10 px-6 py-4 border-b border-white/10">
                  <h3 className="text-base font-bold text-white">Impact Summaries</h3>
                </div>

                <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                      <p className="text-xs text-primary-fixed-dim mb-1 font-medium">Outcome Verification: Learners Placed</p>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-white">1,248</span>
                        <span className="flex items-center text-secondary-container font-bold text-xs mb-1">
                          <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12% vs last year
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                      <p className="text-xs text-primary-fixed-dim mb-1 font-medium">Funding Utilization: Retention Rate</p>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-white">94%</span>
                        <span className="flex items-center text-secondary-container font-bold text-xs mb-1">
                          <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 2.1% improvement
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveNavTab('analytics')}
                    className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Detailed Dashboard <span class="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
