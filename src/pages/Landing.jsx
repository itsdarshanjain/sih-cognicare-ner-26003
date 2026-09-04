import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BarChart3, Gamepad2, Sparkles, Wifi, Volume2, Cpu, ShieldCheck, HeartPulse, BrainCircuit, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';
import { speak } from '../utils/tts';

const STATS = [
  { value: '9M+', label: 'Indians with Dementia' },
  { value: '90%', label: 'Undiagnosed Cases' },
  { value: '7', label: 'NER Languages Supported' },
  { value: '12', label: 'Cognitive Games' },
];

const FEATURES = [
  { icon: <BrainCircuit size={28} />, title: '12 Cognitive Games', desc: 'Memory, attention, language, pattern — rooted in NER heritage' },
  { icon: <Mic size={28} />, title: 'Voice in 7 Languages', desc: 'Assamese, Manipuri, Bengali, Khasi, Mizo, Hindi & English TTS' },
  { icon: <Wifi size={28} />, title: 'Fully Offline PWA', desc: 'Works without internet — critical for remote NER hill areas' },
  { icon: <HeartPulse size={28} />, title: 'AI Clinical Insights', desc: 'Sundowning detection, decline alerts, caregiver dashboard' },
  { icon: <Cpu size={28} />, title: 'Adaptive Difficulty', desc: 'ML engine adjusts game complexity to patient cognitive level' },
  { icon: <ShieldCheck size={28} />, title: 'ABDM-Ready Design', desc: 'Architecture aligned with Ayushman Bharat Digital Mission' },
];

const NER_STATES = [
  { state: 'Assam', pop: '3.2M elderly' },
  { state: 'Manipur', pop: '0.42M elderly' },
  { state: 'Meghalaya', pop: '0.38M elderly' },
  { state: 'Mizoram', pop: '0.19M elderly' },
  { state: 'Nagaland', pop: '0.28M elderly' },
  { state: 'Tripura', pop: '0.61M elderly' },
  { state: 'Arunachal', pop: '0.19M elderly' },
  { state: 'Sikkim', pop: '0.08M elderly' },
];

export default function Landing() {
  const { t, language } = useApp();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVoiceWelcome = () => {
    speak(`${t('welcome')}. ${t('heroSubtitle')}`, language);
  };

  return (
    <div className="landing-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-wrapper {
          min-height: 100vh;
          background-color: #0b1120;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background Orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: orbFloat 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .orb-1 { width: 50vw; height: 50vw; background: rgba(16, 185, 129, 0.2); top: -20%; left: -10%; }
        .orb-2 { width: 40vw; height: 40vw; background: rgba(14, 165, 233, 0.2); top: 30%; right: -10%; animation-delay: -5s; }
        .orb-3 { width: 45vw; height: 45vw; background: rgba(139, 92, 246, 0.15); bottom: -20%; left: 20%; animation-delay: -10s; }

        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.9); }
        }

        /* Glassmorphism Classes */
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .glass-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.1);
        }
        .glass-card:hover::before { opacity: 1; }

        /* Typography */
        .gradient-text {
          background: linear-gradient(to right, #34d399, #0ea5e9, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Buttons */
        .btn-glow {
          position: relative;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          box-shadow: 0 0 20px rgba(16,185,129,0.4);
          transition: all 0.3s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 40px rgba(16,185,129,0.6);
          transform: translateY(-2px);
        }
        .btn-glow::after {
          content: ''; position: absolute; inset: -2px; border-radius: inherit;
          background: linear-gradient(135deg, #34d399, #0ea5e9);
          z-index: -1; opacity: 0; transition: opacity 0.3s ease;
        }
        .btn-glow:hover::after { opacity: 1; }

        .btn-outline-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fafc;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .btn-outline-glass:hover {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        /* Utility */
        .content-layer {
          position: relative;
          z-index: 10;
        }
        
        .fade-up {
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* Dynamic Background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Main Content Layer */}
      <div className="content-layer">
        
        {/* ════════ HERO SECTION ════════ */}
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
          <div className="glass-panel" style={{ maxWidth: 1000, width: '100%', padding: '80px 40px', textAlign: 'center', position: 'relative' }}>
            
            {/* Pill */}
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 32, letterSpacing: 1 }}>
              <Sparkles size={14} color="#34d399" />
              SIH 2026 • PS 26003 • MDoNER • Team Prakalp
            </div>

            {/* Main Title */}
            <h1 className="fade-up" style={{ animationDelay: '0.1s', fontFamily: "'Lora', serif", fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 10, letterSpacing: '-0.02em' }}>
              <span className="gradient-text">{t('appName')}</span>
            </h1>
            <h2 className="fade-up" style={{ animationDelay: '0.2s', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 400, color: '#94a3b8', marginBottom: 32, letterSpacing: '0.02em' }}>
              {t('tagline')}
            </h2>
            <p className="fade-up" style={{ animationDelay: '0.3s', fontSize: '1.1rem', color: '#64748b', maxWidth: 680, margin: '0 auto 48px', lineHeight: 1.6 }}>
              {t('heroSubtitle')}
            </p>

            {/* Actions */}
            <div className="fade-up" style={{ animationDelay: '0.4s', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/patient" className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 40px', borderRadius: 100, textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
                <Gamepad2 size={24} />
                {t('enterPatient')}
              </Link>
              <Link to="/caregiver" className="btn-outline-glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 40px', borderRadius: 100, textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
                <BarChart3 size={24} />
                {t('enterCaregiver')}
              </Link>
            </div>

            {/* Read Aloud */}
            <button onClick={handleVoiceWelcome} className="fade-up btn-outline-glass" style={{ animationDelay: '0.5s', marginTop: 40, padding: '10px 24px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
              <Volume2 size={16} /> {t('readAloud')}
            </button>
          </div>
        </div>

        {/* ════════ STATS STRIP ════════ */}
        <div style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {STATS.map((stat, i) => (
              <div key={i} className="glass-card fade-up" style={{ animationDelay: `${0.2 + i * 0.1}s`, padding: '40px 24px', textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, marginBottom: 12 }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ FEATURES GRID ════════ */}
        <div style={{ padding: '100px 24px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>Built for the <span className="gradient-text">Future of Care</span></h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>Advanced AI capabilities wrapped in an intuitive, elder-friendly interface, fully functional offline.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {FEATURES.map((feat, i) => (
                <div key={i} className="glass-card" style={{ padding: '40px 32px' }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12, color: '#f8fafc' }}>{feat.title}</h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ GEOGRAPHIC COVERAGE ════════ */}
        <div style={{ padding: '120px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>Unifying <span className="gradient-text">All 8 NER States</span></h2>
             <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 64px' }}>Delivering localized memory care to over 5 million elderly individuals across the North Eastern Region.</p>
             
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
               {NER_STATES.map((s, i) => (
                 <div key={i} className="glass-card" style={{ padding: '20px 32px', minWidth: 200 }}>
                   <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.state}</div>
                   <div style={{ fontSize: '0.85rem', color: '#34d399' }}>{s.pop}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* ════════ FOOTER ════════ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            <strong style={{ color: '#f8fafc' }}>CogniCare NER</strong> &copy; 2026. Built by <strong style={{ color: '#34d399' }}>Team Prakalp</strong> for SIH PS 26003 (MDoNER).
          </p>
        </div>

      </div>
    </div>
  );
}
