import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

// ── Track metadata for the redirect UI ──────────────────────
const TRACK_CARDS = [
  { id: 'pathway-admin-asst',        name: 'Administrative Assistant',        icon: 'admin_panel_settings', color: '#4f8ef7' },
  { id: 'pathway-health-support',    name: 'Health & Social Care Support',     icon: 'health_and_safety',    color: '#34a07a' },
  { id: 'pathway-retail-customer',   name: 'Retail & Customer Service',        icon: 'storefront',            color: '#e87a2e' },
  { id: 'pathway-hospitality',       name: 'Hospitality & Catering Assistant', icon: 'restaurant',            color: '#9b59b6' },
  { id: 'pathway-cleaning-fm',       name: 'Cleaning & Facilities Management', icon: 'cleaning_services',     color: '#17a589' },
  { id: 'pathway-warehouse-logistics', name: 'Warehousing & Logistics Assistant', icon: 'warehouse',          color: '#c0932e' },
];

const CONFIDENCE_COLORS = { high: '#34a07a', medium: '#4f8ef7', low: '#9b59b6' };

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
      "Cleaning or building services",
      "Warehouse, logistics, or delivery work"
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
      "Warehouse, packing, or delivery work",
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
  },
  {
    id: 6,
    prompt: "How do you feel about physical or active work environments?",
    subtitle: "For example, being on your feet all day, lifting, or working in warehouses and outdoor settings.",
    options: [
      "I enjoy physical and active work",
      "I'm comfortable with some physical activity",
      "I prefer a desk-based or seated role",
      "I have health considerations to discuss with an employer"
    ]
  },
  {
    id: 7,
    prompt: "Do you enjoy helping, supporting, or caring for other people?",
    subtitle: "This could be in a professional, community, or family context.",
    options: [
      "Yes, helping people is one of my main motivations",
      "I enjoy it but it's not my primary focus",
      "I prefer working with tasks, systems, or products rather than people",
      "I haven't had much experience but I'm open to it"
    ]
  },
  {
    id: 8,
    prompt: "How confident are you handling money, counting change, or working with numbers day-to-day?",
    subtitle: "For example, operating a till, processing payments, or managing stock quantities.",
    options: [
      "Very confident — I've handled cash or financial tasks before",
      "Moderately confident — I can manage with some guidance",
      "I prefer roles that don't involve money handling",
      "I'd like to develop this skill"
    ]
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
  const [readyToAdvance, setReadyToAdvance] = useState(false);

  // Tentative track shown during onboarding
  const [tentativeTrack, setTentativeTrack] = useState(null);

  // Multi-recommendation selection state
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isConfirmingChoice, setIsConfirmingChoice] = useState(false);

  // Consent checkbox state
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentGate, setShowConsentGate] = useState(false);

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

  // ── Best-voice TTS helper ──────────────────────────────────
  const speakText = (text, onDone) => {
    if (!('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const lang = currentLang === 'ar' ? 'ar' : currentLang === 'fr' ? 'fr' : 'en';

      const preferred = [
        'Google UK English Female',
        'Google UK English Male',
        'Microsoft Libby',
        'Microsoft Sonia',
        'Microsoft Mia',
        'Karen',
        'Samantha',
        'Google US English',
      ];

      for (const name of preferred) {
        const match = voices.find(v => v.name.includes(name));
        if (match) return match;
      }
      return voices.find(v => v.lang.startsWith(lang)) || voices[0] || null;
    };

    const applyVoiceAndSpeak = () => {
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      utterance.onend = () => { if (onDone) onDone(); };
      utterance.onerror = () => { if (onDone) onDone(); };
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      applyVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        applyVoiceAndSpeak();
      };
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

  // ── Fetch real-time AI feedback and drive progression ──────
  const fetchAIFeedbackAndAdvance = async (answer, isLastQuestion) => {
    setIsFetchingFeedback(true);
    setAiFeedback(null);

    try {
      // Pass the current tentative track so the AI can be cautious
      const feedback = await api.getOnboardingFeedback(
        currentQ.prompt,
        answer,
        currentQIndex,
        tentativeTrack?.id || null
      );
      setAiFeedback(feedback);

      if (feedback.redirect_needed) {
        setShowRedirect(true);
        speakText("I can see you have big ambitions! BloomingPath supports specific pathways for people in the UK. Let me show you what we can help with.");
        return;
      }

      // Only update tentative track if AI explicitly returns a new one
      if (feedback.tentative_track_name) {
        setTentativeTrack({ id: feedback.tentative_track_id, name: feedback.tentative_track_name });
      }

      const reactionText = feedback.reaction || "Thank you! Let's continue.";

      if (isLastQuestion) {
        // Speak reaction, then show consent gate before completing
        speakText(reactionText, () => {
          setShowConsentGate(true);
        });
      } else {
        speakText(reactionText, () => {
          setReadyToAdvance(true);
        });
      }
    } catch (err) {
      console.error('AI feedback error:', err);
      if (!isLastQuestion) {
        setReadyToAdvance(true);
      } else {
        setShowConsentGate(true);
      }
    } finally {
      setIsFetchingFeedback(false);
    }
  };

  // ── Complete onboarding after consent ─────────────────────
  const handleCompleteOnboarding = async () => {
    if (!consentGiven) return;
    try {
      const result = await api.completeOnboardingSession(sessionId);
      setAlignmentResult(result);
      setAiFeedback(null);
      setShowConsentGate(false);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  };

  // ── Submit answer ─────────────────────────────────────────
  const handleConfirmAnswer = async (answer) => {
    const finalAnswer = answer || transcriptText || textInput;
    if (!finalAnswer || !sessionId || !individual) return;

    setIsSubmitting(true);
    setReadyToAdvance(false);

    try {
      await api.recordOnboardingInteraction(
        sessionId, individual.id, inputMode,
        currentQ.prompt, finalAnswer, finalAnswer
      );

      setVoiceState('READY');
      setTranscriptText('');
      setTextInput('');

      const isLastQuestion = currentQIndex >= QUESTIONS.length - 1;
      await fetchAIFeedbackAndAdvance(finalAnswer, isLastQuestion);
    } catch (err) {
      console.error('Failed to submit onboarding answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Advance to next question ───────────────────────────────
  const handleAdvance = () => {
    window.speechSynthesis.cancel();
    setReadyToAdvance(false);
    setCurrentQIndex(prev => prev + 1);
    setAiFeedback(null);
    setShowRedirect(false);
  };

  // ── Dismiss redirect and continue ─────────────────────────
  const handleDismissRedirect = () => {
    setShowRedirect(false);
    setAiFeedback(null);
    setVoiceState('READY');
    setTranscriptText('');
    setTextInput('');
  };

  // ── Choose a recommendation from the multi-rec screen ─────
  const handleChooseRecommendation = async (recommendation) => {
    if (!individual || isConfirmingChoice) return;
    setIsConfirmingChoice(true);
    try {
      await api.assignPathway(individual.id, recommendation.pathway_id);
      // Build a synthetic alignmentResult compatible with AlignmentResultScreen
      // using only the chosen recommendation's data
      const chosen = {
        ...alignmentResult,
        assigned_pathway: {
          id: recommendation.pathway_id,
          name: recommendation.pathway_name,
          description: alignmentResult?.assigned_pathway?.description || '',
        },
        pathway_alignment: {
          pathway_name: recommendation.pathway_name,
          reasons: recommendation.reasons,
        }
      };
      setSelectedRecommendation(chosen);
    } catch (err) {
      console.error('Failed to assign chosen pathway:', err);
    } finally {
      setIsConfirmingChoice(false);
    }
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

        {/* ── CHOSEN PATHWAY CONFIRMATION ── */}
        {selectedRecommendation ? (
          <AlignmentResultScreen
            alignmentResult={selectedRecommendation}
            onEnterPortal={() => onCompleteOnboarding(selectedRecommendation.assigned_pathway.id)}
            getTrackCard={getTrackCard}
            speakText={speakText}
          />

        ) : alignmentResult ? (
          /* ── MULTI-RECOMMENDATION SCREEN ── */
          <MultiRecommendationScreen
            alignmentResult={alignmentResult}
            getTrackCard={getTrackCard}
            onChoose={handleChooseRecommendation}
            isConfirming={isConfirmingChoice}
            speakText={speakText}
          />

        ) : showRedirect && aiFeedback?.redirect_needed ? (
          /* ── OUT-OF-SCOPE REDIRECT SCREEN ── */
          <RedirectScreen
            redirectMessage={aiFeedback.redirect_message}
            onContinue={handleDismissRedirect}
          />

        ) : showConsentGate ? (
          /* ── CONSENT GATE ── */
          <ConsentGateScreen
            consentGiven={consentGiven}
            setConsentGiven={setConsentGiven}
            onComplete={handleCompleteOnboarding}
            aiFeedback={aiFeedback}
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
                <span className="text-on-surface-variant">AI is starting to lean towards: <strong className="text-on-surface">{tentativeTrack.name}</strong></span>
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
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-container/20 border border-primary/20">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 animate-pulse">
                  <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-primary/20 rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-primary/10 rounded-full w-1/2 animate-pulse" />
                </div>
              </div>
            )}
            {aiFeedback && !aiFeedback.redirect_needed && !isFetchingFeedback && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary-container/30 border border-secondary/20">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-1">AI Guide</p>
                    <p className="text-sm text-on-surface leading-relaxed">{aiFeedback.reaction}</p>
                  </div>
                  {!readyToAdvance && (
                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      <span className="w-1.5 h-3 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <span className="w-1.5 h-4 bg-secondary/80 rounded-full animate-bounce" style={{animationDelay:'100ms'}} />
                      <span className="w-1.5 h-3 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay:'200ms'}} />
                    </div>
                  )}
                </div>
                {readyToAdvance && (
                  <button
                    onClick={handleAdvance}
                    className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 animate-fadeIn"
                  >
                    <span>Continue to Next Question</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                )}
              </div>
            )}

            {/* Input Mode Tabs — hidden while AI is responding */}
            {!isFetchingFeedback && !aiFeedback && (
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
            )}

            {/* ── SPEAK MODE ── */}
            {inputMode === 'speak' && !isFetchingFeedback && !aiFeedback && (
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
            {inputMode === 'type' && !isFetchingFeedback && !aiFeedback && (
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
            {inputMode === 'choose' && !isFetchingFeedback && !aiFeedback && (
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

function ConsentGateScreen({ consentGiven, setConsentGiven, onComplete, aiFeedback }) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (!consentGiven) return;
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Feedback Summary */}
      {aiFeedback?.reaction && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary-container/30 border border-secondary/20">
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-1">AI Guide</p>
            <p className="text-sm text-on-surface leading-relaxed">{aiFeedback.reaction}</p>
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-primary-container/30 border-2 border-primary/30 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-[28px]">verified_user</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">Almost there!</h2>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
          Before we finalise your pathway, we need your permission to share your readiness profile with potential employers and training institutions.
        </p>
      </div>

      {/* Consent Details Box */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">info</span>
          What will be shared?
        </h4>
        <ul className="space-y-2.5">
          {[
            { icon: 'route', text: 'Your assigned career pathway and readiness signal' },
            { icon: 'analytics', text: 'Capability evidence generated from workplace simulations' },
            { icon: 'business', text: 'Your availability and employment interests' },
            { icon: 'person', text: 'Your display name and contact email for employer outreach' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-outline-variant text-[11px] text-on-surface-variant">
          Your data will only be shared with verified employers and training institutions on the BloomingPath platform. You can withdraw consent at any time from your profile settings.
        </div>
      </div>

      {/* Required Consent Checkbox */}
      <label
        htmlFor="consent-checkbox"
        className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
          consentGiven
            ? 'border-primary bg-primary-container/20'
            : 'border-outline-variant bg-surface-container-low hover:border-primary/50'
        }`}
      >
        <div className="relative mt-0.5 shrink-0">
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            consentGiven ? 'bg-primary border-primary' : 'border-outline bg-surface-container-lowest'
          }`}>
            {consentGiven && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-on-surface">
            I consent to my data being shared with verified employers and institutions on BloomingPath
            <span className="text-error ml-1">*</span>
          </p>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Required to complete onboarding and access your personalised pathway.
          </p>
        </div>
      </label>

      {!consentGiven && (
        <p className="text-xs text-on-surface-variant text-center flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-error">error</span>
          Please tick the consent box above to continue.
        </p>
      )}

      <button
        onClick={handleComplete}
        disabled={!consentGiven || isCompleting}
        className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isCompleting
          ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>Finding your pathways...</>
          : <><span className="material-symbols-outlined text-[18px]">auto_awesome</span>See My Pathway Recommendations</>
        }
      </button>
    </div>
  );
}

function MultiRecommendationScreen({ alignmentResult, getTrackCard, onChoose, isConfirming, speakText }) {
  const recommendations = alignmentResult?.pathway_recommendations || [];
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    speakText("Great news! Based on your answers, we've found some excellent pathway matches for you. Take a look and choose the one that feels right.");
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-secondary-container/30 border-2 border-secondary/30 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-secondary text-[32px]">auto_awesome</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold uppercase tracking-wider inline-block">
          Pathway Recommendations
        </span>
        <h2 className="text-xl font-bold text-on-surface">Here's what we found for you</h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Based on everything you shared, these pathways are a strong fit. Read the reasons below and choose the one that feels right for you.
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {(recommendations.length > 0 ? recommendations : [
          {
            pathway_id: alignmentResult?.assigned_pathway?.id,
            pathway_name: alignmentResult?.assigned_pathway?.name,
            confidence: 'high',
            reasons: alignmentResult?.pathway_alignment?.reasons || []
          }
        ]).map((rec, idx) => {
          const trackCard = getTrackCard(rec.pathway_id);
          const color = trackCard?.color || '#4f8ef7';
          const icon = trackCard?.icon || 'route';
          const confColor = CONFIDENCE_COLORS[rec.confidence] || '#4f8ef7';
          const rankLabels = ['Best Match', 'Strong Alternative', 'Also Consider'];

          return (
            <div
              key={rec.pathway_id}
              className="rounded-2xl border-2 p-5 space-y-4 transition-all duration-200 cursor-pointer"
              style={{
                borderColor: hovered === idx ? color : `${color}44`,
                background: `${color}08`
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Card Header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ color }}>{icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${color}22`, color }}
                    >
                      {rankLabels[idx] || `Option ${idx + 1}`}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${confColor}22`, color: confColor }}
                    >
                      {rec.confidence} confidence
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface mt-1">{rec.pathway_name}</h3>
                </div>
              </div>

              {/* Why We Thought of This */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ color }}>verified</span>
                  Why we thought of this for you
                </p>
                <ul className="space-y-1.5">
                  {(rec.reasons || []).map((reason, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2 text-xs text-on-surface">
                      <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5" style={{ color }}>check_circle</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Choose Button */}
              <button
                onClick={() => onChoose(rec)}
                disabled={isConfirming}
                className="w-full py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: color, color: '#fff' }}
              >
                {isConfirming
                  ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Confirming...</>
                  : <><span className="material-symbols-outlined text-[16px]">arrow_forward</span>Choose This Pathway</>
                }
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-on-surface-variant text-center px-4">
        Don't worry — you can discuss your pathway choice with a BloomingPath advisor at any time. Your profile can be updated as your experience grows.
      </p>
    </div>
  );
}

function AlignmentResultScreen({ alignmentResult, onEnterPortal, getTrackCard, speakText }) {
  const trackCard = getTrackCard(alignmentResult?.assigned_pathway?.id);
  const trackColor = trackCard?.color || '#4f8ef7';
  const trackIcon = trackCard?.icon || 'route';

  useEffect(() => {
    if (alignmentResult?.assigned_pathway?.name) {
      speakText(`Excellent choice! You've chosen the ${alignmentResult.assigned_pathway.name} pathway. Let's get started on your journey.`);
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
          Pathway Confirmed
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
          {(alignmentResult.pathway_alignment?.reasons || []).map((reason, idx) => (
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
          BloomingPath is designed to help foreigners find accessible employment in the UK. We specialise in 6 pathways:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {TRACK_CARDS.map(track => (
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
