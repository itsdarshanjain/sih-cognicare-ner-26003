import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Square, Send, MessageSquare, X, Volume2, VolumeX } from 'lucide-react';
import { streamAIResponse } from '../services/geminiService';

// ── CSS-in-JS styles ──
const STYLES = {
  container: { position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  window: {
    width: 370, height: 540, backgroundColor: '#fff', borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', marginBottom: 16, animation: 'saathiFadeIn 0.25s ease-out',
  },
  header: {
    background: 'linear-gradient(135deg, #0d9488, #0f766e)', color: '#fff',
    padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logoCircle: { background: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { margin: 0, fontSize: '1.05rem', fontWeight: 700, letterSpacing: 0.3 },
  headerSub: { margin: 0, fontSize: '0.65rem', opacity: 0.8, fontWeight: 400 },
  closeBtn: { background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  msgArea: { flex: 1, overflowY: 'auto', padding: '16px 14px', background: '#f0fdfa', display: 'flex', flexDirection: 'column', gap: 10 },
  userBubble: {
    alignSelf: 'flex-end', backgroundColor: '#0d9488', color: '#fff',
    padding: '10px 14px', borderRadius: '16px 16px 4px 16px', maxWidth: '82%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontSize: '0.95rem', lineHeight: 1.45,
  },
  modelBubble: {
    alignSelf: 'flex-start', backgroundColor: '#fff', color: '#1f2937',
    padding: '10px 14px', borderRadius: '16px 16px 16px 4px', maxWidth: '82%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontSize: '0.95rem', lineHeight: 1.45,
  },
  thinkingDots: { alignSelf: 'flex-start', background: '#fff', padding: '10px 18px', borderRadius: 16, color: '#9ca3af', fontSize: '0.85rem' },
  inputArea: { padding: '12px 14px', background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, alignItems: 'center' },
  textInput: {
    flex: 1, padding: '11px 14px', borderRadius: 22, border: '1.5px solid #d1d5db',
    outline: 'none', fontSize: '0.95rem', color: '#111', background: '#fafafa',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    background: '#0d9488', color: '#fff', border: 'none', borderRadius: '50%',
    width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
  },
  fab: {
    width: 62, height: 62, borderRadius: '50%', backgroundColor: '#0d9488', color: '#fff',
    border: 'none', boxShadow: '0 4px 18px rgba(13,148,136,0.45)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  // Listening banner
  listeningBanner: {
    background: '#fef2f2', borderTop: '1px solid #fecaca', padding: '10px 14px',
    display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between',
  },
  listeningLeft: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 },
  pulseCircle: {
    width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444',
    animation: 'saathiPulse 1.2s infinite ease-in-out', flexShrink: 0,
  },
  listeningText: { fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  liveTranscript: { fontSize: '0.8rem', color: '#4b5563', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' },
  stopBtn: {
    background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8,
    padding: '7px 14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
    display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
    transition: 'background 0.15s',
  },
  micBtn: {
    background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '50%',
    width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
  },
};

// ── Keyframes injected once ──
const KEYFRAMES = `
@keyframes saathiPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}
@keyframes saathiFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes saathiDots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}
`;

export default function SmritiSaathiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'model', text: "Namaste! Main Smriti Saathi hoon. Aaj aap kaisa mehsoos kar rahe hain? 🙏" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const messagesEndRef = useRef(null);
  const isListeningRef = useRef(false); // Mirror state for callbacks
  const stylesInjected = useRef(false);

  // Inject keyframe CSS once
  useEffect(() => {
    if (!stylesInjected.current) {
      const style = document.createElement('style');
      style.textContent = KEYFRAMES;
      document.head.appendChild(style);
      stylesInjected.current = true;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, liveTranscript]);

  // ── Speech Recognition Setup ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      const fullText = (final + interim).trim();
      transcriptRef.current = fullText;
      setLiveTranscript(fullText);
      setInputText(fullText);
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('🎤 Microphone access blocked!\n\nPlease click the lock icon 🔒 in your browser address bar → Allow Microphone → Reload page.');
      }
      if (event.error !== 'no-speech') {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      // Auto-restart if user hasn't stopped it manually
      if (isListeningRef.current) {
        try { recognition.start(); } catch (e) { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // ── TTS speak function with best natural voice ──
  const speak = useCallback((text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();

    const doSpeak = () => {
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);

      // Priority order: Google Hindi > any Hindi female > any Hindi > English female > default
      const googleHindi = voices.find(v => v.name.includes('Google') && v.lang.startsWith('hi'));
      const anyHindiFemale = voices.find(v => v.lang.startsWith('hi') && /female|woman|lekha|swara/i.test(v.name));
      const anyHindi = voices.find(v => v.lang.startsWith('hi'));
      const googleEnglishFemale = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en') && /female|woman/i.test(v.name));
      const naturalEnglish = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-IN'));

      const bestVoice = googleHindi || anyHindiFemale || anyHindi || googleEnglishFemale || naturalEnglish;

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.rate = 0.9;   // Slightly slow — warm & clear for elderly
      utterance.pitch = 1.05; // Slightly higher — sounds more natural/feminine
      utterance.volume = 1;
      synth.speak(utterance);
    };

    // Voices may load asynchronously
    if (synth.getVoices().length > 0) {
      doSpeak();
    } else {
      synth.onvoiceschanged = () => doSpeak();
    }
  }, []);

  // ── Start Listening ──
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('This browser does not support voice input. Please use Chrome.');
      return;
    }
    window.speechSynthesis?.cancel(); // Stop any speech
    setInputText('');
    setLiveTranscript('');
    transcriptRef.current = '';
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started, abort and restart
      recognitionRef.current.abort();
      setTimeout(() => {
        try { recognitionRef.current.start(); } catch (e2) { console.error(e2); }
      }, 100);
    }
  }, []);

  // ── Stop Listening & Send ──
  const stopListeningAndSend = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setLiveTranscript('');
    const text = transcriptRef.current.trim();
    if (text) {
      handleSendDirect(text);
    }
    transcriptRef.current = '';
  }, []);

  // ── Handle Send (text or voice) ──
  const handleSendDirect = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg, { sender: 'model', text: '' }]);
    setInputText('');
    setIsProcessing(true);

    let finalText = '';

    await streamAIResponse(text.trim(), messages, (currentText) => {
      setIsProcessing(false);
      finalText = currentText;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'model', text: currentText };
        return updated;
      });
    });

    if (finalText) {
      speak(finalText);
    }
  }, [messages, speak]);

  const handleTextSend = useCallback(() => {
    if (!inputText.trim()) return;
    handleSendDirect(inputText);
  }, [inputText, handleSendDirect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  }, [handleTextSend]);

  // ── Render ──
  return (
    <div style={STYLES.container}>
      {isOpen && (
        <div style={STYLES.window}>
          {/* Header */}
          <div style={STYLES.header}>
            <div style={STYLES.headerLeft}>
              <div style={STYLES.logoCircle}>
                <Volume2 size={18} />
              </div>
              <div>
                <h3 style={STYLES.headerTitle}>Smriti Saathi</h3>
                <p style={STYLES.headerSub}>AI Memory Companion</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={STYLES.closeBtn}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={STYLES.msgArea}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.sender === 'user' ? STYLES.userBubble : STYLES.modelBubble}>
                {msg.text || (msg.sender === 'model' ? '...' : '')}
              </div>
            ))}
            {isProcessing && (
              <div style={STYLES.thinkingDots}>Saathi soch rahi hai...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening Banner (shown when mic is active) */}
          {isListening && (
            <div style={STYLES.listeningBanner}>
              <div style={STYLES.listeningLeft}>
                <div style={STYLES.pulseCircle} />
                <div style={{ minWidth: 0 }}>
                  <div style={STYLES.listeningText}>🎤 Listening...</div>
                  {liveTranscript && (
                    <div style={STYLES.liveTranscript}>"{liveTranscript}"</div>
                  )}
                </div>
              </div>
              <button onClick={stopListeningAndSend} style={STYLES.stopBtn}>
                <Square size={12} /> Stop & Send
              </button>
            </div>
          )}

          {/* Input Area */}
          <div style={STYLES.inputArea}>
            <button
              onClick={isListening ? stopListeningAndSend : startListening}
              style={{
                ...STYLES.micBtn,
                background: isListening ? '#fecaca' : '#f3f4f6',
                color: isListening ? '#dc2626' : '#4b5563',
              }}
              title={isListening ? 'Stop & Send' : 'Start Listening'}
            >
              {isListening ? <Square size={18} /> : <Mic size={20} />}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Saathi se baat karein..."
              style={STYLES.textInput}
              disabled={isListening}
            />
            <button
              onClick={handleTextSend}
              disabled={isListening || !inputText.trim()}
              style={{
                ...STYLES.sendBtn,
                opacity: (isListening || !inputText.trim()) ? 0.5 : 1,
                cursor: (isListening || !inputText.trim()) ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={STYLES.fab}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(13,148,136,0.55)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(13,148,136,0.45)'; }}
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
