# BloomingPath — Workforce Readiness & Capability Platform

**BloomingPath** is an AI-powered workforce readiness, capability diagnostic, and talent alignment platform designed to bridge the gap between education, skill development, and employment. 

By utilizing interactive voice onboarding diagnostics, verifiable evidence trails, and transparent capability scoring, BloomingPath empowers individuals to map career pathways while giving employers and educational institutions data-backed insights into candidate competencies.

---

## ✨ Key Features & Multi-Role Portals

BloomingPath provides tailored views for every stakeholder in the workforce development ecosystem:

### 👤 1. Individual Learner Portal
* **Guided Voice Onboarding:** Interactive AI voice diagnostic wizard to discover skills, goals, and experience in real time.
* **Personalized Learning Pathways:** Dynamic career progression tracking mapped to market-demanded capabilities.
* **Capability Matrix & Radar:** Real-time visualization of core skills, technical proficiencies, and soft competencies.
* **Interactive AI Tutor:** On-demand AI assistance for skill gaps and career guidance.

### 💼 2. Employer & Hiring Manager Portal
* **Talent Pipeline Analytics:** Filter and discover candidates based on verified capability scores rather than simple resume keywords.
* **Candidate Matching Index:** Multi-dimensional alignment scores between candidate skills and job requirements.
* **Competency Evidence Trails:** Deep-dive into verified evidence logs to understand *why* a candidate scored high in specific capabilities.

### 🏫 3. Academic Institution Portal
* **Curriculum Alignment & Cohort Analytics:** Track graduate workforce readiness across departments and cohorts.
* **Skill Gap Identification:** Identify industry trends and align academic curricula to real-world employment demands.
* **Graduate Placement Tracking:** Monitor student progress from enrollment through career placement.

### ⚙️ 4. System Administration Portal
* **Platform Governance & Monitoring:** Overall health, active user stats, and system performance metrics.
* **LLM & AI Configuration:** Manage API keys (e.g., Google Gemini API), model parameters, and speech-to-text / text-to-speech providers.
* **Role & Access Control:** Manage permissions across individual, employer, institution, and admin roles.

---

## 🛠️ Core Capabilities

* 🎙️ **Interactive Voice Diagnostic:** Natural language voice assessment powered by web speech synthesis and recognition.
* 🔍 **AI Explainability & Evidence Trails:** Every capability score is backed by transparent transcript snippets and verifiable assessment evidence.
* 🌐 **Multilingual Interface:** Seamless support for **English**, **Arabic (RTL support)**, and **French**.
* 🎨 **Modern Design System:** Built with Material Design 3 color tokens, sleek glassmorphism, and responsive Tailwind CSS layout.

---

## 🚀 Tech Stack

* **Frontend Framework:** [React 18](https://react.dev/)
* **Build Tool & Bundler:** [Vite 5](https://vitejs.dev/)
* **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with Forms & Container Queries
* **Iconography:** [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)
* **Fonts:** Inter (Google Fonts)

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blooming-path.git
   cd blooming-path
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the URL printed in your console).

---

## 📜 Available Scripts

In the project directory, you can run:

* `npm run dev` — Starts the Vite development server with Hot Module Replacement (HMR).
* `npm run build` — Compiles and builds production-ready static bundle into the `dist/` directory.
* `npm run preview` — Locally previews the generated production build.

---

## 📁 Project Architecture

```
blooming-path/
├── index.html                  # Main HTML entry point & Tailwind theme configuration
├── package.json                # Project metadata & dependencies
├── vite.config.js              # Vite build configuration
├── src/
│   ├── main.jsx                # Application root & top-level router/state manager
│   ├── index.css               # Global CSS styles & base resets
│   ├── components/             # Reusable UI Components
│   │   ├── AssessorRoleHeader.jsx      # Top navigation, role switcher & settings bar
│   │   ├── AuthScreen.jsx              # Login screen with quick-role access & voice signup
│   │   ├── EvidenceTrailModal.jsx      # AI explainability modal with transcript evidence
│   │   ├── GuidedOnboardingWizard.jsx  # Interactive voice onboarding diagnostic wizard
│   │   └── IndividualProfileModal.jsx  # Detailed candidate profile breakdown modal
│   └── views/                  # Main Portal Dashboards
│       ├── IndividualView.jsx          # Learner/Candidate dashboard
│       ├── EmployerView.jsx            # Employer talent discovery dashboard
│       ├── InstitutionView.jsx         # Academic institution analytics dashboard
│       └── AdminView.jsx               # System administration & LLM settings dashboard
```

---

## 🌐 Deployment

Since BloomingPath builds into static HTML/JS/CSS assets in `dist/`, it can be hosted on any static site platform:

* **Vercel:** Import your Git repository; Vercel auto-detects Vite and deploys automatically.
* **Netlify:** Connect repo, set build command to `npm run build`, and publish directory to `dist`.
* **Cloudflare Pages:** Import repo, select **Vite** preset, and deploy.
* **GitHub Pages:** Add `base: '/<repo-name>/'` in `vite.config.js` and use `npm run deploy` via `gh-pages`.

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
