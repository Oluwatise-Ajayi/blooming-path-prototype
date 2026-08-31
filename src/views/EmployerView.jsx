import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import IndividualProfileModal from '../components/IndividualProfileModal';

export default function EmployerView({ onOpenEvidenceTrail }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'individuals', 'roles', 'evidence', 'insights', 'organisation'
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedMap, setInvitedMap] = useState({});

  useEffect(() => {
    async function loadEmployerData() {
      try {
        const data = await api.getEmployerCandidates();
        setCandidates(data);
      } catch (err) {
        console.error('Failed to load employer candidates:', err);
      }
    }
    loadEmployerData();
  }, []);

  const handleInvite = (id) => {
    setInvitedMap(prev => ({ ...prev, [id]: true }));
  };

  const filteredCandidates = candidates.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.alias.toLowerCase().includes(query) || c.pathway.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-background text-on-background pb-24 md:pb-8 pt-4">
      
      {/* Individual Profile Overlay */}
      {selectedCandidate && (
        <IndividualProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onInviteInterview={handleInvite}
        />
      )}

      {/* Primary Employer Sub-Header Navigation Tabs per Specification */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/60 pb-3 gap-4">
        <div className="flex gap-4 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'individuals', label: 'Individuals', icon: 'group' },
            { id: 'roles', label: 'Roles', icon: 'work' },
            { id: 'evidence', label: 'Evidence', icon: 'troubleshoot' },
            { id: 'insights', label: 'Insights', icon: 'insights' },
            { id: 'organisation', label: 'Organisation', icon: 'domain' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-bold text-xs md:text-sm py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-secondary bg-secondary-container/20 px-3 py-1 rounded-full border border-secondary/30">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Privacy Protected Employer View</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">Workforce Intelligence Overview</h2>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Access verified capability signals and evidence summaries generated from workplace interactions.
                </p>
              </div>
            </div>

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
                <p className="text-xs font-medium text-on-surface-variant mb-1">Active Candidates</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">{candidates.length || 3}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
                <p className="text-xs font-medium text-on-surface-variant mb-1">Target Pathways</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">Administrative Assistant</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
                <p className="text-xs font-medium text-on-surface-variant mb-1">Interviews Invited</p>
                <p className="text-2xl md:text-3xl font-extrabold text-on-background">{Object.keys(invitedMap).length}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
                <p className="text-xs font-medium text-on-surface-variant mb-1">Privacy Status</p>
                <p className="text-xs font-bold text-secondary mt-2">Transcripts Anonymized</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INDIVIDUALS DIRECTORY ================= */}
        {activeTab === 'individuals' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Search Filter Cluster */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Search candidates by pathway or alias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface-container-lowest focus:ring-1 focus:ring-primary outline-none font-medium"
                />
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCandidates.map((c) => (
                <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant flex flex-col justify-between hover:shadow-lg transition-all shadow-sm">
                  
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-on-surface flex items-center gap-1">
                          {c.alias}
                        </h3>
                        <p className="text-xs text-on-surface-variant">{c.pathway}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-extrabold capitalize">
                        {c.overall_signal}
                      </span>
                    </div>

                    {/* Role Alignment & Capability Summary */}
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Role Alignment:</span>
                        <span className="font-bold text-primary">Administrative Assistant</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Availability:</span>
                        <span className="font-bold text-secondary capitalize">{c.availability || 'Immediate'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Digital Confidence:</span>
                        <span className="font-bold text-tertiary capitalize">{c.digital_confidence || 'Moderate'}</span>
                      </div>
                    </div>

                    {/* Verified Capability Signals Badges */}
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Verified Capabilities:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(c.capability_signals || []).map((sig, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface text-[11px] font-medium border border-outline-variant/50 capitalize">
                            {sig.capability.replace('_', ' ')}: {sig.state}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-3 border-t border-outline-variant">
                    <button
                      onClick={() => onOpenEvidenceTrail(c.alias, c.pathway, c.overall_signal, "Demonstrated clear communication and appointment conflict resolution in Appointment Scheduling simulation.")}
                      className="w-full py-2 rounded-xl bg-secondary-container/20 text-secondary font-bold text-xs hover:bg-secondary-container/40 border border-secondary/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
                      View Evidence Traceability Chain
                    </button>

                    <button
                      onClick={() => handleInvite(c.id)}
                      disabled={invitedMap[c.id]}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                        invitedMap[c.id]
                          ? 'bg-surface-variant text-on-surface-variant cursor-default'
                          : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {invitedMap[c.id] ? 'check_circle' : 'calendar_add_on'}
                      </span>
                      {invitedMap[c.id] ? 'Interview Invited' : 'Invite to Interview'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: ROLES ================= */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant space-y-4">
              <h2 className="text-xl font-bold text-on-surface">Role Alignment Framework</h2>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
                <h3 className="text-sm font-bold text-primary">Administrative Assistant Requisition</h3>
                <p className="text-xs text-on-surface-variant">Required capabilities: Communication (Demonstrated), Problem Solving (Demonstrated), Professionalism (Demonstrated).</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: EVIDENCE ================= */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant space-y-4">
              <h2 className="text-xl font-bold text-on-surface">Employer Evidence Traceability Log</h2>
              <p className="text-xs text-on-surface-variant">Inspect verified capability records without exposing raw private onboarding dialogues.</p>
              
              <div className="space-y-3">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenEvidenceTrail(c.alias, c.pathway, c.overall_signal, "Demonstrated clear communication and appointment conflict resolution.")}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-on-surface">{c.alias} — {c.pathway}</p>
                      <p className="text-[11px] text-on-surface-variant">Verified Evidence Records: {c.evidence_count || 3}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold">
                      View Traceability
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: INSIGHTS ================= */}
        {activeTab === 'insights' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant space-y-4">
              <h2 className="text-xl font-bold text-on-surface">Workforce Readiness Insights</h2>
              <p className="text-xs text-on-surface-variant">Aggregated capability distribution across candidates.</p>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ORGANISATION ================= */}
        {activeTab === 'organisation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant space-y-4">
              <h2 className="text-xl font-bold text-on-surface">Organisation Profile</h2>
              <p className="text-xs text-on-surface-variant">BloomingPath Employer Hub Settings</p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
