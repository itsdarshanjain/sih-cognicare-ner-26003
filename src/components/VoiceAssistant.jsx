import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speak, stopSpeaking } from '../utils/tts';




// ── Component ──
export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const [showBar, setShowBar] = useState(false);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // ── Initialize recognition ONCE ──
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;       // Show partial results live
    rec.lang = 'en-IN';
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    rec.onresult = (e) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }

      // Show interim results live
      if (interimTranscript) {
        setUserText(interimTranscript);
      }

      // Process final result
      if (finalTranscript) {
        setUserText(finalTranscript);
        processCommand(finalTranscript.toLowerCase().trim());
      }
    };

    rec.onerror = (e) => {
      console.warn('SpeechRecognition error:', e.error);
      if (e.error !== 'no-speech') {
        setListening(false);
      }
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
  }, []);

  // ── AI Intent Processing ──
  const processCommand = useCallback(async (command) => {
    if (!command) return;

    setProcessing(true);
    setShowBar(true);
    setAiText('Thinking...');

    // Stop mic immediately to prevent feedback
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (apiKey) {
        // ── AI Path ──
        const prompt = `You are 'Smriti Saathi', a Voice Assistant for an elderly dementia patient using a cognitive health app called CogniCare NER.
The patient just said: "${command}"

Available pages on the website:
- NAVIGATE_HOME: Main dashboard with brain games overview
- NAVIGATE_GAMES: Calm Mode music therapy and relaxation
- NAVIGATE_REMINDERS: Daily medicine and hydration reminders
- NAVIGATE_CAREGIVER: Caregiver monitoring dashboard
- NAVIGATE_PHONE: Smriti Phone for voice conversations
- UNKNOWN: If you cannot determine the intent

Respond ONLY with a JSON object:
{"action":"<ACTION>","response_speech":"<1-2 sentence comforting Hinglish response>"}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const clean = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(clean);

          setAiText(parsed.response_speech || 'Done!');
          speak(parsed.response_speech || 'Done!');
          executeAction(parsed.action);
          setProcessing(false);
          autoClear();
          return;
        }
      }

      // ── Fallback (no API key or API failed) ──
      fallbackRoute(command);
    } catch (err) {
      console.error('Voice AI error:', err);
      fallbackRoute(command);
    }

    setProcessing(false);
  }, [navigate]);

  // ── Route Execution ──
  const executeAction = (action) => {
    const routes = {
      NAVIGATE_HOME: '/patient',
      NAVIGATE_GAMES: '/patient/games/calm-mode',
      NAVIGATE_REMINDERS: '/patient/reminders',
      NAVIGATE_CAREGIVER: '/caregiver',
      NAVIGATE_PHONE: '/patient/phone',
    };
    if (routes[action]) {
      setTimeout(() => navigate(routes[action]), 800);
    }
  };

  // ── Keyword Fallback ──
  const fallbackRoute = (cmd) => {
    const routes = [
      { keywords: ['game', 'play', 'khel', 'khelna', 'brain'], action: 'NAVIGATE_GAMES', speech: 'Aapke liye games khol rahe hain!' },
      { keywords: ['home', 'back', 'wapas', 'dashboard', 'ghar'], action: 'NAVIGATE_HOME', speech: 'Dashboard par le ja rahi hoon.' },
      { keywords: ['remind', 'medicine', 'dawai', 'tablet', 'pani', 'water'], action: 'NAVIGATE_REMINDERS', speech: 'Aapke reminders dikhate hain.' },
      { keywords: ['doctor', 'caregiver', 'care'], action: 'NAVIGATE_CAREGIVER', speech: 'Caregiver dashboard khol rahi hoon.' },
      { keywords: ['phone', 'call', 'baat'], action: 'NAVIGATE_PHONE', speech: 'Smriti Phone khol rahi hoon.' },
      { keywords: ['music', 'sangeet', 'calm', 'relax', 'aaram'], action: 'NAVIGATE_GAMES', speech: 'Relaxing music laga rahi hoon.' },
    ];

    for (const r of routes) {
      if (r.keywords.some(k => cmd.includes(k))) {
        setAiText(r.speech);
        speak(r.speech);
        executeAction(r.action);
        autoClear();
        return;
      }
    }

    // Unknown
    setAiText('Main samajh nahi paayi. Kripya dobara boliye.');
    speak('Main samajh nahi paayi. Kripya dobara boliye.');
    autoClear();
  };

  const autoClear = () => {
    setTimeout(() => {
      setUserText('');
      setAiText('');
      setShowBar(false);
    }, 5000);
  };

  // ── Toggle ──
  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert('Your browser does not support Voice Commands. Please use Google Chrome.');
      return;
    }

    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      stopSpeaking();
      setUserText('');
      setAiText('');
      setShowBar(false);
      setProcessing(false);
      try {
        rec.start();
      } catch (e) {
        // Already started — abort and retry
        rec.abort();
        setTimeout(() => { try { rec.start(); } catch (_) {} }, 200);
      }
    }
  };
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Track TTS state
  const speakWithState = (text) => {
    setIsSpeaking(true);
    speak(text, 'en', () => setIsSpeaking(false));
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // ── Render ──
  return (
    <>
      {/* ── Listening Popup — above the mic on bottom-left ── */}
      {(showBar || listening) && (
        <div style={{
          position: 'fixed', bottom: 164, left: 380, zIndex: 10001,
          width: 310,
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: 20,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          animation: 'vaFadeIn 0.25s ease-out',
        }} data-no-print="true">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            color: '#fff', padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mic size={13} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Smriti Voice</div>
                <div style={{ fontSize: '0.58rem', opacity: 0.7 }}>
                  {listening ? '● Listening...' : processing ? '● Processing...' : isSpeaking ? '● Speaking...' : '● Ready'}
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowBar(false); setListening(false); handleStopSpeaking(); if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(_){} }}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                borderRadius: '50%', width: 24, height: 24, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px', minHeight: 50 }}>
            {listening && !userText && !aiText && (
              <div style={{
                textAlign: 'center', color: 'var(--text-muted, #94a3b8)',
                fontSize: '0.88rem', padding: '6px 0',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 2 }}>🎙️</div>
                Boliye... Main sun rahi hoon
              </div>
            )}

            {userText && (
              <div style={{ marginBottom: aiText ? 10 : 0 }}>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                  color: 'var(--text-muted, #94a3b8)', letterSpacing: 0.5, marginBottom: 3,
                }}>You said</div>
                <div style={{
                  background: 'var(--accent-teal-light, rgba(10,126,106,0.08))',
                  padding: '7px 12px', borderRadius: 10,
                  color: 'var(--text-primary, #1a1a2e)',
                  fontSize: '0.88rem', fontStyle: 'italic',
                }}>"{userText}"</div>
              </div>
            )}

            {aiText && (
              <div>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                  color: 'var(--accent-teal, #0d9488)', letterSpacing: 0.5, marginBottom: 3,
                }}>Smriti Saathi</div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(10,126,106,0.06), rgba(10,126,106,0.02))',
                  padding: '7px 12px', borderRadius: 10,
                  color: 'var(--text-primary, #1a1a2e)',
                  fontSize: '0.88rem', fontWeight: 500,
                  borderLeft: '3px solid var(--accent-teal, #0d9488)',
                }}>
                  {processing && aiText === 'Thinking...' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                      Thinking...
                    </span>
                  ) : aiText}
                </div>
              </div>
            )}
          </div>

          {/* Footer — action buttons */}
          <div style={{
            padding: '8px 16px 12px', display: 'flex', gap: 8,
            borderTop: '1px solid var(--border-color, #e2e8f0)',
          }}>
            <button
              onClick={toggle}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
                background: listening ? '#ef4444' : 'var(--accent-teal, #0d9488)',
                color: '#fff', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              {listening ? <><MicOff size={14} /> Stop Listening</> : <><Mic size={14} /> Start Listening</>}
            </button>
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none',
                  background: '#f97316', color: '#fff', fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <X size={14} /> Stop Voice
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Floating Mic Button — bottom-left, next to SOS ── */}
      <div style={{
        position: 'fixed', bottom: 100, left: 380, zIndex: 9998,
      }} data-no-print="true">
        <button
          onClick={toggle}
          style={{
            width: 52, height: 52, borderRadius: '50%', border: 'none',
            background: listening
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #0d9488, #0f766e)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: listening
              ? '0 0 0 5px rgba(34,197,94,0.25), 0 4px 16px rgba(34,197,94,0.4)'
              : '0 4px 14px rgba(10,126,106,0.35)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            position: 'relative',
          }}
          title="Voice Assistant — Tap to speak"
        >
          {listening && (
            <span style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: '2.5px solid rgba(34,197,94,0.4)',
              animation: 'voicePulse 1.5s ease-out infinite',
            }} />
          )}
          {processing
            ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            : <Mic size={20} />
          }
        </button>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes voicePulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes vaFadeIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[data-no-print="true"] { left: 16px !important; }
        }
      `}</style>
    </>
  );
}
