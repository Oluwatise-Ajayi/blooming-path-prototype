import React, { useState, useEffect } from 'react';

export default function GuidedOnboardingWizard({ userEmail, currentLang, onCompleteOnboarding }) {
  const [step, setStep] = useState(1);
  const [diagnosticMode, setDiagnosticMode] = useState('voice'); // 'voice' or 'visual'
  const [isListening, setIsListening] = useState(false);

  // Data Collected across the 5 steps
  const [answers, setAnswers] = useState({
    sectorInterest: 'Healthcare Administration',
    commConfidence: 'High (Spoken & Written)',
    availability: 'Part-Time / School Hours',
    digitalComfort: 'Intermediate (Computers & CRM)',
    priorExposure: 'Customer Service & Administration',
  });

  const [assignedPathway, setAssignedPathway] = useState(null);
  const [aiSpeechRationale, setAiSpeechRationale] = useState('');

  // Questions definitions for TTS and display
  const questions = [
    {
      id: 1,
      title: "1. Role & Sector Interest",
      prompt: "Hello! Welcome to BloomingPath. Which target sector are you most interested in supporting?",
      field: "sectorInterest",
      options: [
        { label: "Healthcare Administration", desc: "GP surgery triage, NHS booking protocols", val: "Healthcare Administration" },
        { label: "School Support (LSA)", desc: "Teaching assistant, classroom support & parent scheduling", val: "School Support (LSA)" },
        { label: "Admin & Office Support", desc: "Executive calendar scheduling & business logistics", val: "Admin & Office Support" },
      ]
    },
    {
      id: 2,
      title: "2. Communication Confidence",
      prompt: "How confident do you feel with spoken and written workplace communication?",
      field: "commConfidence",
      options: [
        { label: "High Confidence", desc: "Comfortable speaking on phone & writing emails", val: "High Confidence" },
        { label: "Moderate Confidence", desc: "Prefer structured scripts & guided practice", val: "Moderate Confidence" },
        { label: "Building Confidence", desc: "Desire voice-assisted practice and learning modules", val: "Building Confidence" },
      ]
    },
    {
      id: 3,
      title: "3. Working Availability",
      prompt: "What is your preferred working schedule or flexibility?",
      field: "availability",
      options: [
        { label: "Full-Time (35+ hrs)", desc: "Standard weekday office or clinic shifts", val: "Full-Time (35+ hrs)" },
        { label: "Part-Time / Flexible", desc: "Morning/afternoon shifts or hybrid", val: "Part-Time / Flexible" },
        { label: "School Hours Only", desc: "Term-time schedules tailored for parents", val: "School Hours Only" },
      ]
    },
    {
      id: 4,
      title: "4. Digital Comfort Level",
      prompt: "How familiar are you with digital tools like email, calendars, and computers?",
      field: "digitalComfort",
      options: [
        { label: "Advanced", desc: "Confident with CRM software, Excel & booking tools", val: "Advanced" },
        { label: "Intermediate", desc: "Familiar with email, smartphones & web apps", val: "Intermediate" },
        { label: "Basic / Learning", desc: "Prefer simple step-by-step guidance", val: "Basic / Learning" },
      ]
    },
    {
      id: 5,
      title: "5. Prior Transferable Experience",
      prompt: "What transferable work or community experience do you bring from the UK or your home country?",
      field: "priorExposure",
      options: [
        { label: "Customer Care & Admin", desc: "Previous office, clinic, or receptionist experience", val: "Customer Care & Admin" },
        { label: "Community & Childcare", desc: "Volunteering, teaching, or family care experience", val: "Community & Childcare" },
        { label: "Retail & Operations", desc: "Customer service, sales, or logistics background", val: "Retail & Operations" },
      ]
    }
  ];

  const currentQ = questions[step - 1];

  // TTS Helper
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLang === 'ar') utterance.lang = 'ar-SA';
      else if (currentLang === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak prompt on step change
  useEffect(() => {
    if (step <= 5) {
      speakPrompt(currentQ.prompt);
    }
  }, [step]);

  // STT Microphone Handler
  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'ar' ? 'ar-SA' : currentLang === 'fr' ? 'fr-FR' : 'en-GB';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setAnswers(prev => ({ ...prev, [currentQ.field]: transcript }));
        setIsListening(false);
        handleNextStep();
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      // Demo Speech-to-Text Fallback
      setIsListening(true);
      setTimeout(() => {
        const mockValue = currentQ.options[0].val;
        setAnswers(prev => ({ ...prev, [currentQ.field]: mockValue }));
        setIsListening(false);
        handleNextStep();
      }, 2000);
    }
  };

  const handleSelectOption = (value) => {
    setAnswers(prev => ({ ...prev, [currentQ.field]: value }));
    handleNextStep();
  };

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Calculate Automated Pathway Assignment Engine
      runPathwayAssignmentEngine();
    }
  };

  const runPathwayAssignmentEngine = () => {
    let pathway = 'healthcare';
    let pathwayName = 'Healthcare Administration Readiness';

    if (answers.sectorInterest.includes('School')) {
      pathway = 'school';
      pathwayName = 'School Support Readiness (LSA)';
    } else if (answers.sectorInterest.includes('Office') || answers.sectorInterest.includes('Admin')) {
      pathway = 'office';
      pathwayName = 'Admin & Office Support Readiness';
    }

    const rationale = `Based on your interest in ${answers.sectorInterest} and your ${answers.commConfidence} level, our AI engine has matched you to the ${pathwayName} pathway. Your next step is to launch your first workplace simulation.`;

    setAssignedPathway({ id: pathway, name: pathwayName });
    setAiSpeechRationale(rationale);
    setStep(6); // Step 6 = Summary & Assignment Result Screen
    speakPrompt(rationale);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="max-w-3xl w-full bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-outline-variant gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-1 inline-block">
              Stage 2: Guided Post-Signup Diagnostic
            </span>
            <h2 className="text-xl font-bold text-on-surface">Conversational Onboarding Wizard</h2>
            <p className="text-xs text-on-surface-variant">Account: <strong className="text-on-surface">{userEmail}</strong></p>
          </div>

          {/* Mode Switcher: Voice vs Visual */}
          {step <= 5 && (
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant text-xs">
              <button
                onClick={() => setDiagnosticMode('voice')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  diagnosticMode === 'voice' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                Voice-First (TTS/STT)
              </button>
              <button
                onClick={() => setDiagnosticMode('visual')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  diagnosticMode === 'visual' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                Visual Cards
              </button>
            </div>
          )}
        </div>

        {/* Step Progress Indicator */}
        {step <= 5 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>Diagnostic Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>
          </div>
        )}

        {/* STEPS 1-5: CONVERSATIONAL DIAGNOSTIC */}
        {step <= 5 && (
          <div className="space-y-6 py-4 animate-fadeIn">
            
            {/* Question Title & Prompt */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-primary-fixed flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                AI
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{currentQ.title}</h3>
                  <button
                    onClick={() => speakPrompt(currentQ.prompt)}
                    className="p-1 text-primary hover:bg-surface-container-high rounded-full"
                    title="Read Prompt Aloud"
                  >
                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                  </button>
                </div>
                <p className="text-sm font-bold text-on-surface leading-snug">"{currentQ.prompt}"</p>
              </div>
            </div>

            {/* VOICE-FIRST INTERACTION */}
            {diagnosticMode === 'voice' ? (
              <div className="flex flex-col items-center text-center space-y-5 py-4">
                <div className="w-20 h-20 rounded-full bg-primary-container/20 border-2 border-primary flex items-center justify-center relative">
                  {isListening && <div className="absolute inset-0 rounded-full bg-secondary-container/40 animate-ping"></div>}
                  <span className="material-symbols-outlined text-primary text-[40px]">
                    {isListening ? 'graphic_eq' : 'mic'}
                  </span>
                </div>

                <button
                  onClick={handleVoiceRecord}
                  disabled={isListening}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
                    isListening ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary-container text-on-primary hover:bg-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                  {isListening ? 'Listening & Transcribing...' : 'Tap & Speak Your Answer'}
                </button>

                <p className="text-xs text-on-surface-variant italic">
                  Or select a simplified option below if preferred:
                </p>

                {/* Quick Option Buttons as Fallback */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.val)}
                      className="p-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low text-left transition-all text-xs font-bold text-on-surface hover:border-primary"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* VISUAL MULTIPLE-CHOICE CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.val)}
                    className="p-4 rounded-2xl border border-outline-variant bg-surface hover:bg-surface-container-low hover:border-primary text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs mb-2 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <h4 className="text-xs font-bold text-on-surface mb-1">{opt.label}</h4>
                    <p className="text-[11px] text-on-surface-variant">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        {/* STEP 6: AUTOMATED PATHWAY ASSIGNMENT SUMMARY */}
        {step === 6 && assignedPathway && (
          <div className="space-y-6 py-4 animate-fadeIn">
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container to-secondary-container/20 border border-secondary text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px]">auto_awesome</span>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-extrabold uppercase tracking-wider mb-2 inline-block">
                  Automated Pathway Engine Result
                </span>
                <h3 className="text-xl font-extrabold text-on-surface">
                  Assigned Pathway: {assignedPathway.name}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs text-on-surface text-left">
                <p className="font-bold text-primary mb-1">AI Assistant Rationale:</p>
                <p className="italic font-medium">"{aiSpeechRationale}"</p>
              </div>

              {/* Summary Data Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs">
                <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-medium">Confidence:</span>
                  <p className="font-bold text-primary truncate">{answers.commConfidence}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-medium">Availability:</span>
                  <p className="font-bold text-secondary truncate">{answers.availability}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-medium">Digital Tools:</span>
                  <p className="font-bold text-tertiary truncate">{answers.digitalComfort}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-medium">Prior Experience:</span>
                  <p className="font-bold text-on-surface truncate">{answers.priorExposure}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onCompleteOnboarding(assignedPathway.id)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Enter Individual Readiness Dashboard</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
