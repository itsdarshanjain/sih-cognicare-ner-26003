<div align="center">

  <img src="https://img.shields.io/badge/SIH_2026-Grand_Finale-0D6E6E?style=for-the-badge&logo=bookstack&logoColor=white" />
  <img src="https://img.shields.io/badge/MDoNER-Government_of_India-138808?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Theme-MedTech_%2F_HealthTech-8B5CF6?style=for-the-badge" />

  <br /><br />

  # 🧠 CogniCare NER

  **AI-Based Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region**

  <br />

  Team Prakalp (130019) &nbsp;|&nbsp; PS ID: SIH26003 &nbsp;|&nbsp; Institute of Engineering & Science, IPS Academy, Indore

  <br />

  [▶️ Watch Demo Video](https://youtu.be/oJeZkT_caJ8) &nbsp;&nbsp;•&nbsp;&nbsp; [📄 Detailed Technical Report (PDF)](https://drive.google.com/file/d/1kiV3j_th__DyrfPFjOVzJPc28LvrDt_Q/view) &nbsp;&nbsp;•&nbsp;&nbsp; [🚀 Live Deployment](https://sih-cognicare-ner-26003.vercel.app)

</div>

---

## 📖 The Problem

Dementia affects **5.3 million elderly** in India. In the North Eastern Region, this crisis is made far worse by:

- **Language barriers** — existing apps are English-only, while NER elderly speak Assamese, Mizo, Khasi, Manipuri
- **Zero internet** — cloud-dependent apps fail completely in remote districts like Majuli and Tawang
- **Cultural disconnect** — generic western puzzles don't trigger the autobiographical memory pathways that therapy requires
- **No clinical tracking** — caregivers rely on subjective memory; doctors get zero continuous telemetry

**90% of rural dementia patients remain undiagnosed and untreated.** *(Source: ARDSI Report)*

---

## 💡 Our Solution

CogniCare NER is an **offline-first Progressive Web App** that delivers culturally localized cognitive therapy directly on existing low-end smartphones — no app store, no internet required.

### Core Capabilities

| # | Feature | How It Works |
|:--|:--------|:-------------|
| 1 | **13 Clinical Cognitive Games** | Mapped to 8 cognitive domains — Memory, Attention, Executive Function, Visuospatial, Language, Problem Solving, Processing Speed, Motor Skills |
| 2 | **Voice-First AI Assistant (Smriti Saathi)** | Powered by Gemini 3.5 — supports Assamese, Manipuri, Khasi, Mizo, Bengali, Hindi, English |
| 3 | **Vocal Biomarker Detection** | Passively tracks Type-Token Ratio, filler words, speech cadence, and bigram repetition to flag cognitive decline |
| 4 | **100% Offline PWA** | Service Workers + IndexedDB — full therapy runs locally with zero connectivity |
| 5 | **Procedural NER Audio Engine** | 6 folk instruments (Bihu Dhol, Pepa, Pung, Taal, Bamboo Flute, Mizo Gong) synthesized via Web Audio API — zero MP3 downloads |
| 6 | **Caregiver Dashboard** | Weekly CWI trends, per-game analytics, vocal biomarker history, burnout risk assessment |
| 7 | **Smart Reminders & Emergency SOS** | Native-dialect medicine/hydration alerts + one-tap wandering emergency contact |
| 8 | **Geriatric-First UI** | 56px+ touch targets, high-contrast themes, zero nested menus, single-tap navigation |

---

## 🎮 The 13 Games

| Game | Cognitive Domain | What the Patient Does |
|:-----|:-----------------|:----------------------|
| Memory Match | Short-Term Memory | Match pairs of Bihu Dhols, Rhinos, Japi hats |
| Family Faces | Autobiographical Memory | Identify uploaded family photos by name |
| Melody Memory | Working Memory | Repeat patterns of synthesized NER instruments |
| Daily Routine | Executive Function | Drag-and-drop daily tasks in chronological order |
| Cultural Connections | Associative Memory | Connect cultural items to their NER states |
| Proverb Completion | Semantic Language | Complete famous Assamese/Hindi proverbs |
| Word Completion | Linguistics | Fill missing letters in common words |
| Number Patterns | Mathematical Cognition | Identify the next number in a sequence |
| Colour-Word Match | Attention (Stroop Test) | Name the ink color, not the written word |
| Market Sorting | Categorization | Sort grocery items into correct categories |
| Odd One Out | Visual Discrimination | Identify the item that doesn't belong |
| Pattern Replication | Visuospatial Skills | Reproduce visual patterns on a grid |
| Calm Mode | Sundowning Therapy | 40Hz Gamma binaural beats + procedural rain sounds |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│  Tier 1: Patient Interface (React 18 PWA)           │
│  Web Speech API · Touch Events · Geriatric UI       │
├─────────────────────────────────────────────────────┤
│  Tier 2: Core AI Engine                             │
│  Gemini 3.5 · Adaptive Difficulty · Biomarkers      │
├─────────────────────────────────────────────────────┤
│  Tier 3: Edge Data Layer                            │
│  IndexedDB · Service Workers · Web Audio API         │
├─────────────────────────────────────────────────────┤
│  Tier 4: Clinical Output                            │
│  Caregiver Dashboard · Alerts · Reminders · SOS     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Frontend** | React 18, Vite, React Router, Lucide Icons, CSS3 Custom Properties |
| **Offline/Edge** | Service Workers (Workbox), IndexedDB, Web Audio API |
| **AI & Voice** | Google Gemini 3.5 Flash, Web Speech API (STT/TTS) |
| **Audio Engine** | Native Web Audio API — OscillatorNode, GainNode, BiquadFilterNode |
| **State** | React Context API (AppContext.jsx — comprehensive patient/game/language state) |

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI — VoiceAssistant, EmergencySOS, SmritiSaathi, MoodCheckIn
├── context/             # AppContext.jsx — centralized state for patients, games, translations
├── games/               # 13 clinical game components
├── pages/               # Landing, PatientHub, CaregiverDashboard, Reminders, Alerts, Profiles
├── services/            # Gemini API integration
└── utils/               # audio.js (NER synthesis), speechAnalyzer.js (biomarkers), tts.js, telemetry.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Google Gemini API key

### Run Locally

```bash
# Clone the repository
git clone https://github.com/itsdarshanjain/sih-cognicare-ner-26003.git
cd sih-cognicare-ner-26003

# Install dependencies
npm install

# Create .env file with your Gemini key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 👥 Team Prakalp

| # | Name | Role |
|:--|:-----|:-----|
| 1 | **Darshan Jain** | Team Leader |
| 2 | **Apurva Verma** | Developer |
| 3 | **Tejasree** | Research |
| 4 | **Chinmay Gour** | Developer |
| 5 | **Prasanna Parmar** | Developer |
| 6 | **Puja Pawar** | Developer |

**Institute of Engineering & Science, IPS Academy, Indore**

---

<div align="center">
  <sub>Built with ❤️ for the elderly of North East India — Team Prakalp, SIH 2026</sub>
</div>
