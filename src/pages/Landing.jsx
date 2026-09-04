import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BarChart3, Gamepad2, Sparkles, Wifi, Volume2, Cpu, ShieldCheck, Brain } from 'lucide-react';
import { useState } from 'react';
import { speak } from '../utils/tts';

const STATS = [
  { value: '9M+',  label: 'Indians with Dementia',  color: 'var(--accent-teal)'   },
  { value: '90%',  label: 'Undiagnosed Cases',       color: 'var(--accent-red)'    },
  { value: '7',    label: 'NER Languages',            color: 'var(--accent-green)'  },
  { value: '12',   label: 'Cognitive Games',          color: 'var(--accent-purple)' },
];

const FEATURES = [
  { icon: '🧠', title: '12 Cognitive Games',   desc: 'Memory, attention, language, pattern — rooted in NER heritage'  },
  { icon: '🗣️', title: 'Voice in 7 Languages', desc: 'Assamese, Manipuri, Bengali, Khasi, Mizo, Hindi & English TTS'  },
  { icon: '📡', title: 'Fully Offline PWA',    desc: 'Works without internet — critical for remote NER hill areas'     },
  { icon: '📊', title: 'AI Clinical Insights', desc: 'Sundowning detection, decline alerts, caregiver dashboard'      },
  { icon: '🤖', title: 'Adaptive Difficulty',  desc: 'ML engine adjusts game complexity to patient cognitive level'    },
  { icon: '🛡️', title: 'ABDM-Ready Design',    desc: 'Architecture aligned with Ayushman Bharat Digital Mission'      },
];

const NER_STATES = [
  { state: 'Assam',     emoji: '🦏', pop: '3.2M elderly',  color: '#0A7E6A' },
  { state: 'Manipur',   emoji: '🏇', pop: '0.42M elderly', color: '#1D9B5F' },
  { state: 'Meghalaya', emoji: '🌿', pop: '0.38M elderly', color: '#2980B9' },
  { state: 'Mizoram',   emoji: '🎋', pop: '0.19M elderly', color: '#7D3C98' },
  { state: 'Nagaland',  emoji: '🦅', pop: '0.28M elderly', color: '#C9930B' },
  { state: 'Tripura',   emoji: '🛕', pop: '0.61M elderly', color: '#D35400' },
  { state: 'Arunachal', emoji: '🏔️', pop: '0.19M elderly', color: '#16A085' },
  { state: 'Sikkim',    emoji: '⛰️', pop: '0.08M elderly', color: '#8E44AD' },
];

/* Floating background emojis */
const PARTICLES = ['🧠','🏔️','🎵','🍵','🌿','🦏','🎋','🛕','🎭','📜'];

export default function Landing() {
  const { t, language } = useApp();
  const [activeFeature, setActiveFeature] = useState(null);

  const handleVoiceWelcome = () => {
    speak(`${t('welcome')}. ${t('heroSubtitle')}`, language);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <div style={{
        background: 'var(--gradient-hero)',
        padding: '80px 40px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Mesh gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-mesh)', pointerEvents: 'none' }} />

        {/* Floating particles */}
        {PARTICLES.map((em, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${8 + (i * 9.5) % 88}%`,
            top: `${10 + (i * 13) % 75}%`,
            fontSize: `${1.4 + (i % 3) * 0.7}rem`,
            opacity: 0.06,
            animation: `floatSlow ${5 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
            pointerEvents: 'none',
          }}>{em}</div>
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto' }}>

          {/* Award pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 22px',
            background: 'rgba(10,126,106,0.07)',
            border: '1px solid rgba(10,126,106,0.15)',
            borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)',
            marginBottom: 32,
            animation: 'fadeInDown 0.6s ease-out',
            backdropFilter: 'blur(8px)',
          }}>
            <Sparkles size={14} /> SIH 2026 · PS 26003 · MDoNER · Team Prakalp
          </div>

          {/* App name — gradient only on this text */}
          <div style={{
            fontFamily: "'Lora', serif",
            fontSize: '5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            paddingBottom: 15,
            marginBottom: 0,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'fadeInUp 0.7s ease-out 0.1s backwards',
          }}>
            {t('appName')}
          </div>

          {/* Tagline — plain text, NO gradient, NO background */}
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginBottom: 28,
            letterSpacing: '0.02em',
            animation: 'fadeInUp 0.7s ease-out 0.2s backwards',
          }}>
            {t('tagline')}
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto 36px',
            lineHeight: 1.78,
            animation: 'fadeInUp 0.7s ease-out 0.3s backwards',
          }}>
            {t('heroSubtitle')}
          </p>

          {/* Stats strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40,
            marginBottom: 44, flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease-out 0.35s backwards',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.7, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.7s ease-out 0.45s backwards',
          }}>
            <Link to="/patient" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 36px',
              borderRadius: 20,
              background: 'var(--gradient-primary)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.05rem', fontWeight: 700,
              boxShadow: '0 10px 32px rgba(10,126,106,0.28)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              minWidth: 240,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 18px 48px rgba(10,126,106,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 32px rgba(10,126,106,0.28)'; }}
            >
              <Gamepad2 size={26} />
              <div style={{ textAlign: 'left' }}>
                <div>{t('patientPortal')}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.82, fontWeight: 400, marginTop: 2 }}>{t('games')} · {t('reminders')}</div>
              </div>
            </Link>

            <Link to="/caregiver" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 36px',
              borderRadius: 20,
              background: 'white',
              color: 'var(--accent-teal)',
              textDecoration: 'none',
              fontSize: '1.05rem', fontWeight: 700,
              border: '2px solid rgba(10,126,106,0.12)',
              boxShadow: '0 4px 20px rgba(10,60,40,0.07)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              minWidth: 240,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.boxShadow = '0 18px 48px rgba(10,60,40,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(10,126,106,0.12)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,60,40,0.07)'; }}
            >
              <BarChart3 size={26} />
              <div style={{ textAlign: 'left' }}>
                <div>{t('caregiverPortal')}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.6, fontWeight: 400, marginTop: 2 }}>{t('dashboard')} · {t('alerts')}</div>
              </div>
            </Link>
          </div>

          {/* Voice button */}
          <div style={{ marginTop: 22, animation: 'fadeInUp 0.7s ease-out 0.55s backwards' }}>
            <button onClick={handleVoiceWelcome} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(10,126,106,0.12)',
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--accent-teal)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,126,106,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
            >
              <Volume2 size={15} /> {t('readAloud')}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURE STRIP — 6 items, 3×2
      ══════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}>
        {FEATURES.map((f, i) => (
          <div key={i}
            onMouseEnter={() => setActiveFeature(i)}
            onMouseLeave={() => setActiveFeature(null)}
            style={{
              padding: '40px 28px',
              textAlign: 'center',
              borderRight: i % 3 !== 2 ? '1px solid var(--border-color)' : 'none',
              borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none',
              background: activeFeature === i ? 'rgba(10,126,106,0.03)' : 'transparent',
              transition: 'background 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              fontSize: '2.4rem', marginBottom: 14,
              transform: activeFeature === i ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              display: 'block',
            }}>{f.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</div>
            {/* Bottom accent bar on hover */}
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              width: activeFeature === i ? '60%' : '0%',
              height: 3,
              background: 'var(--gradient-primary)',
              borderRadius: '3px 3px 0 0',
              transform: 'translateX(-50%)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          PROBLEM CONTEXT
      ══════════════════════════════════════════════ */}
      <div style={{ padding: '80px 60px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>The Problem We Solve</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>NER's Silent Dementia Crisis</h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.78 }}>
              The North Eastern Region has <strong>5M+ elderly</strong> across 8 states — but less than <strong>12 neurologists per state</strong> and internet connectivity below <strong>32%</strong> in rural areas.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: '🏥', stat: '<12', label: 'Neurologists per NER State', color: 'var(--accent-red)' },
              { icon: '📶', stat: '32%', label: 'Rural Internet Penetration in NER', color: 'var(--accent-amber)' },
              { icon: '👴', stat: '5M+', label: 'Elderly Persons Across NER', color: 'var(--accent-teal)' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 20, padding: '40px 28px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: item.color, lineHeight: 1, marginBottom: 10 }}>{item.stat}</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          NER STATES GRID
      ══════════════════════════════════════════════ */}
      <div style={{ padding: '80px 60px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Geographic Coverage</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>All 8 NER States. One Platform.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {NER_STATES.map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderTop: `4px solid ${s.color}`,
                borderRadius: 16, padding: '26px 20px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>{s.state}</div>
                <div style={{ fontSize: '0.73rem', color: s.color, fontWeight: 700 }}>{s.pop}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <div style={{ padding: '80px 60px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>How It Works</div>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 52 }}>Simple for Elderly. Powerful for Caregivers.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36 }}>
            {[
              { step: '01', icon: '👤', title: 'Caregiver Registers', desc: 'Set up patient profile with language, cognitive stage, and preferred reminders.' },
              { step: '02', icon: '🧠', title: 'Patient Plays Daily',  desc: 'Easy one-touch access to 12 games. AI adapts difficulty in real-time.' },
              { step: '03', icon: '📊', title: 'Track & Intervene',    desc: 'Dashboard shows trends. AI alerts detect decline before it becomes crisis.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-teal)', letterSpacing: 2, marginBottom: 14 }}>{s.step}</div>
                <div style={{ fontSize: '3.2rem', marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.68 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM CTA DARK BANNER
      ══════════════════════════════════════════════ */}
      <div style={{ padding: '80px 60px', background: 'var(--bg-sidebar)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-mesh)', opacity: 0.2, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '2.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 16, lineHeight: 1.35 }}>
            Ready to start your journey?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.98rem', marginBottom: 40, lineHeight: 1.78 }}>
            Choose your portal. Patient side is designed for the elderly — large buttons, voice guidance, and culturally familiar NER content.
          </p>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/patient" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 34px', borderRadius: 18,
              background: 'var(--gradient-primary)', color: 'white',
              textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
              boxShadow: '0 8px 24px rgba(10,126,106,0.35)',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <Gamepad2 size={22} /> {t('enterPatient')}
            </Link>
            <Link to="/caregiver" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 34px', borderRadius: 18,
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.2)',
              textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = ''; }}
            >
              <BarChart3 size={22} /> {t('enterCaregiver')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '22px 40px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: 4 }}><strong style={{ color: 'var(--accent-teal)' }}>CogniCare NER</strong> — PS 26003 · MDoNER · AI Cognitive Gaming for Elderly Dementia</div>
        <div>Made with ❤️ by <strong style={{ color: 'var(--accent-teal)' }}>Team Prakalp</strong> — Smart India Hackathon 2026 · LNCT Bhopal</div>
      </div>
    </div>
  );
}
