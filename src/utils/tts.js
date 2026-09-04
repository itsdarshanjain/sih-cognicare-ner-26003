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

  // Try exact match first
  let voice = voices.find(v => v.lang === entry.lang);
  if (voice) return { voice, lang: entry.lang };

  // Try language prefix (e.g. 'hi' for 'hi-IN')
  const prefix = entry.lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(prefix));
  if (voice) return { voice, lang: voice.lang };

  // Try fallback
  voice = voices.find(v => v.lang === entry.fallback);
  if (voice) return { voice, lang: entry.fallback };

  // Default
  return { voice: null, lang: 'en-IN' };
}

export function speak(text, langCode = 'en') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate   = 0.82;  // Deliberately slow — elderly processing speed
  utterance.pitch  = 1.0;
  utterance.volume = 1.0;

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
