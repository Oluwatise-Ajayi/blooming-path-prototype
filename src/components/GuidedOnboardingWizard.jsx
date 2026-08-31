import React, { useState, useEffect } from 'react';

export default function GuidedOnboardingWizard({ userEmail, currentLang, onCompleteOnboarding, onBackToRegister }) {
  // Wizard steps: 2 = Mic Setup, 3 = Practice Simulation, 4 = Profile Ready
  const [step, setStep] = useState(2);

  // STEP 2 STATE (Mic Test)
  const [micTestState, setMicTestState] = useState('idle'); // 'idle', 'recording', 'success'

  // STEP 3 STATE (Practice Simulation)
  const [simState, setSimState] = useState('idle'); // 'idle', 'recording', 'processing', 'success'
  const [sttText, setSttText] = useState('Listening...');
  const [sttIsTyping, setSttIsTyping] = useState(false);

  // Handle Step 2 Mic Test
  const handleStartMicTest = () => {
    if (micTestState !== 'idle') return;
    setMicTestState('recording');
    setTimeout(() => {
      setMicTestState('success');
    }, 3000);
  };

  // Handle Step 3 Mic Recording & Simulation
  const handleToggleSimRecording = () => {
    if (simState === 'idle') {
      setSimState('recording');
      setSttText('Listening...');
      setSttIsTyping(false);

      // Auto transition to processing after 3 seconds of recording
      setTimeout(() => {
        startProcessingSim();
      }, 3000);
    } else if (simState === 'recording') {
      startProcessingSim();
    }
  };

  const startProcessingSim = () => {
    setSimState('processing');
    const targetScript = "Hello, how can I help you today?";
    setSttIsTyping(true);

    let idx = 0;
    setSttText('');
    const typingInterval = setInterval(() => {
      if (idx < targetScript.length) {
        setSttText(prev => prev + targetScript.charAt(idx));
        idx++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setSimState('success');
        }, 500);
      }
    }, 40);
  };

  return (
    <div className="bg-onboarding-bg text-on-surface font-onboarding-body antialiased min-h-screen flex flex-col items-center w-full relative selection:bg-primary selection:text-on-primary">
      
      {/* ================= STEP 2: MICROPHONE SETUP ================= */}
      {step === 2 && (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative min-h-screen">
          {/* Progress Stepper */}
          <div className="w-full px-mobile-margin pt-mobile-margin flex gap-2">
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-outline-variant rounded-full"></div>
            <div className="h-1 flex-1 bg-outline-variant rounded-full"></div>
          </div>
          
          <div className="px-mobile-margin mt-stack-sm">
            <span className="font-voice-label text-voice-label text-primary">STEP 2 OF 4</span>
          </div>

          {/* Top Navigation */}
          <header className="flex items-center w-full px-mobile-margin h-16 bg-transparent">
            <button 
              onClick={() => onBackToRegister ? onBackToRegister() : setStep(2)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low active:scale-95 duration-150 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col px-mobile-margin pb-mobile-margin mt-stack-md justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
              
              {/* Hero Illustration */}
              <div className="w-48 h-48 mb-stack-lg relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-50"></div>
                <div className="absolute inset-4 bg-primary-fixed-dim rounded-full opacity-70"></div>
                <span className="material-symbols-outlined text-[80px] text-primary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </div>

              {/* Title & Instructions */}
              <div className="text-center mb-stack-lg max-w-[320px]">
                <h1 className="font-onboarding-title text-onboarding-title text-on-surface mb-stack-sm">Let's check your mic</h1>
                <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">Speak clearly in a quiet environment. We want to make sure you're heard perfectly.</p>
              </div>

              {/* Glassmorphic Interaction Area */}
              <div className={`w-full bg-surface-container-lowest/80 backdrop-blur-md border rounded-xl p-6 flex flex-col items-center transition-all duration-300 ${
                micTestState === 'recording' ? 'ring-2 ring-primary bg-surface-container-low border-primary' :
                micTestState === 'success' ? 'border-voice-success ring-2 ring-voice-success' : 'border-surface-variant'
              }`}>
                
                {/* Idle State */}
                {micTestState === 'idle' && (
                  <div className="flex flex-col items-center w-full">
                    <button 
                      onClick={handleStartMicTest}
                      className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-voice-btn hover:opacity-90 active:scale-95 transition-all mb-4 relative"
                    >
                      <span className="material-symbols-outlined text-[32px]">mic</span>
                    </button>
                    <span className="font-voice-label text-voice-label text-on-surface-variant">TAP TO TEST</span>
                  </div>
                )}

                {/* Active Recording State */}
                {micTestState === 'recording' && (
                  <div className="flex flex-col items-center w-full">
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 bg-voice-recording rounded-full pulse-ring"></div>
                      <div className="relative w-16 h-16 bg-voice-recording border-4 border-surface-container-lowest rounded-full flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-on-error">graphic_eq</span>
                      </div>
                    </div>
                    {/* Waveform Visualizer */}
                    <div className="flex items-end justify-center h-12 gap-1 mb-4 w-full px-8">
                      <div className="w-2 bg-primary rounded-t-sm waveform-bar" style={{ height: '40%' }}></div>
                      <div className="w-2 bg-primary rounded-t-sm waveform-bar" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-primary rounded-t-sm waveform-bar" style={{ height: '100%' }}></div>
                      <div className="w-2 bg-primary rounded-t-sm waveform-bar" style={{ height: '60%' }}></div>
                      <div className="w-2 bg-primary rounded-t-sm waveform-bar" style={{ height: '30%' }}></div>
                    </div>
                    <span className="font-voice-label text-voice-label text-primary animate-pulse">LISTENING...</span>
                  </div>
                )}

                {/* Success State */}
                {micTestState === 'success' && (
                  <div className="flex flex-col items-center w-full">
                    <div className="w-20 h-20 bg-voice-success text-on-error border-4 border-surface-container-lowest rounded-full flex items-center justify-center shadow-voice-btn mb-4 z-10">
                      <span className="material-symbols-outlined text-[32px]">check</span>
                    </div>
                    <span className="font-voice-label text-voice-label text-voice-success">MIC LOOKS GOOD!</span>
                  </div>
                )}

              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-stack-lg pb-4 mt-auto">
              <button 
                disabled={micTestState !== 'success'}
                onClick={() => setStep(3)}
                className={`w-full h-14 rounded-md font-body-md text-body-md font-semibold flex items-center justify-center transition-all duration-300 ${
                  micTestState === 'success' 
                    ? 'bg-primary text-on-primary shadow-voice-btn hover:opacity-90 active:scale-95 cursor-pointer' 
                    : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ================= STEP 3: PRACTICE SIMULATION ================= */}
      {step === 3 && (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative min-h-screen">
          {/* Top App Bar */}
          <header className="flex items-center w-full px-mobile-margin h-16 bg-surface shrink-0 z-10">
            <button 
              onClick={() => setStep(2)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-outline">arrow_back</span>
            </button>
            <div className="flex-1 text-center pr-10">
              <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">BloomingPath</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col px-mobile-margin relative overflow-y-auto pb-32">
            {/* Progress Stepper */}
            <div className="w-full flex gap-2 pt-stack-md pb-stack-lg shrink-0">
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="h-1 flex-1 bg-primary rounded-full shadow-ambient relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-inverse-primary opacity-50"></div>
              </div>
              <div className="h-1 flex-1 bg-surface-variant rounded-full"></div>
            </div>

            <div className="flex flex-col flex-1 justify-center max-w-md mx-auto w-full gap-stack-lg">
              {/* Header Text */}
              <div className="text-center space-y-stack-sm">
                <h1 className="font-onboarding-title text-onboarding-title text-on-surface">First Interaction</h1>
                <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">Let's practice a simple workplace greeting. Tap the mic and read the text below.</p>
              </div>

              {/* Script Card */}
              <div className="glass-panel p-6 rounded-[24px] border border-outline-variant/30 text-center relative overflow-hidden shadow-sm mt-stack-md">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                <span className="font-voice-label text-voice-label text-primary uppercase tracking-widest mb-2 block opacity-80">Read aloud</span>
                <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold leading-snug">
                  "Hello, how can I help you today?"
                </p>
              </div>

              {/* Voice Interaction Hub */}
              <div className="flex flex-col items-center justify-center py-stack-lg gap-stack-md relative z-20">
                <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                  
                  {/* Ambient Glow */}
                  <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                    simState === 'idle' ? 'bg-voice-glow scale-75 opacity-50' :
                    simState === 'recording' ? 'bg-voice-recording scale-125 opacity-20' :
                    simState === 'processing' ? 'bg-voice-processing scale-110 opacity-30' :
                    'bg-voice-success scale-125 opacity-30'
                  }`}></div>

                  {/* Main Button */}
                  <button 
                    onClick={handleToggleSimRecording}
                    className={`relative z-10 w-voice-indicator-size h-voice-indicator-size rounded-full flex items-center justify-center shadow-ambient transition-all duration-300 active:scale-95 ${
                      simState === 'idle' ? 'bg-primary hover:bg-primary-container text-on-primary' :
                      simState === 'recording' ? 'bg-white is-recording' :
                      simState === 'processing' ? 'bg-white is-processing' :
                      'bg-voice-success text-white'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${
                      simState === 'idle' ? 'text-on-primary' :
                      simState === 'recording' ? 'text-voice-recording' :
                      simState === 'processing' ? 'text-voice-processing' :
                      'text-white'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {simState === 'idle' ? 'mic' :
                       simState === 'recording' ? 'mic' :
                       simState === 'processing' ? 'more_horiz' : 'check'}
                    </span>

                    {/* State Rings */}
                    <div className="recording-ring"></div>
                    <div className="processing-ring"></div>
                  </button>
                </div>

                {/* Status Text */}
                <div className="h-8 flex items-center justify-center">
                  <span className={`font-voice-label text-voice-label transition-opacity duration-300 ${
                    simState === 'success' ? 'text-voice-success font-bold' : 'text-on-surface-variant'
                  }`}>
                    {simState === 'idle' && 'Tap to start speaking'}
                    {simState === 'recording' && 'Listening...'}
                    {simState === 'processing' && 'Processing...'}
                    {simState === 'success' && 'Great job!'}
                  </span>
                </div>
              </div>

              {/* Real-time Speech-to-Text Preview */}
              <div className={`min-h-[80px] p-4 rounded-xl bg-surface-container-low border border-surface-variant flex items-center justify-center text-center transition-all duration-500 ${
                simState === 'idle' ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
              }`}>
                <p className={`font-body-md text-body-md ${
                  simState === 'recording' ? 'text-outline italic' : 'text-on-surface font-medium'
                }`}>
                  {sttText}
                </p>
              </div>

            </div>
          </main>

          {/* Bottom Actions */}
          <div className="fixed bottom-0 left-0 w-full p-mobile-margin bg-gradient-to-t from-onboarding-bg via-onboarding-bg to-transparent z-40 pb-6">
            <div className="max-w-md mx-auto flex flex-col gap-4">
              <button 
                disabled={simState !== 'success'}
                onClick={() => setStep(4)}
                className={`w-full h-14 rounded-xl font-body-md font-semibold transition-all duration-300 flex items-center justify-center shadow-sm ${
                  simState === 'success' 
                    ? 'bg-primary text-on-primary shadow-ambient hover:bg-primary-container active:scale-95 cursor-pointer' 
                    : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
              <button 
                onClick={() => setStep(4)}
                className="w-full h-12 rounded-xl bg-transparent text-outline font-body-md hover:bg-surface-container-low transition-colors active:scale-95"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: PROFILE READY ================= */}
      {step === 4 && (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative min-h-screen items-center justify-center p-mobile-margin">
          {/* Top AppBar */}
          <header className="fixed top-0 w-full max-w-md px-mobile-margin h-16 flex items-center justify-between bg-surface z-50">
            <div className="flex items-center">
              <button onClick={() => setStep(3)} className="material-symbols-outlined text-outline cursor-pointer">close</button>
            </div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
              BloomingPath
            </div>
            <div className="w-6"></div>
          </header>

          {/* Progress Stepper (4/4 Complete) */}
          <div className="fixed top-16 w-full max-w-md px-mobile-margin flex gap-2 z-40">
            <div className="h-1 flex-1 rounded-full bg-primary transition-all duration-500"></div>
            <div className="h-1 flex-1 rounded-full bg-primary transition-all duration-500"></div>
            <div className="h-1 flex-1 rounded-full bg-primary transition-all duration-500"></div>
            <div className="h-1 flex-1 rounded-full bg-primary transition-all duration-500"></div>
          </div>

          {/* Main Content */}
          <main className="w-full mt-24 mb-32 flex flex-col items-center">
            {/* Success Indicator */}
            <div className="w-voice-indicator-size h-voice-indicator-size rounded-full bg-voice-success flex items-center justify-center success-pulse mb-stack-lg fade-in-up">
              <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>

            {/* Text Header */}
            <div className="text-center mb-stack-lg fade-in-up delay-100">
              <h1 className="font-onboarding-title text-onboarding-title text-on-surface mb-stack-sm">You're All Set!</h1>
              <p className="font-onboarding-body text-onboarding-body text-on-surface-variant">Your voice profile has been successfully generated and applied to your account.</p>
            </div>

            {/* Summary Card */}
            <div className="glass-card rounded-[24px] p-mobile-margin w-full mb-stack-lg fade-in-up delay-200">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-surface-variant">
                <span className="material-symbols-outlined text-primary">graphic_eq</span>
                <div>
                  <h3 className="font-voice-label text-voice-label text-primary">Communication Level</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Initial Assessment Complete</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-sm">done</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">Account Created</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-sm">done</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">Identity Verified</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-sm">done</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">Voice Profile Set Up</span>
                </li>
              </ul>
            </div>
          </main>

          {/* Bottom Action */}
          <div className="fixed bottom-0 w-full max-w-md px-mobile-margin pb-mobile-margin bg-gradient-to-t from-onboarding-bg via-onboarding-bg to-transparent pt-8 fade-in-up delay-300 z-50">
            <button 
              onClick={() => onCompleteOnboarding('healthcare')}
              className="w-full h-14 bg-primary text-on-primary rounded-md font-voice-label text-voice-label ambient-shadow flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-95"
            >
              <span>Go to Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
