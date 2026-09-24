// TTS Engine — Geriatric-calibrated voice assistant
// Maps language codes to BCP-47 locale tags and finds best voice

const LANG_MAP = {
  en:  { lang: 'en-IN',  fallback: 'en-US'  },
  as:  { lang: 'as-IN',  fallback: 'hi-IN'  },  // Assamese — falls back to Hindi voice
  mni: { lang: 'mni-IN', fallback: 'hi-IN'  },  // Manipuri  — falls back to Hindi voice
  bn:  { lang: 'bn-IN',  fallback: 'bn-IN'  },
  kha: { lang: 'en-IN',  fallback: 'en-US'  },  // Khasi — uses English voice
  mzo: { lang: 'en-IN',  fallback: 'en-US'  },  // Mizo  — uses English voice
  hi:  { lang: 'hi-IN',  fallback: 'hi-IN'  },
};

function getBestVoice(langCode) {
  const voices = window.speechSynthesis.getVoices();
  const entry = LANG_MAP[langCode] || LANG_MAP.en;

  // Helper to pick the most "human-like" cloud voice
  const pickBest = (voiceList) => {
    if (!voiceList.length) return null;
    // Prefer Google/Network voices which use high-quality neural models (Wavenet) rather than robotic local OS voices
    const premium = voiceList.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'));
    return premium || voiceList[0];
  };

  const exactMatches = voices.filter(v => v.lang === entry.lang);
  let best = pickBest(exactMatches);
  if (best) return { voice: best, lang: entry.lang };

  const prefix = entry.lang.split('-')[0];
  const prefixMatches = voices.filter(v => v.lang.startsWith(prefix));
  best = pickBest(prefixMatches);
  if (best) return { voice: best, lang: best.lang };

  const fallbackMatches = voices.filter(v => v.lang === entry.fallback);
  best = pickBest(fallbackMatches);
  if (best) return { voice: best, lang: entry.fallback };

  // Default super fallback
  const anyGoogle = voices.find(v => v.name.includes('Google US English') || v.name.includes('Google UK English Female'));
  return { voice: anyGoogle || null, lang: 'en-IN' };
}

export function speak(text, langCode = 'en', onEnd = null) {
  if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate   = 0.82;  // Deliberately slow — elderly processing speed
  utterance.pitch  = 1.0;
  utterance.volume = 1.0;

  // Fire callback when speech ends
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  // Voices load async — wait for them if not yet available
  const trySpeak = () => {
    const { voice, lang } = getBestVoice(langCode);
    if (voice) utterance.voice = voice;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
  } else {
    trySpeak();
  }
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
