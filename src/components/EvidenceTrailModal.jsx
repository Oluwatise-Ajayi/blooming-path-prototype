import React from 'react';

export default function EvidenceTrailModal({ isOpen, onClose, candidateName, capabilityName, score, transcriptSnippet, rubricDetails }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative">
        {/* Top Title Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary-container/30 text-secondary">
              <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                Evidence Traceability Chain
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                  Explainable AI
                </span>
              </h3>
              <p className="text-xs text-on-surface-variant">
                Derivation audit for <strong className="text-on-surface">{candidateName || 'Amina Hassan'}</strong> — {capabilityName || 'Workplace Communication'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Formula Banner */}
        <div className="my-4 p-3 rounded-xl bg-surface-container-low border border-primary-fixed text-center">
          <p className="text-xs font-semibold text-primary flex items-center justify-center gap-2 flex-wrap">
            <span>Interaction</span>
            <span className="text-outline">➔</span>
            <span>Transcript</span>
            <span className="text-outline">➔</span>
            <span>Structured Rubric</span>
            <span className="text-outline">➔</span>
            <span className="bg-secondary-container px-2 py-0.5 rounded text-on-secondary-container font-bold">Capability Score ({score || '95%'})</span>
          </p>
        </div>

        {/* Step-by-Step Chain Grid */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Step 1: Voice Interaction */}
          <div className="p-4 rounded-xl bg-surface border border-outline-variant relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">1</span>
                Learner Voice Interaction
              </span>
              <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">Healthcare Admin Scenario</span>
            </div>
            <p className="text-xs text-on-surface-variant italic">
              "Assessed during GP Clinic Appointment Booking simulation task."
            </p>
          </div>

          {/* Step 2: Verbatim Transcript */}
          <div className="p-4 rounded-xl bg-surface border border-outline-variant relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">2</span>
                Captured Speech-to-Text Transcript
              </span>
              <span className="text-[11px] text-secondary font-semibold">Verified Audio Match</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono">
              "{transcriptSnippet || 'Hello, I understand you need an urgent appointment today. Let me check Dr. Sharma’s schedule right away and confirm your emergency contact details to prioritize your slot.'}"
            </div>
          </div>

          {/* Step 3: Rubric Matching */}
          <div className="p-4 rounded-xl bg-surface border border-outline-variant relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">3</span>
                Capability Rubric Criteria Match
              </span>
              <span className="text-xs text-secondary font-bold">100% Criteria Pass</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Empathy & Active Listening
                </span>
                <span className="font-semibold text-secondary">High (Exceeded)</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Protocol Compliance (NHS Triage)
                </span>
                <span className="font-semibold text-secondary">Strong</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Problem Solving Under Stress
                </span>
                <span className="font-semibold text-secondary">Demonstrated</span>
              </li>
            </ul>
          </div>

          {/* Step 4: Final Derived Score */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-surface-container-low to-secondary-container/20 border border-secondary-container flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">Final Validated Capability Tier</p>
              <p className="text-xs text-on-surface-variant">No manual vetting required — fully audit-ready for hiring managers.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-secondary">{score || '95%'}</span>
              <p className="text-[10px] font-bold text-on-secondary-container uppercase">Interview Ready</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-outline-variant flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-semibold text-xs hover:bg-primary transition-colors"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
