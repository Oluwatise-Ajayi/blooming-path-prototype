# BloomingPath — Workforce Readiness & Capability Infrastructure Platform

**BloomingPath** is an AI-enabled workforce-readiness infrastructure platform connecting Individuals, Employers, and Institutional Partners.

It converts voice and text workplace interactions into structured, verifiable capability evidence and role-aligned readiness profiles.

---

## 🏛️ Product Architecture

BloomingPath operates as a full-stack vertical slice:

```text
                  Next.js / React UI
                         │
                         ▼
                   API boundary
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      Application services       AI orchestration
              │                     │
              │              ┌──────┼──────┐
              │              │      │      │
              │             STT    LLM    TTS
              │              │      │      │
              └──────────────┴──────┴──────┘
                             │
                             ▼
                     Assessment Engine
                             │
                             ▼
                      Evidence Engine
                             │
                             ▼
                    Readiness Profile
                             │
                             ▼
                   Employer Intelligence
                             │
                             ▼
                     SQLite / PostgreSQL
```

---

## 🔄 AI Workflow

```text
Individual Voice/Text Input
        ↓
Speech-to-Text (STT) Transcript
        ↓
Structured Interaction Record
        ↓
Assessment Context + Scenario Rubric
        ↓
AI Orchestration Layer (Gemini / Deterministic)
        ↓
Validated Structured Evaluation
        ↓
Evidence Record (Observable Behaviours)
        ↓
Capability Signals (State & Confidence)
        ↓
Readiness Profile Aggregation
        ↓
Employer Intelligence View (Privacy Controlled)
```

---

## 🗄️ Relational Data Model

1. **Individual**: Primary identity representation (display_name, email, preferred_language, availability, employment_interests, digital_confidence).
2. **OnboardingSession**: Tracks conversational onboarding progress and status.
3. **Interaction**: Persists raw input, modality (voice/text/visual), prompt, transcript, and extracted signals.
4. **Pathway**: Workforce pathway definitions (Initial: `Administrative Assistant`).
5. **Simulation**: Role-specific workplace scenario (`Appointment Scheduling`).
6. **SimulationSession**: Individual simulation attempt record.
7. **SimulationTurn**: Turn-by-turn log of caller and Individual exchanges.
8. **Assessment**: Evaluated outcome of a completed simulation session.
9. **EvidenceRecord**: Verifiable evidence linking capability claims to observable behaviours in specific turns.
10. **CapabilitySignal**: Aggregated capability states (`demonstrated`, `developing`, `insufficient_evidence`).
11. **ReadinessProfile**: Aggregated workforce readiness indicator for target pathways.

---

## 📐 Assessment Methodology

BloomingPath evaluates **observable workplace behaviours** against predefined capability rubrics:

1. **Communication**: Clear, polite, understandable explanation of schedule constraints.
2. **Problem Solving**: Identifying schedule conflicts and proposing practical alternatives.
3. **Judgement**: Resisting double-booking and operating within organizational constraints.
4. **Professionalism**: Maintaining calm, respectful decorum under customer pressure.
5. **Attention to Detail**: Accurately referencing scenario schedule facts.
6. **Following Instructions**: Adhering strictly to assigned administrative role boundaries.

> [!NOTE]
> The system evaluates observable behaviour against rubric criteria. It does NOT claim to produce scientifically validated psychometric scores or automate hiring decisions.

---

## ⚠️ AI Limitations & Governance

* **Uncertainty & Confidence**: Evaluation outputs include confidence levels (`high`, `medium`, `low`). Ambiguous responses yield `insufficient_evidence`.
* **Model Dependency**: Live evaluation utilizes Gemini API server-side; a deterministic mode (`AI_MODE=deterministic`) exists for offline development reliability.
* **Human Review**: AI evaluation provides audit-ready evidence for human hiring managers rather than replacing human judgment.

---

## ♿ Accessibility & Interaction Modes

* **Voice-First**: Web Speech API integration for natural speech recognition.
* **Text Input**: Full typing fallback for all conversational interactions.
* **Visual Fallback**: Selection cards for zero-friction interaction.
* **Text-to-Speech (TTS)**: SpeechSynthesis API for listening to questions and customer prompts.
* **Keyboard Navigation & RTL**: Full keyboard navigation, semantic HTML, and Arabic (`ar`) RTL layout support.

---

## 🔬 Future R&D Technical Uncertainties

1. **R&D Question 1**: Can voice-first interaction reliably produce structured information across different speech patterns, accents, confidence levels and environmental conditions?
2. **R&D Question 2**: Can constrained LLM evaluation produce sufficiently consistent capability assessments against predefined rubrics?
3. **R&D Question 3**: How should confidence and insufficient evidence be represented when an Individual's response is ambiguous?
4. **R&D Question 4**: How can role-specific simulations reuse a common capability framework while adapting to different workplace contexts?
5. **R&D Question 5**: How can structured evidence be exposed to employers while preserving Individual privacy and preventing inappropriate inference?
6. **R&D Question 6**: How should repeated evidence from different simulations contribute to a readiness profile?

---

## 🚀 Getting Started

### Installation & Run

1. **Install dependencies:**
   ```bash
   cmd /c npm install
   ```

2. **Run Integration Tests:**
   ```bash
   cmd /c npm test
   ```

3. **Start Server & Frontend:**
   ```bash
   # Terminal 1: Backend API Server (Port 5000)
   cmd /c npm run server

   # Terminal 2: Frontend Vite Dev Server (Port 5173)
   cmd /c npm run dev
   ```

---

## 📜 License

MIT License — BloomingPath Platform.
