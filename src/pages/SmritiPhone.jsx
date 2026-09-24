import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { streamAIResponse } from '../services/geminiService';
import { speak, stopSpeaking } from '../utils/tts';
import { analyzeSpeech } from '../utils/speechAnalyzer';

export default function SmritiPhone() {
  const { language, t, addSpeechLog } = useApp();
  const navigate = useNavigate();
  
  const [callState, setCallState] = useState('idle'); // idle, calling, connected, ended
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [callSummary, setCallSummary] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  const recognitionRef = useRef(null);
  const aiThinkingRef = useRef(false);
  const allUtterancesRef = useRef([]);
  const callStartTimeRef = useRef(null);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Map App language to speech language
      const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'as': 'as-IN', 'bn': 'bn-IN', 'ne': 'ne-NP' };
      recognition.lang = langMap[language] || 'en-IN';
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(final + interim);
        
        // If final sentence detected, send to AI
        if (final.trim() && !aiThinkingRef.current) {
          const text = final.trim();
          allUtterancesRef.current.push(text);
          handleUserSpeech(text);
          setTranscript(''); // Clear for next utterance
        }
      };
      
      recognition.onerror = (e) => console.error("Speech Error:", e.error);
      
      recognitionRef.current = recognition;
    }

    return () => {
      endCall();
    };
  }, [language]);

  // Live call timer
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleUserSpeech = async (text) => {
    aiThinkingRef.current = true;
    stopSpeaking(); // Stop any ongoing AI speech
    
    setTimeout(async () => {
      let fullResponse = "";
      
      try {
        // streamAIResponse signature: (userMessage, history, onChunk)
        await streamAIResponse(text, [], (chunk) => {
          fullResponse = chunk;
          setAiResponse(fullResponse);
        });

        // Speak the response
        setIsAiSpeaking(true);
        speak(fullResponse, language, () => {
          setIsAiSpeaking(false);
          aiThinkingRef.current = false;
          // Restart recognition after AI finishes speaking
          if (recognitionRef.current && callState === 'connected' && !isMuted) {
            try { recognitionRef.current.start(); } catch(e){}
          }
        });

      } catch (err) {
        console.error("AI Phone Error:", err);
        aiThinkingRef.current = false;
      }
    }, 500);
  };

  const startCall = () => {
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e){}
      }
      // AI initiates conversation
      const greeting = language === 'hi' ? 'Namaste! Kaise hain aap?' : 'Hello! How are you feeling today?';
      setAiResponse(greeting);
      setIsAiSpeaking(true);
      aiThinkingRef.current = true;
      
      speak(greeting, language, () => {
        setIsAiSpeaking(false);
        aiThinkingRef.current = false;
        // Restart recognition after greeting finishes
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e){}
        }
      });
      
      // Init metrics tracking
      allUtterancesRef.current = [];
      callStartTimeRef.current = Date.now();
      setCallSummary(null);
    }, 2000);
  };

  const endCall = () => {
    if (callState === 'ended') return;
    
    setCallState('ended');
    stopSpeaking();
    setIsAiSpeaking(false);
    aiThinkingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    // Process Speech Biomarkers
    if (callStartTimeRef.current && allUtterancesRef.current.length > 0) {
      const durationSec = Math.round((Date.now() - callStartTimeRef.current) / 1000);
      const analysis = analyzeSpeech(allUtterancesRef.current, durationSec);
      setCallSummary(analysis);
      if (addSpeechLog) addSpeechLog(analysis);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    } else if (isMuted && recognitionRef.current && callState === 'connected') {
      try { recognitionRef.current.start(); } catch(e){}
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#FFF' }}>
      {/* Header */}
      <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/patient')} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
          <ArrowLeft size={28} />
        </button>
        <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('appName')} Phone</span>
        <div style={{ width: 28 }} />
      </div>

      {/* Main Call Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        
        {/* Avatar */}
        <div style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0d9488, #0f766e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          boxShadow: isAiSpeaking ? '0 0 40px rgba(13, 148, 136, 0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
          animation: isAiSpeaking ? 'pulse-avatar 1.5s infinite alternate' : 'none',
          transition: 'all 0.3s ease',
          marginBottom: 40
        }}>
          🤖
        </div>

        <style>{`
          @keyframes pulse-avatar {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(13, 148, 136, 0.5); }
            100% { transform: scale(1.1); box-shadow: 0 0 60px rgba(13, 148, 136, 1); }
          }
          @keyframes ring {
            0%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(-15deg); }
            20% { transform: rotate(15deg); }
            30% { transform: rotate(-15deg); }
            40% { transform: rotate(15deg); }
            50% { transform: rotate(0deg); }
          }
        `}</style>

        {/* Status Text */}
        <h2 style={{ fontSize: '2rem', marginBottom: 10, fontWeight: 400 }}>{t('phoneTitle')}</h2>
        <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: 40 }}>
          {callState === 'idle' && t('readyToCall')}
          {callState === 'calling' && t('calling')}
          {callState === 'connected' && `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`}
          {callState === 'ended' && t('callEnded')}
        </p>

        {/* Transcript & Summary Area */}
        <div style={{ minHeight: 120, textAlign: 'center', width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {callState === 'connected' && (
            <>
              {isAiSpeaking ? (
                <p style={{ color: '#0d9488', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600 }}>{aiResponse}</p>
              ) : (
                <p style={{ color: '#FFF', fontSize: '1.2rem' }}>{transcript || t('listening')}</p>
              )}
            </>
          )}
          
          {callState === 'ended' && callSummary && (
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: 20, 
              borderRadius: 16,
              animation: 'fadeInUp 0.5s ease',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2dd4bf' }}>{t('biomarkerAnalysis')}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-around', color: '#ccc', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', color: '#FFF', fontWeight: 700 }}>{callSummary.wordCount}</div>
                  {t('wordsSpoken')}
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', color: '#FFF', fontWeight: 700 }}>{callSummary.fillerCount}</div>
                  {t('fillerWords')}
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', color: '#4CAF50', fontWeight: 700 }}>{callSummary.fluencyScore}/100</div>
                  {t('fluencyScore')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 40, marginTop: 40, alignItems: 'center' }}>
          
          {callState === 'connected' && (
            <button 
              onClick={toggleMute}
              style={{
                width: 65, height: 65, borderRadius: '50%', border: 'none',
                background: isMuted ? '#FFF' : 'rgba(255,255,255,0.15)',
                color: isMuted ? '#000' : '#FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          )}

          {callState === 'idle' || callState === 'ended' ? (
            <button 
              onClick={startCall}
              style={{
                width: 80, height: 80, borderRadius: '50%', border: 'none',
                background: '#4CAF50', color: '#FFF', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                animation: 'pulse-avatar 2s infinite',
                boxShadow: '0 10px 20px rgba(76, 175, 80, 0.4)'
              }}
            >
              <Phone size={36} style={{ animation: 'ring 2s infinite' }} />
            </button>
          ) : (
            <button 
              onClick={endCall}
              style={{
                width: 80, height: 80, borderRadius: '50%', border: 'none',
                background: '#E53935', color: '#FFF', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(229, 57, 53, 0.4)'
              }}
            >
              <PhoneOff size={36} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
