import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const QUESTIONS = [
  {
    id: 1,
    prompt: "What kind of work would you like to do?",
    subtitle: "Tell us about the roles or industries you are interested in exploring.",
    options: ["Administrative Assistant", "Customer Service & Front Desk", "Operations & Logistics", "General Office Support"]
  },
  {
    id: 2,
    prompt: "Tell us about any work or volunteering experience you have had.",
    subtitle: "Even informal or community experience helps us understand your background.",
    options: ["Office or administrative volunteering", "Customer or public-facing role", "Community organization", "No formal work experience yet"]
  },
  {
    id: 3,
    prompt: "How comfortable do you feel using computers for everyday work?",
    subtitle: "Such as sending emails, managing calendars, or typing documents.",
    options: ["Very comfortable", "Moderately comfortable", "Basic familiarity", "Need guidance and practice"]
  },
  {
    id: 4,
    prompt: "How confident do you feel speaking with customers, colleagues or members of the public?",
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
  const [inputMode, setInputMode] = useState('speak'); // 'speak', 'type', 'choose'

  // Voice Interaction State: 'READY', 'LISTENING', 'PROCESSING', 'TRANSCRIPT', 'CONFIRMATION'
  const [voiceState, setVoiceState] = useState('READY');
  const [transcriptText, setTranscriptText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alignmentResult, setAlignmentResult] = useState(null);

  const currentQ = QUESTIONS[currentQIndex];

  // Initialize Session on mount
  useEffect(() => {
    async function init() {
      try {
        const ind = await api.getOrCreateIndividual(userEmail || 'amina.hassan@example.com', 'Amina Hassan', currentLang);
        setIndividual(ind);
        const session = await api.startOnboardingSession(ind.id);
        setSessionId(session.id);
      } catch (err) {
        console.error('Failed to initialize onboarding session:', err);
      }
    }
    init();

    // Check Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, [userEmail, currentLang]);

  // Read question text aloud via Text-to-Speech (TTS)
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLang === 'ar') utterance.lang = 'ar-SA';
      else if (currentLang === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Voice Recording
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';
        recognition.onstart = () => {
          setVoiceState('LISTENING');
        };
        recognition.onresult = (e) => {
          const resultText = e.results[0][0].transcript;
          setVoiceState('PROCESSING');
          setTimeout(() => {
            setTranscriptText(resultText);
            setTextInput(resultText);
            setVoiceState('TRANSCRIPT');
          }, 400);
        };
        recognition.onerror = () => {
          setVoiceState('READY');
        };
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition error:', err);
        setVoiceState('READY');
      }
    } else {
      // Fallback message
      setSpeechSupported(false);
    }
  };

  // Handle Answer Submission for Current Question
  const handleConfirmAnswer = async (answer) => {
    const finalAnswer = answer || transcriptText || textInput;
    if (!finalAnswer || !sessionId || !individual) return;

    setIsSubmitting(true);
    try {
      await api.recordOnboardingInteraction(
        sessionId,
        individual.id,
        inputMode,
        currentQ.prompt,
        finalAnswer,
        finalAnswer
      );

      // Reset states for next question
      setVoiceState('READY');
      setTranscriptText('');
      setTextInput('');

      if (currentQIndex < QUESTIONS.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        // Final Question Completed -> Trigger Backend Extraction & Pathway Assignment
        const result = await api.completeOnboardingSession(sessionId);
        setAlignmentResult(result);
      }
    } catch (err) {
      console.error('Failed to submit onboarding answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">spa</span>
            <span className="font-bold text-base text-on-surface">BloomingPath Individual Onboarding</span>
          </div>
          {onBackToRegister && (
            <button onClick={onBackToRegister} className="text-xs font-semibold text-on-surface-variant hover:text-on-surface">
              Exit
            </button>
          )}
        </div>

        {/* ALIGNMENT RESULT SCREEN (Onboarding Complete) */}
        {alignmentResult ? (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[36px]">route</span>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold uppercase tracking-wider">
                Pathway Alignment Complete
              </span>
              <h2 className="text-2xl font-bold text-on-surface mt-2">
                Assigned Pathway: {alignmentResult.assigned_pathway.name}
              </h2>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
                {alignmentResult.assigned_pathway.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant text-left space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Pathway Alignment Analysis
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
              onClick={() => onCompleteOnboarding(alignmentResult.assigned_pathway.id)}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Enter Individual Portal</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        ) : (
          /* QUESTION WIZARD STEPS */
          <div className="space-y-6">
            
            {/* Progress Stepper Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                <span>Question {currentQIndex + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((currentQIndex + 1) / QUESTIONS.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-center space-y-2 py-2">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">{currentQ.prompt}</h2>
                <button
                  onClick={() => speakQuestion(currentQ.prompt)}
                  className="p-1 rounded-full text-primary hover:bg-surface-container-high transition-colors"
                  title="Listen to question"
                >
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">{currentQ.subtitle}</p>
            </div>

            {/* Input Modality Tabs: Speak, Type, Choose */}
            <div className="flex justify-center border-b border-outline-variant/60 pb-3 gap-2">
              <button
                onClick={() => setInputMode('speak')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inputMode === 'speak' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
                Speak
              </button>
              <button
                onClick={() => setInputMode('type')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inputMode === 'type' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                Type
              </button>
              <button
                onClick={() => setInputMode('choose')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inputMode === 'choose' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                Choose
              </button>
            </div>

            {/* MODE 1: SPEAK (VOICE INTERACTION CYCLE) */}
            {inputMode === 'speak' && (
              <div className="flex flex-col items-center space-y-4 py-4">
                {!speechSupported && (
                  <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-xs text-error font-medium w-full text-center">
                    Voice recognition is unavailable in this browser. You can type your response instead.
                  </div>
                )}

                {/* Voice State Machine Display */}
                <div className="w-24 h-24 rounded-full bg-primary-container/20 border-2 border-primary flex items-center justify-center relative my-2">
                  {voiceState === 'LISTENING' && (
                    <div className="absolute inset-0 rounded-full bg-secondary-container/40 animate-ping"></div>
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
                    onClick={() => {
                      setVoiceState('PROCESSING');
                      setTimeout(() => setVoiceState('TRANSCRIPT'), 400);
                    }}
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
                        onClick={() => {
                          speakQuestion(transcriptText);
                        }}
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
                        disabled={isSubmitting}
                        className="px-5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:opacity-90"
                      >
                        Confirm Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: TYPE */}
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

            {/* MODE 3: CHOOSE */}
            {inputMode === 'choose' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTextInput(opt);
                      handleConfirmAnswer(opt);
                    }}
                    className="p-4 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary text-left text-xs font-semibold text-on-surface transition-all flex items-center justify-between group"
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
