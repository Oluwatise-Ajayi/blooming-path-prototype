import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

// Track metadata for dynamic theming
const TRACK_META = {
  'pathway-admin-asst':         { icon: 'admin_panel_settings', color: '#4f8ef7', accent: 'blue' },
  'pathway-health-support':     { icon: 'health_and_safety',    color: '#34a07a', accent: 'green' },
  'pathway-retail-customer':    { icon: 'storefront',            color: '#e87a2e', accent: 'orange' },
  'pathway-hospitality':        { icon: 'restaurant',            color: '#9b59b6', accent: 'purple' },
  'pathway-cleaning-fm':        { icon: 'cleaning_services',     color: '#17a589', accent: 'teal' },
  'pathway-warehouse-logistics':{ icon: 'warehouse',             color: '#c0932e', accent: 'amber' },
};

// ── Badge definitions ──────────────────────────────────────
const BADGE_DEFINITIONS = [
  // Onboarding badges
  { id: 'bdg-first-steps',       category: 'Onboarding',   icon: 'spa',             name: 'First Steps',          desc: 'Completed the BloomingPath registration',                color: '#4f8ef7', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-pathway-chosen',    category: 'Onboarding',   icon: 'route',           name: 'Pathway Chosen',       desc: 'Completed onboarding and received a pathway match',       color: '#34a07a', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-voice-pioneer',     category: 'Onboarding',   icon: 'mic',             name: 'Voice Pioneer',        desc: 'Used voice mode to complete at least 3 onboarding answers', color: '#9b59b6', earned: false, earnedDate: null },
  // Practice badges
  { id: 'bdg-first-sim',        category: 'Practice',     icon: 'sports_esports',  name: 'First Simulation',     desc: 'Completed your first workplace simulation',               color: '#e87a2e', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-triple-turn',      category: 'Practice',     icon: '3p',              name: 'Triple Turn',          desc: 'Completed all 3 turns in a workplace simulation',         color: '#17a589', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-fluent-comm',      category: 'Practice',     icon: 'record_voice_over', name: 'Fluent Communicator', desc: 'Scored "demonstrated" in communication capability',       color: '#4f8ef7', earned: false, earnedDate: null },
  { id: 'bdg-rapid-learner',    category: 'Practice',     icon: 'bolt',            name: 'Rapid Learner',        desc: 'Completed a simulation within 5 minutes',                 color: '#c0932e', earned: false, earnedDate: null },
  // Readiness badges
  { id: 'bdg-rising-star',      category: 'Readiness',    icon: 'star',            name: 'Rising Star',          desc: 'Achieved a "developing" overall readiness signal',        color: '#9b59b6', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-evidence-builder', category: 'Readiness',    icon: 'troubleshoot',    name: 'Evidence Builder',     desc: 'Generated 3 or more evidence records',                    color: '#34a07a', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-cap-demonstrated', category: 'Readiness',    icon: 'verified',        name: 'Capability Demonstrated', desc: 'Demonstrated 4+ capabilities in a single simulation',   color: '#4f8ef7', earned: false, earnedDate: null },
  // Milestone badges
  { id: 'bdg-profile-complete', category: 'Milestones',   icon: 'person_check',    name: 'Profile Complete',     desc: 'Filled in all profile fields',                            color: '#e87a2e', earned: false, earnedDate: null },
  { id: 'bdg-data-shared',      category: 'Milestones',   icon: 'verified_user',   name: 'Data Shared',          desc: 'Consented to share your data with employers',             color: '#17a589', earned: true,  earnedDate: 'Sep 2026' },
  { id: 'bdg-employer-ready',   category: 'Milestones',   icon: 'business_center', name: 'Employer Ready',       desc: 'Achieved "demonstrated" overall readiness signal',        color: '#c0932e', earned: false, earnedDate: null },
  { id: 'bdg-7-day-streak',     category: 'Milestones',   icon: 'local_fire_department', name: '7-Day Streak',   desc: 'Logged in and practised for 7 consecutive days',          color: '#e87a2e', earned: false, earnedDate: null },
];

export default function IndividualView({ userEmail, currentLang, onOpenEvidenceTrail }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'pathway', 'practice', 'readiness', 'evidence', 'badges', 'profile'
  const [individual, setIndividual] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState(null);

  // Workplace Simulation State
  const [simSessionId, setSimSessionId] = useState(null);
  const [simTurnNumber, setSimTurnNumber] = useState(1);
  const [turnHistory, setTurnHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [simInputMode, setSimInputMode] = useState('voice'); // 'voice', 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const turnHistoryEndRef = useRef(null);

  // Auto-scroll to bottom of turn history whenever history or AI thinking state changes
  useEffect(() => {
    if (turnHistoryEndRef.current) {
      turnHistoryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [turnHistory, isAiThinking]);

  // Load Individual & Readiness Data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const email = userEmail || 'amina.hassan@example.com';
        const displayName = email.split('@')[0].replace(/[._]/g, ' ') || 'User';
        const ind = await api.getOrCreateIndividual(email, displayName, currentLang);
        setIndividual(ind);

        const readiness = await api.getIndividualReadiness(ind.id);
        setReadinessData(readiness);

        const evidence = await api.getIndividualEvidence(ind.id);
        setEvidenceList(evidence);

        // Load the correct simulation for this individual's pathway
        if (readiness?.readiness_profile?.pathway_id) {
          try {
            const sim = await api.getSimulationByPathway(readiness.readiness_profile.pathway_id);
            setCurrentSimulation(sim);
          } catch {
            // Simulation not yet available for this pathway
            setCurrentSimulation(null);
          }
        }
      } catch (err) {
        console.error('Failed to load Individual data:', err);
      }
    }
    loadData();
  }, [userEmail, currentLang]);

  // Audio Speech Synthesis helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLang === 'ar') utterance.lang = 'ar-SA';
      else if (currentLang === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Simulation Session — uses the track-specific simulation
  const handleStartSimulation = async () => {
    if (!individual) return;
    try {
      setEvaluationResult(null);
      setTurnHistory([]);
      setSimTurnNumber(1);

      // Determine simulation ID: use current track's simulation, fallback to admin
      const pathwayId = readinessData?.readiness_profile?.pathway_id;
      let simToLoad = currentSimulation;
      if (!simToLoad && pathwayId) {
        try { simToLoad = await api.getSimulationByPathway(pathwayId); } catch {}
      }
      const simulationId = simToLoad?.id || 'sim-appointment-scheduling';

      const { session, simulation } = await api.startSimulationSession(individual.id, simulationId);
      setSimSessionId(session.id);
      if (simulation) setCurrentSimulation(simulation);

      // Opening line: use simulation's scenario or generic prompt
      const openingLine = "Hello, I'm calling about my appointment. I was wondering if we could make a change — could you help me please?";
      const initialPrompt = { speaker: 'simulated_customer', transcript: openingLine };
      setTurnHistory([initialPrompt]);
      speakText(openingLine);
    } catch (err) {
      console.error('Failed to start simulation:', err);
    }
  };

  // Handle Speech Recording in Simulation
  const handleStartVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setIsRecording(false);
        handleSendTurn(text);
      };
      recognition.onerror = (event) => {
        setIsRecording(false);
        console.warn('Speech recognition error on mobile/browser:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert('Microphone access is blocked. Please ensure you are using HTTPS (https://...) and allow microphone permissions in your phone browser settings, or switch to Text mode.');
        }
      };
      recognition.start();
    } else {
      // Fallback for browsers without Web Speech API
      setIsRecording(true);
      setTimeout(() => {
        const fallbackText = "I understand you need 10am, but that slot is currently occupied. I can offer 11:30 instead or check another day for you.";
        setIsRecording(false);
        handleSendTurn(fallbackText);
      }, 2000);
    }
  };

  // Submit Simulation Turn (Individual Turn -> Backend -> AI Response)
  const handleSendTurn = async (userTranscript) => {
    const textToSend = userTranscript || inputText;
    if (!textToSend || !simSessionId || isAiThinking) return;

    setInputText('');

    // Append Individual Turn locally
    const indTurn = { speaker: 'individual', transcript: textToSend };
    setTurnHistory(prev => [...prev, indTurn]);
    setIsAiThinking(true);

    try {
      const turnResponse = await api.recordSimulationTurn(simSessionId, simTurnNumber, simInputMode, textToSend);

      // Append AI Customer Turn
      const aiTurn = { speaker: 'simulated_customer', transcript: turnResponse.ai_response.message };
      setTurnHistory(prev => [...prev, aiTurn]);
      setSimTurnNumber(turnResponse.turn_number);
      speakText(turnResponse.ai_response.message);

      // If Turn 3 completed -> Trigger AI Evaluation
      if (simTurnNumber >= 2) {
        handleEvaluateSimulationSession(simSessionId);
      }
    } catch (err) {
      console.error('Failed to process simulation turn:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Evaluate Simulation Session
  const handleEvaluateSimulationSession = async (sessionId) => {
    setIsEvaluating(true);
    try {
      const evalRes = await api.evaluateSimulationSession(sessionId);
      setEvaluationResult(evalRes);

      // Refresh readiness & evidence
      if (individual) {
        const readiness = await api.getIndividualReadiness(individual.id);
        setReadinessData(readiness);

        const evidence = await api.getIndividualEvidence(individual.id);
        setEvidenceList(evidence);
      }
    } catch (err) {
      console.error('Failed to evaluate simulation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Primary Navigation Tabs per Specification */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full scrollbar-none">
          {[
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'pathway', label: 'My Pathway', icon: 'route' },
            { id: 'practice', label: 'Workplace Practice', icon: 'sports_esports' },
            { id: 'readiness', label: 'Readiness', icon: 'analytics' },
            { id: 'evidence', label: 'Evidence', icon: 'troubleshoot' },
            { id: 'badges', label: 'Badges', icon: 'military_tech' },
            { id: 'profile', label: 'Profile', icon: 'person' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'practice' && !simSessionId) {
                  handleStartSimulation();
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: HOME ================= */}
      {activeTab === 'home' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Welcome Banner — track-aware */}
          {(() => {
            const pathwayId = readinessData?.readiness_profile?.pathway_id;
            const meta = TRACK_META[pathwayId] || TRACK_META['pathway-admin-asst'];
            const pathwayName = readinessData?.readiness_profile?.pathway_name || 'Administrative Assistant';
            return (
              <div
                className="p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                style={{ background: `linear-gradient(135deg, ${meta.color}18, ${meta.color}08)`, border: `1.5px solid ${meta.color}44` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}22` }}>
                    <span className="material-symbols-outlined text-[26px]" style={{ color: meta.color }}>{meta.icon}</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block" style={{ background: `${meta.color}22`, color: meta.color }}>
                      Assigned Pathway: {pathwayName}
                    </span>
                    <h2 className="text-2xl font-bold text-on-background">Welcome, {individual?.display_name || 'User'}</h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Your workforce readiness profile is active. Practice your track scenario to build capability evidence.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActiveTab('practice'); handleStartSimulation(); }}
                    className="px-5 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
                    style={{ background: meta.color }}
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    Start Workplace Simulation
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Quick Metrics Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Prototype Readiness Indicator</span>
              <div className="my-4">
                <span className="text-3xl font-extrabold text-primary capitalize">
                  {readinessData?.readiness_profile?.overall_signal || 'Demonstrated'}
                </span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Aggregated from persisted workplace interaction evidence.
                </p>
              </div>
              <button onClick={() => setActiveTab('readiness')} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                View Readiness Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Verified Evidence Records</span>
              <div className="my-4">
                <span className="text-3xl font-extrabold text-secondary">{evidenceList.length}</span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Observable behaviours evaluated against capability rubrics.
                </p>
              </div>
              <button onClick={() => setActiveTab('evidence')} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                Inspect Evidence Trail <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target Role Alignment</span>
              <div className="my-4">
                <span className="text-xl font-bold text-on-surface">
                  {readinessData?.readiness_profile?.pathway_name || 'Administrative Assistant'}
                </span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {readinessData?.readiness_profile?.pathway_description || 'Office administration, scheduling, and customer communication.'}
                </p>
              </div>
              <button onClick={() => setActiveTab('pathway')} className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                Pathway Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY PATHWAY ================= */}
      {activeTab === 'pathway' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-primary-fixed space-y-4">
            {(() => {
              const pathwayId = readinessData?.readiness_profile?.pathway_id;
              const meta = TRACK_META[pathwayId] || TRACK_META['pathway-admin-asst'];
              const pathwayName = readinessData?.readiness_profile?.pathway_name || 'Administrative Assistant';
              const pathwayDesc = readinessData?.readiness_profile?.pathway_description || 'Prepares individuals for administrative, scheduling, customer contact, and office operations roles.';
              return (
                <>
                  <div className="flex items-start gap-4 border-b border-outline-variant pb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}22` }}>
                      <span className="material-symbols-outlined text-[26px]" style={{ color: meta.color }}>{meta.icon}</span>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block" style={{ background: `${meta.color}22`, color: meta.color }}>
                        Workforce Pathway
                      </span>
                      <h2 className="text-xl font-bold text-on-surface">{pathwayName}</h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">{pathwayDesc}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Pathway Details</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Your onboarding responses were analysed to match you with the <strong className="text-on-surface">{pathwayName}</strong> pathway.
                      Workplace simulations for this track are designed to assess capabilities relevant to real UK employer requirements in this sector.
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= TAB 3: WORKPLACE PRACTICE (SIMULATION) ================= */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-primary-fixed space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-outline-variant gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  Role-Specific Simulation
                </span>
                <h2 className="text-xl font-bold text-on-surface">
                  {currentSimulation?.title || readinessData?.readiness_profile?.pathway_name || 'Workplace Practice Simulation'}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {currentSimulation?.description || 'Multi-turn conversational scenario to build and evidence your workplace capabilities.'}
                </p>
              </div>

              {!simSessionId && (
                <button
                  onClick={handleStartSimulation}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all shadow-sm"
                >
                  Start Simulation
                </button>
              )}
            </div>

            {/* Schedule View Panel */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Office Schedule Context</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                  <span className="font-mono text-[10px] text-outline block">09:00</span>
                  <span className="font-semibold text-on-surface">Team meeting</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                  <span className="font-mono text-[10px] text-outline block">10:00</span>
                  <span className="font-semibold text-on-surface">Sarah Ahmed</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                  <span className="font-mono text-[10px] text-outline block">10:00</span>
                  <span className="font-semibold text-on-surface">James Wilson</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-secondary text-secondary font-bold">
                  <span className="font-mono text-[10px] text-secondary block">11:30</span>
                  <span>Michael Brown</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60">
                  <span className="font-mono text-[10px] text-outline block">14:00</span>
                  <span className="font-semibold text-on-surface">Priya Shah</span>
                </div>
              </div>
            </div>

            {/* Turn History Stream */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
              {turnHistory.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
                    turn.speaker === 'individual'
                      ? 'bg-secondary-container/20 border-secondary ml-8'
                      : 'bg-surface-container-high/60 border-primary-fixed mr-8'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      turn.speaker === 'individual'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-primary text-on-primary'
                    }`}
                  >
                    {turn.speaker === 'individual'
                      ? (individual?.display_name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'ME')
                      : 'SIM'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold mb-1 ${turn.speaker === 'individual' ? 'text-secondary' : 'text-primary'}`}>
                      {turn.speaker === 'individual' ? `${individual?.display_name || 'You'} (Individual)` : 'Simulated Character'}:
                    </p>
                    <p className="text-xs text-on-surface">{turn.transcript}</p>
                  </div>
                </div>
              ))}

              {/* AI Thinking / Typing Bubble */}
              {isAiThinking && (
                <div className="p-4 rounded-2xl border bg-primary-container/10 border-primary/30 mr-8 flex items-center gap-3 animate-fadeIn">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                      Simulated Character
                      <span className="text-[10px] font-normal text-on-surface-variant italic">(formulating response...)</span>
                    </p>
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={turnHistoryEndRef} />
            </div>

            {/* Input Controls */}
            {simSessionId && !evaluationResult && (
              <div className="pt-2 border-t border-outline-variant space-y-3">
                <div className="flex gap-2 justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimInputMode('voice')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        simInputMode === 'voice' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      Voice Mode
                    </button>
                    <button
                      onClick={() => setSimInputMode('text')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        simInputMode === 'text' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      Text Mode
                    </button>
                  </div>

                  <span className="text-xs text-on-surface-variant font-medium">Turn {simTurnNumber} of 3</span>
                </div>

                {simInputMode === 'voice' ? (
                  <div className="flex justify-center py-2">
                    <button
                      onClick={handleStartVoiceRecording}
                      disabled={isRecording || isAiThinking}
                      className={`px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                        isAiThinking
                          ? 'bg-surface-container-high text-on-surface-variant cursor-wait border border-outline-variant'
                          : isRecording
                          ? 'bg-secondary text-on-secondary animate-pulse'
                          : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      {isAiThinking ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                          AI is thinking...
                        </>
                      ) : isRecording ? (
                        <>
                          <span className="material-symbols-outlined text-[20px]">mic</span>
                          Listening & Transcribing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">mic</span>
                          Record Voice Answer
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      disabled={isAiThinking}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isAiThinking ? "Waiting for AI response..." : "Type your workplace response..."}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTurn(inputText)}
                    />
                    <button
                      onClick={() => handleSendTurn(inputText)}
                      disabled={!inputText.trim() || isAiThinking}
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isAiThinking && <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>}
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Evaluation Result View */}
            {isEvaluating && (
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant text-center space-y-2">
                <span className="material-symbols-outlined text-primary text-[32px] animate-spin">sync</span>
                <p className="text-xs font-bold text-on-surface">Evaluating transcript against capability rubrics...</p>
              </div>
            )}

            {evaluationResult && (
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-secondary space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">AI Evaluation & Evidence Generation Complete</h3>
                    <p className="text-xs text-on-surface-variant">{evaluationResult.evaluation.overall_summary}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-extrabold uppercase">
                    Overall Signal: {evaluationResult.evaluation.overall_signal}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evaluationResult.evaluation.capabilities.map((cap, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-on-surface capitalize">{cap.capability.replace('_', ' ')}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          cap.assessment === 'demonstrated' ? 'bg-secondary-container text-on-secondary-container' :
                          cap.assessment === 'developing' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-variant text-on-surface-variant'
                        }`}>
                          {cap.assessment}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">{cap.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= TAB 4: READINESS ================= */}
      {activeTab === 'readiness' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-primary-fixed space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                  Prototype Readiness Indicator
                </span>
                <h2 className="text-xl font-bold text-on-surface">Workforce Readiness Profile</h2>
                <p className="text-xs text-on-surface-variant">Evidence generated from workplace interactions</p>
              </div>

              <span className="px-4 py-1.5 rounded-xl bg-secondary-container text-on-secondary-container font-extrabold text-sm capitalize">
                {readinessData?.readiness_profile?.overall_signal || 'Demonstrated'}
              </span>
            </div>

            {/* Capability Signals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(readinessData?.capability_signals || []).map((sig, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-on-surface capitalize">{sig.capability.replace('_', ' ')}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sig.state === 'demonstrated' ? 'bg-secondary-container text-on-secondary-container' :
                      sig.state === 'developing' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {sig.state}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-on-surface-variant">
                    <span>Evidence Count: {sig.evidence_count}</span>
                    <span>Confidence: {sig.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: EVIDENCE ================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-primary-fixed space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Evidence Records</h2>
                <p className="text-xs text-on-surface-variant">Observable behaviours linked to specific workplace interactions</p>
              </div>
            </div>

            <div className="space-y-3">
              {evidenceList.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvidenceTrail(individual?.display_name, ev.capability, ev.assessment_state, ev.evidence_text)}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-primary">{ev.id}</span>
                      <span className="font-bold text-xs text-on-surface capitalize">{ev.capability.replace('_', ' ')}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ev.assessment_state === 'demonstrated' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'
                      }`}>
                        {ev.assessment_state}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant italic">"{ev.evidence_text}"</p>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-bold text-xs border border-outline-variant group-hover:bg-primary-container group-hover:text-on-primary transition-all shrink-0">
                    Inspect Traceability Chain
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: BADGES ================= */}
      {activeTab === 'badges' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #9b59b618, #4f8ef710)', border: '1.5px solid #9b59b644' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#9b59b622' }}>
                <span className="material-symbols-outlined text-[26px]" style={{ color: '#9b59b6' }}>military_tech</span>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block" style={{ background: '#9b59b622', color: '#9b59b6' }}>
                  Achievement Gallery
                </span>
                <h2 className="text-2xl font-bold text-on-background">Your Badges</h2>
                <p className="text-xs text-on-surface-variant mt-1">Keep practising to unlock more achievements and show employers your commitment.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center">
                <span className="text-3xl font-extrabold" style={{ color: '#9b59b6' }}>
                  {BADGE_DEFINITIONS.filter(b => b.earned).length}
                </span>
                <p className="text-[11px] text-on-surface-variant">Earned</p>
              </div>
              <div className="w-px h-10 bg-outline-variant" />
              <div className="text-center">
                <span className="text-3xl font-extrabold text-on-surface-variant">
                  {BADGE_DEFINITIONS.filter(b => !b.earned).length}
                </span>
                <p className="text-[11px] text-on-surface-variant">Locked</p>
              </div>
            </div>
          </div>

          {/* Badge Categories */}
          {['Onboarding', 'Practice', 'Readiness', 'Milestones'].map(category => {
            const badges = BADGE_DEFINITIONS.filter(b => b.category === category);
            const earnedCount = badges.filter(b => b.earned).length;
            return (
              <div key={category} className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {category === 'Onboarding' ? 'spa' : category === 'Practice' ? 'sports_esports' : category === 'Readiness' ? 'analytics' : 'flag'}
                    </span>
                    {category}
                  </h3>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {earnedCount}/{badges.length} earned
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      className={`relative p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                        badge.earned
                          ? 'border-2 shadow-sm hover:shadow-md'
                          : 'border border-outline-variant/50 opacity-50 grayscale'
                      }`}
                      style={badge.earned ? { borderColor: `${badge.color}55`, background: `${badge.color}08` } : {}}
                    >
                      {/* Badge Icon */}
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                          badge.earned ? 'shadow-sm' : 'bg-surface-container-high'
                        }`}
                        style={badge.earned ? { background: `${badge.color}22`, border: `2px solid ${badge.color}66` } : {}}
                      >
                        <span
                          className="material-symbols-outlined text-[26px]"
                          style={{ color: badge.earned ? badge.color : '#888' }}
                        >
                          {badge.earned ? badge.icon : 'lock'}
                        </span>
                      </div>

                      {/* Badge Info */}
                      <div>
                        <p className={`text-[11px] font-bold ${badge.earned ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {badge.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">
                          {badge.earned ? badge.desc : badge.desc}
                        </p>
                      </div>

                      {/* Earned date or locked label */}
                      {badge.earned ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${badge.color}22`, color: badge.color }}
                        >
                          {badge.earnedDate}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                          Keep going!
                        </span>
                      )}

                      {/* Glow effect for earned */}
                      {badge.earned && (
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                          style={{ boxShadow: `0 0 20px ${badge.color}33`, pointerEvents: 'none' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Encouragement Banner */}
          <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[28px] shrink-0">local_fire_department</span>
            <div>
              <p className="text-sm font-bold text-on-surface">Keep the momentum going!</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Complete more workplace simulations and build your evidence to unlock the remaining {BADGE_DEFINITIONS.filter(b => !b.earned).length} badges.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('practice')}
              className="ml-auto px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Practise Now
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 7: PROFILE ================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-primary-fixed space-y-4">
            <h2 className="text-xl font-bold text-on-surface">Individual Profile</h2>
            <div className="space-y-2 text-xs text-on-surface">
              <p><strong>Display Name:</strong> {individual?.display_name}</p>
              <p><strong>Email:</strong> {individual?.email}</p>
              <p><strong>Availability:</strong> {individual?.availability || 'Immediate'}</p>
              <p><strong>Employment Interests:</strong> {individual?.employment_interests || 'Administration'}</p>
              <p><strong>Digital Confidence:</strong> {individual?.digital_confidence || 'Moderate'}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
