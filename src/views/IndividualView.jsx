import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function IndividualView({ currentLang, onOpenEvidenceTrail }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'pathway', 'practice', 'readiness', 'evidence', 'profile'
  const [individual, setIndividual] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);

  // Workplace Simulation State
  const [simSessionId, setSimSessionId] = useState(null);
  const [simTurnNumber, setSimTurnNumber] = useState(1);
  const [turnHistory, setTurnHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [simInputMode, setSimInputMode] = useState('voice'); // 'voice', 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Load Individual & Readiness Data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const ind = await api.getOrCreateIndividual('amina.hassan@example.com', 'Amina Hassan', currentLang);
        setIndividual(ind);

        const readiness = await api.getIndividualReadiness(ind.id);
        setReadinessData(readiness);

        const evidence = await api.getIndividualEvidence(ind.id);
        setEvidenceList(evidence);
      } catch (err) {
        console.error('Failed to load Individual data:', err);
      }
    }
    loadData();
  }, [currentLang]);

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

  // Start Simulation Session
  const handleStartSimulation = async () => {
    if (!individual) return;
    try {
      setEvaluationResult(null);
      setTurnHistory([]);
      setSimTurnNumber(1);

      const { session, simulation } = await api.startSimulationSession(individual.id, 'sim-appointment-scheduling');
      setSimSessionId(session.id);

      // Initial Customer Prompt Turn
      const initialPrompt = {
        speaker: 'simulated_customer',
        transcript: "Hi, I'm calling about my appointment today. Is it possible to move my 11:30 appointment to 10:00 am instead?"
      };
      setTurnHistory([initialPrompt]);
      speakText(initialPrompt.transcript);
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
      recognition.onerror = () => setIsRecording(false);
      recognition.start();
    } else {
      // Fallback
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
    if (!textToSend || !simSessionId) return;

    setInputText('');

    // Append Individual Turn locally
    const indTurn = { speaker: 'individual', transcript: textToSend };
    setTurnHistory(prev => [...prev, indTurn]);

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
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high p-6 rounded-2xl border border-primary-fixed relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                Assigned Pathway: Administrative Assistant
              </span>
              <h2 className="text-2xl font-bold text-on-background">Welcome, {individual?.display_name || 'Amina Hassan'}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Your workforce readiness infrastructure profile is active. Practice workplace scenarios to generate capability evidence.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveTab('practice');
                  handleStartSimulation();
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                Start Workplace Simulation
              </button>
            </div>
          </div>

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
                <span className="text-xl font-bold text-on-surface">Administrative Assistant</span>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Office scheduling, appointment triage, & customer communication.
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
            <div className="flex justify-between items-start border-b border-outline-variant pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  Workforce Pathway
                </span>
                <h2 className="text-xl font-bold text-on-surface">Administrative Assistant</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Prepares individuals for administrative, appointment scheduling, customer contact, and office operations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Pathway Alignment Rationale</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Matches stated work interests in office administration
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Builds on previous customer and office exposure
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  Aligns with spoken communication strengths
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-tertiary text-[16px]">info</span>
                  Digital confidence identified as an area to develop
                </li>
              </ul>
            </div>
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
                <h2 className="text-xl font-bold text-on-surface">Administrative Assistant — Appointment Scheduling</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Multi-turn conversational scenario. Manage schedule constraints while responding professionally.
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
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
                    {turn.speaker === 'individual' ? 'AH' : 'MB'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold mb-1 ${turn.speaker === 'individual' ? 'text-secondary' : 'text-primary'}`}>
                      {turn.speaker === 'individual' ? 'Amina Hassan (Individual)' : 'Michael Brown (Caller)'}:
                    </p>
                    <p className="text-xs text-on-surface">{turn.transcript}</p>
                  </div>
                </div>
              ))}
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
                      disabled={isRecording}
                      className={`px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md ${
                        isRecording ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">mic</span>
                      {isRecording ? 'Listening & Transcribing...' : 'Record Voice Answer'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your workplace response..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTurn(inputText)}
                    />
                    <button
                      onClick={() => handleSendTurn(inputText)}
                      disabled={!inputText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 disabled:opacity-50"
                    >
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

      {/* ================= TAB 6: PROFILE ================= */}
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
