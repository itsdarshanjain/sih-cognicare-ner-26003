<div align="center">
  <img src="https://img.shields.io/badge/SIH_2026-Grand_Finale-0D9488?style=for-the-badge&logo=codeforces" alt="SIH 2026" />
  <img src="https://img.shields.io/badge/Ministry-MDoNER-10B981?style=for-the-badge" alt="MDoNER" />
  <img src="https://img.shields.io/badge/Theme-MedTech-8B5CF6?style=for-the-badge" alt="MedTech" />

  <h1>🧠 CogniCare NER</h1>
  <h3>AI-Based Cognitive Gaming & Memory Assistance for Elderly Dementia</h3>
  <p><b>Team Prakalp (130019) | Problem Statement: SIH26003</b></p>
</div>

---

## 📖 Overview
**CogniCare NER** is an edge-native, AI-powered cognitive therapy platform engineered specifically for the North Eastern Region (NER) of India. 

Dementia affects over 5.3 million elderly in India. In the NER, this crisis is compounded by severe language barriers, extreme rural connectivity deficits, and a lack of geriatric specialists. Generic, English-first puzzle apps fail to provide meaningful clinical therapy.

CogniCare solves this by delivering **Culturally Localized Games**, a **Voice-First UI in 7 NER Languages**, and **AI Vocal Biomarker Detection** entirely through a **100% Offline Progressive Web App (PWA)**.

---

## ✨ Core Clinical Capabilities

1. **🎙️ Voice-First NER Interface:** Powered by Gemini 3.5, the elderly navigate entirely by speaking in Assamese, Manipuri, Khasi, Mizo, Bengali, Hindi, or English. Zero tech literacy required.
2. **🧩 13 Cognitive Games:** Targets 8 clinical domains (Memory, Executive Function, Visuospatial). Games are culturally rooted (e.g., Kaziranga animals, Bihu proverbs) to trigger deep autobiographical memory.
3. **〰️ Vocal Biomarker Analyzer:** Actively analyzes speech cadence, filler word frequency, and Type-Token Ratio (TTR) to detect hidden cognitive load.
4. **📶 100% Offline Edge Infrastructure:** Service Workers and IndexedDB cache the entire engine locally. Procedural Audio Synthesis replaces massive MP3 downloads. It works flawlessly in zero-connectivity zones like Majuli.
5. **🧮 Caregiver Clinical Dashboard:** Converts raw gameplay telemetry and voice data into an MMSE-grade Cognitive Wellness Index (CWI) for remote doctors.
6. **🚨 Smart Reminders & SOS:** Automated medicine/hydration audio reminders in native dialects, plus a one-tap wandering SOS.

---

## 🏗️ System Architecture

Our 4-layer edge-native architecture ensures absolute data privacy and zero latency.

*   **1. Patient Interface:** Web Speech API (STT), Touch Events, Geriatric UI (56px+ targets, ultra-high contrast).
*   **2. Core AI Engine:** Gemini 3.5 Voice Assistant, Adaptive Difficulty heuristics, Vocal Biomarker Extractor.
*   **3. Local Data Layer:** IndexedDB (Scores/Logs caching), Service Workers (Offline PWA routing), Web Audio API (Procedural folk music synthesis).
*   **4. Clinical Output:** Caregiver Analytics Dashboard, CWI Calculator, Sundowning Alerts, PDF Reports.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Edge / Offline** | Workbox (Service Workers), LocalForage (IndexedDB) |
| **Generative AI** | Google Gemini 3.5 Flash, Web Speech API |
| **Audio Engine** | Native Web Audio API (Oscillator/Gain Synthesis) |
| **Backend / DB** | Node.js, Express.js, MongoDB Atlas |

---

## 🚀 Local Development Setup

To run this project locally on your machine for evaluation:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/CogniCare-NER.git
   cd CogniCare-NER
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for Production (PWA Generation):**
   ```bash
   npm run build
   ```

---

## 🛡️ Clinical Feasibility & Privacy

*   **Zero Hardware Cost:** Runs natively in the browser on existing ₹5,000 Android smartphones. No specialized medical tablets required.
*   **Edge Data Privacy:** AI processing and telemetry storage happen locally via IndexedDB. Sensitive medical data never leaves the device unless explicitly authorized for cloud backup.

---

<div align="center">
  <p><i>Built with empathy for the elderly by Team Prakalp.</i></p>
</div>
