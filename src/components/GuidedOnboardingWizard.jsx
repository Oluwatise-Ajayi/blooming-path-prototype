import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

// ── Track metadata for the redirect UI ──────────────────────
const TRACK_CARDS = [
  { id: 'pathway-admin-asst',     name: 'Administrative Assistant',        icon: 'admin_panel_settings', color: '#4f8ef7' },
  { id: 'pathway-health-support', name: 'Health & Social Care Support',     icon: 'health_and_safety',    color: '#34a07a' },
  { id: 'pathway-retail-customer',name: 'Retail & Customer Service',        icon: 'storefront',            color: '#e87a2e' },
  { id: 'pathway-hospitality',    name: 'Hospitality & Catering Assistant', icon: 'restaurant',            color: '#9b59b6' },
  { id: 'pathway-cleaning-fm',    name: 'Cleaning & Facilities Management', icon: 'cleaning_services',     color: '#17a589' },
];

const QUESTIONS = [
  {
    id: 1,
    prompt: "Tell us about the kind of work you'd like to do in the UK.",
    subtitle: "Describe the roles, industries, or types of tasks you enjoy or want to explore.",
    options: [
      "Office or administrative work",
      "Healthcare or care home support",
      "Shop, supermarket, or customer service",
      "Hotel, restaurant, or catering",
      "Cleaning or building services"
    ]
  },
  {
    id: 2,
    prompt: "Tell us about any work or volunteering experience you have had.",
    subtitle: "Even informal or community experience helps us understand your background.",
    options: [
      "Office or administrative volunteering",
      "Care or healthcare-related role",
      "Customer or public-facing role",
      "Community or charity organisation",
      "No formal work experience yet"
    ]
  },
  {
    id: 3,
    prompt: "How comfortable do you feel using computers for everyday work?",
    subtitle: "Such as sending emails, managing schedules, or typing documents.",
    options: ["Very comfortable", "Moderately comfortable", "Basic familiarity", "Need guidance and practice"]
  },
  {
    id: 4,
    prompt: "How confident do you feel speaking with customers, colleagues, or members of the public?",
    subtitle: "Whether on the phone, in person, or via video calls.",
    options: ["Very confident", "Moderately confident", "A bit nervous but eager to learn", "Prefer written communication"]
  },
  {
    id: 5,
    prompt: "When would you be available to start work?",
    subtitle: "Let us know your general timeline and availability.",
    options: ["Immediately", "Within 2 weeks", "Within 1 month", "Flexible / Part-time"]
  }
];

export default function GuidedOnboardingWizard({ userEmail, currentLang, onCompleteOnboarding, onBackToRegister }) {
  const [individual, setIndividual] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [inputMode, setInputMode] = useState('speak');

  // Voice state machine: 'READY', 'LISTENING', 'PROCESSING', 'TRANSCRIPT'
  const [voiceState, setVoiceState] = useState('READY');
  const [transcriptText, setTranscriptText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alignmentResult, setAlignmentResult] = useState(null);

  // Real-time AI feedback state
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  // Tentative track shown during onboarding
  const [tentativeTrack, setTentativeTrack] = useState(null);

  const recognitionRef = useRef(null);
  const currentQ = QUESTIONS[currentQIndex];

  // ── Initialize session on mount ────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const ind = await api.getOrCreateIndividual(
          userEmail || 'new.user@example.com',
          userEmail?.split('@')[0]?.replace(/[._]/g, ' ') || 'New User',
          currentLang
        );
        setIndividual(ind);
        const session = await api.startOnboardingSession(ind.id);
        setSessionId(session.id);
      } catch (err) {
        console.error('Failed to initialize onboarding session:', err);
      }
    }
    init();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) setSpeechSupported(false);
  }, [userEmail, currentLang]);

  // ── TTS helper ─────────────────────────────────────────────
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ── Start voice recording ─────────────────────────────────
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSpeechSupported(false); return; }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';

      recognition.onstart = () => setVoiceState('LISTENING');
      recognition.onresult = (e) => {
        const resultText = e.results[0][0].transcript;
        setVoiceState('PROCESSING');
        setTimeout(() => {
          setTranscriptText(resultText);
          setTextInput(resultText);
          setVoiceState('TRANSCRIPT');
        }, 400);
      };
      recognition.onerror = (event) => {
        setVoiceState('READY');
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert('Microphone access is blocked. Please ensure you are on HTTPS and allow microphone permissions.');
        }
      };
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setVoiceState('READY');
    }
  };

  // ── Fetch real-time AI feedback after each answer ──────────
  const fetchAIFeedback = async (answer) => {
    setIsFetchingFeedback(true);
    setAiFeedback(null);
    try {
      const feedback = await api.getOnboardingFeedback(currentQ.prompt, answer, currentQIndex);
      setAiFeedback(feedback);

      if (feedback.redirect_needed) {
        setShowRedirect(true);
        speakText("I can see you have big ambitions! BloomingPath supports specific pathways for foreigners in the UK. Let me show you what's available.");
      } else {
        if (feedback.reaction) speakText(feedback.reaction);
        if (feedback.tentative_track_name) {
          setTentativeTrack({ id: feedback.tentative_track_id, name: feedback.tentative_track_name });
        }
      }
    } catch (err) {
      console.error('AI feedback error:', err);
      // Non-blocking — continue even if AI feedback fails
    } finally {
      setIsFetchingFeedback(false);
    }
  };

  // ── Submit answer ─────────────────────────────────────────
  const handleConfirmAnswer = async (answer) => {
    const finalAnswer = answer || transcriptText || textInput;
    if (!finalAnswer || !sessionId || !individual) return;

    // 1. Get real-time AI feedback first (non-blocking for navigation)
    fetchAIFeedback(finalAnswer);

    setIsSubmitting(true);
    try {
      await api.recordOnboardingInteraction(
        sessionId, individual.id, inputMode,
        currentQ.prompt, finalAnswer, finalAnswer
      );

      // Reset input states
      setVoiceState('READY');
      setTranscriptText('');
      setTextInput('');

      if (currentQIndex < QUESTIONS.length - 1) {
        // Small delay to let AI feedback show before advancing
        setTimeout(() => {
          setCurrentQIndex(prev => prev + 1);
          setAiFeedback(null);
          setShowRedirect(false);
        }, aiFeedback?.redirect_needed ? 99999 : 2200); // Hold on redirect screens until dismissed
      } else {
        // Final question — complete onboarding
        setTimeout(async () => {
          const result = await api.completeOnboardingSession(sessionId);
          setAlignmentResult(result);
          setAiFeedback(null);
          setShowRedirect(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit onboarding answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Dismiss redirect and continue ─────────────────────────
  const handleDismissRedirect = () => {
    setShowRedirect(false);
    setAiFeedback(null);
    setVoiceState('READY');
    setTranscriptText('');
    setTextInput('');
  };

  // ── Track card helper ─────────────────────────────────────
  const getTrackCard = (trackId) => TRACK_CARDS.find(t => t.id === trackId);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">spa</span>
            <span className="font-bold text-base text-on-surface">BloomingPath — Career Onboarding</span>
          </div>
          {onBackToRegister && (
            <button onClick={onBackToRegister} className="text-xs font-semibold text-on-surface-variant hover:text-on-surface">
              Exit
            </button>
          )}
        </div>

        {/* ── ALIGNMENT RESULT SCREEN ── */}
        {alignmentResult ? (
          <AlignmentResultScreen
            alignmentResult={alignmentResult}
            onEnterPortal={() => onCompleteOnboarding(alignmentResult.assigned_pathway.id)}
            getTrackCard={getTrackCard}
            speakText={speakText}
          />

        ) : showRedirect && aiFeedback?.redirect_needed ? (
          /* ── OUT-OF-SCOPE REDIRECT SCREEN ── */
          <RedirectScreen
            redirectMessage={aiFeedback.redirect_message}
            onContinue={handleDismissRedirect}
          />

        ) : (
          /* ── QUESTION WIZARD ── */
          <div className="space-y-5">

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>Question {currentQIndex + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((currentQIndex + 1) / QUESTIONS.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tentative Track Hint */}
            {tentativeTrack && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary-container/40 border border-secondary/20 text-xs">
                <span className="material-symbols-outlined text-secondary text-[16px]">auto_awesome</span>
                <span className="text-on-surface-variant">AI is leaning towards: <strong className="text-on-surface">{tentativeTrack.name}</strong></span>
              </div>
            )}

            {/* Question */}
            <div className="text-center space-y-2 py-2">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">{currentQ.prompt}</h2>
                <button
                  onClick={() => speakText(currentQ.prompt)}
                  className="p-1 rounded-full text-primary hover:bg-surface-container-high transition-colors"
                  title="Listen to question"
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">{currentQ.subtitle}</p>
            </div>

            {/* AI Feedback Bubble */}
            {isFetchingFeedback && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-primary-container/20 border border-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                <span className="text-xs text-on-surface-variant">AI is processing your response...</span>
              </div>
            )}
            {aiFeedback && !aiFeedback.redirect_needed && !isFetchingFeedback && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary-container/30 border border-secondary/20 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">smart_toy</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-1">AI Guide</p>
                  <p className="text-sm text-on-surface leading-relaxed">{aiFeedback.reaction}</p>
                </div>
              </div>
            )}

            {/* Input Mode Tabs */}
            <div className="flex justify-center border-b border-outline-variant/60 pb-3 gap-2">
              {[
                { mode: 'speak', icon: 'mic', label: 'Speak' },
                { mode: 'type', icon: 'edit_note', label: 'Type' },
                { mode: 'choose', icon: 'touch_app', label: 'Choose' }
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    inputMode === mode ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* ── SPEAK MODE ── */}
            {inputMode === 'speak' && (
              <div className="flex flex-col items-center space-y-4 py-4">
                {!speechSupported && (
                  <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-xs text-error font-medium w-full text-center">
                    Voice recognition is unavailable in this browser. Please type or choose an option.
                  </div>
                )}
                <div className="w-24 h-24 rounded-full bg-primary-container/20 border-2 border-primary flex items-center justify-center relative my-2">
                  {voiceState === 'LISTENING' && (
                    <div className="absolute inset-0 rounded-full bg-secondary-container/40 animate-ping" />
                  )}
                  <span className="material-symbols-outlined text-primary text-[48px]">
                    {voiceState === 'LISTENING' ? 'graphic_eq' : voiceState === 'PROCESSING' ? 'more_horiz' : 'mic'}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {voiceState === 'READY' && 'READY TO RECORD'}
                    {voiceState === 'LISTENING' && 'LISTENING...'}
                    {voiceState === 'PROCESSING' && 'PROCESSING SPEECH...'}
                    {voiceState === 'TRANSCRIPT' && 'TRANSCRIPT CAPTURED'}
                  </span>
                </div>

                {voiceState === 'READY' && (
                  <button
                    onClick={startRecording}
                    className="px-8 py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                    Start Recording
                  </button>
                )}

                {voiceState === 'LISTENING' && (
                  <button
                    onClick={() => { setVoiceState('PROCESSING'); setTimeout(() => setVoiceState('TRANSCRIPT'), 400); }}
                    className="px-8 py-3 rounded-2xl bg-secondary text-on-secondary font-bold text-xs animate-pulse flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">stop</span>
                    Stop Recording
                  </button>
                )}

                {(voiceState === 'TRANSCRIPT' || transcriptText) && (
                  <div className="w-full space-y-3 animate-fadeIn">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-left">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Captured Transcript:</p>
                      <textarea
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary outline-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => speakText(transcriptText)}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        Replay
                      </button>
                      <button
                        onClick={startRecording}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                        Re-record
                      </button>
                      <button
                        onClick={() => handleConfirmAnswer(transcriptText)}
                        disabled={isSubmitting || isFetchingFeedback}
                        className="px-5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSubmitting ? <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> : null}
                        Confirm Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TYPE MODE ── */}
            {inputMode === 'type' && (
              <div className="space-y-4 py-2">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-32 p-4 rounded-2xl bg-surface-container-low border border-outline-variant text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleConfirmAnswer(textInput)}
                    disabled={!textInput.trim() || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 disabled:opacity-50"
                  >
                    Confirm Answer
                  </button>
                </div>
              </div>
            )}

            {/* ── CHOOSE MODE ── */}
            {inputMode === 'choose' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConfirmAnswer(opt)}
                    disabled={isSubmitting}
                    className="p-4 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary text-left text-xs font-semibold text-on-surface transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{opt}</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">chevron_right</span>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────

function AlignmentResultScreen({ alignmentResult, onEnterPortal, getTrackCard, speakText }) {
  const trackCard = getTrackCard(alignmentResult?.assigned_pathway?.id);
  const trackColor = trackCard?.color || '#4f8ef7';
  const trackIcon = trackCard?.icon || 'route';

  useEffect(() => {
    if (alignmentResult?.assigned_pathway?.name) {
      speakText(`Great news! You've been matched to the ${alignmentResult.assigned_pathway.name} pathway. Let's get started.`);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
        style={{ background: `${trackColor}22`, border: `2px solid ${trackColor}` }}
      >
        <span className="material-symbols-outlined text-[40px]" style={{ color: trackColor }}>{trackIcon}</span>
      </div>

      <div>
        <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold uppercase tracking-wider">
          Pathway Alignment Complete
        </span>
        <h2 className="text-2xl font-bold text-on-surface mt-3">
          {alignmentResult.assigned_pathway.name}
        </h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1 leading-relaxed">
          {alignmentResult.assigned_pathway.description}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant text-left space-y-3">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          Why This Pathway?
        </h4>
        <ul className="space-y-2">
          {alignmentResult.pathway_alignment.reasons.map((reason, idx) => (
            <li key={idx} className="text-xs text-on-surface flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onEnterPortal}
        className="w-full py-3.5 rounded-xl text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
        style={{ background: trackColor }}
      >
        <span>Enter Your Portal</span>
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );
}

function RedirectScreen({ redirectMessage, onContinue }) {
  return (
    <div className="space-y-6 animate-fadeIn text-center">
      <div className="w-16 h-16 rounded-full bg-tertiary-container/40 border-2 border-tertiary/40 flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-tertiary text-[36px]">info</span>
      </div>

      <div>
        <span className="px-3 py-1 rounded-full bg-tertiary-container/40 text-tertiary text-xs font-bold uppercase tracking-wider">
          About BloomingPath
        </span>
        <h2 className="text-xl font-bold text-on-surface mt-3">
          Let's find the right path for you
        </h2>
        <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
          BloomingPath is designed to help foreigners find accessible employment in the UK. We specialise in 5 pathways:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {[
          { id: 'pathway-admin-asst',      name: 'Administrative Assistant',        icon: 'admin_panel_settings', color: '#4f8ef7' },
          { id: 'pathway-health-support',  name: 'Health & Social Care Support',     icon: 'health_and_safety',    color: '#34a07a' },
          { id: 'pathway-retail-customer', name: 'Retail & Customer Service',        icon: 'storefront',            color: '#e87a2e' },
          { id: 'pathway-hospitality',     name: 'Hospitality & Catering',           icon: 'restaurant',            color: '#9b59b6' },
          { id: 'pathway-cleaning-fm',     name: 'Cleaning & Facilities',            icon: 'cleaning_services',     color: '#17a589' },
        ].map(track => (
          <div
            key={track.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container-low"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${track.color}22` }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: track.color }}>{track.icon}</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">{track.name}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-on-surface-variant px-2">
        Let's re-answer that question with one of these pathways in mind. Which type of work interests you most?
      </p>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Let me re-answer
      </button>
    </div>
  );
}
