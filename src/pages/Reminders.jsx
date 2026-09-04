import { useState, useEffect } from 'react';
import { Check, Volume2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speak } from '../utils/tts';
import { playSuccess } from '../utils/audio';

// Reminders defined using translation keys — all text renders in selected language
const REMINDER_DEFS = [
  { id: 1,  time: '07:00', labelKey: 'morningMedicine',  detailKey: 'morningMedicineDetail',  icon: '💊', category: 'medicine',  urgency: 'high'   },
  { id: 2,  time: '08:00', labelKey: 'drinkWater',       detailKey: 'drinkWaterDetail',        icon: '💧', category: 'water',    urgency: 'medium' },
  { id: 3,  time: '09:00', labelKey: 'morningWalk',      detailKey: 'morningWalkDetail',       icon: '🚶', category: 'exercise', urgency: 'low'    },
  { id: 4,  time: '10:00', labelKey: 'brainGames',       detailKey: 'brainGamesDetail',        icon: '🧠', category: 'game',     urgency: 'high'   },
  { id: 5,  time: '11:00', labelKey: 'drinkWater',       detailKey: 'drinkWaterDetail',        icon: '💧', category: 'water',    urgency: 'medium' },
  { id: 6,  time: '12:30', labelKey: 'lunchMedicine',    detailKey: 'lunchMedicineDetail',     icon: '💊', category: 'medicine', urgency: 'high'   },
  { id: 7,  time: '14:00', labelKey: 'afternoonRest',    detailKey: 'afternoonRestDetail',     icon: '😴', category: 'rest',     urgency: 'low'    },
  { id: 8,  time: '15:00', labelKey: 'teaSnack',         detailKey: 'teaSnackDetail',          icon: '🍵', category: 'food',     urgency: 'low'    },
  { id: 9,  time: '16:00', labelKey: 'drinkWater',       detailKey: 'drinkWaterDetail',        icon: '💧', category: 'water',    urgency: 'medium' },
  { id: 10, time: '17:00', labelKey: 'eveningWalk',      detailKey: 'eveningWalkDetail',       icon: '🌅', category: 'exercise', urgency: 'low'    },
  { id: 11, time: '18:00', labelKey: 'doctorAppointment',detailKey: 'doctorAppointmentDetail', icon: '🩺', category: 'medicine', urgency: 'high'   },
  { id: 12, time: '19:00', labelKey: 'eveningMedicine',  detailKey: 'eveningMedicineDetail',   icon: '💊', category: 'medicine', urgency: 'high'   },
  { id: 13, time: '20:00', labelKey: 'drinkWater',       detailKey: 'drinkWaterDetail',        icon: '💧', category: 'water',    urgency: 'medium' },
  { id: 14, time: '21:00', labelKey: 'musicTherapy',     detailKey: 'musicTherapyDetail',      icon: '🎵', category: 'therapy',  urgency: 'low'    },
  { id: 15, time: '21:30', labelKey: 'sleepPrep',        detailKey: 'sleepPrepDetail',         icon: '🌙', category: 'sleep',    urgency: 'low'    },
];

const CATEGORY_COLORS = {
  medicine: { bg: 'rgba(192,57,43,0.08)',  border: 'rgba(192,57,43,0.2)'  },
  water:    { bg: 'rgba(41,128,185,0.08)', border: 'rgba(41,128,185,0.2)' },
  exercise: { bg: 'rgba(29,155,95,0.08)',  border: 'rgba(29,155,95,0.2)'  },
  game:     { bg: 'rgba(125,60,152,0.08)', border: 'rgba(125,60,152,0.2)' },
  food:     { bg: 'rgba(201,147,11,0.08)', border: 'rgba(201,147,11,0.2)' },
  rest:     { bg: 'rgba(10,126,106,0.08)', border: 'rgba(10,126,106,0.2)' },
  therapy:  { bg: 'rgba(211,84,0,0.08)',   border: 'rgba(211,84,0,0.2)'   },
  sleep:    { bg: 'rgba(44,62,80,0.08)',   border: 'rgba(44,62,80,0.2)'   },
};

export default function Reminders() {
  const { t, language } = useApp();
  const [completed, setCompleted] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('cogni_reminders') || '[]')); } catch { return new Set(); }
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cogni_reminders', JSON.stringify([...completed]));
  }, [completed]);

  const toggle = (id) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else { next.add(id); playSuccess(); }
      return next;
    });
  };

  const speakReminder = (r) => {
    speak(`${t(r.labelKey)}. ${t(r.detailKey)}`, language);
  };

  const progress = Math.round((completed.size / REMINDER_DEFS.length) * 100);
  const medicinesDone = REMINDER_DEFS.filter(r => r.category === 'medicine' && completed.has(r.id)).length;
  const totalMedicines = REMINDER_DEFS.filter(r => r.category === 'medicine').length;
  const waterDone = REMINDER_DEFS.filter(r => r.category === 'water' && completed.has(r.id)).length;
  const totalWater = REMINDER_DEFS.filter(r => r.category === 'water').length;
  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="page-header">
        <h2>🔔 {t('reminders')}</h2>
        <p>{language === 'en'
          ? 'Your daily schedule — tap each item when completed. Caregivers are notified of missed reminders.'
          : t('gamesSubtitle')}</p>
      </div>
      <div className="page-content">
        {/* KPI Strip */}
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          <div className="kpi-card teal">
            <div className="kpi-label">{t('currentTime')}</div>
            <div className="kpi-value" style={{ fontSize: '1.6rem' }}>{timeStr}</div>
            <div className="kpi-change"><Clock size={14} /> Live</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-label">{t('overallProgress')}</div>
            <div className="kpi-value">{progress}%</div>
            <div className="kpi-change">{completed.size}/{REMINDER_DEFS.length} ✓</div>
          </div>
          <div className="kpi-card red">
            <div className="kpi-label">{t('medicinesLabel')}</div>
            <div className="kpi-value">{medicinesDone}/{totalMedicines}</div>
            <div className="kpi-change">💊 {medicinesDone === totalMedicines ? t('allTaken') : 'Pending'}</div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-label">{t('hydrationLabel')}</div>
            <div className="kpi-value">{waterDone}/{totalWater}</div>
            <div className="kpi-change">💧 {waterDone >= 3 ? t('wellHydrated') : t('drinkMoreWater')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-teal)', fontSize: '0.88rem' }}>{t('todayProgress')}</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-teal)', fontSize: '0.88rem' }}>{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Reminder List — labels and details from t() so they update on language change */}
        {REMINDER_DEFS.map((r, i) => {
          const colors = CATEGORY_COLORS[r.category] || CATEGORY_COLORS.rest;
          const label  = t(r.labelKey);
          const detail = t(r.detailKey);
          return (
            <div
              key={r.id}
              className={`reminder-card ${completed.has(r.id) ? 'done' : ''}`}
              onClick={() => toggle(r.id)}
              style={{ cursor: 'pointer', animationDelay: `${i * 0.03}s`, borderColor: completed.has(r.id) ? 'var(--accent-green)' : undefined }}
            >
              <div className="reminder-icon" style={{ background: completed.has(r.id) ? 'rgba(29,155,95,0.1)' : colors.bg, fontSize: '1.8rem' }}>
                {completed.has(r.id) ? <Check size={28} color="var(--accent-green)" /> : r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{label}</span>
                  {r.urgency === 'high' && <span className="badge red" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>!</span>}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{detail}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-teal)' }}>{r.time}</div>
                <button
                  onClick={e => { e.stopPropagation(); speakReminder(r); }}
                  className="btn btn-outline"
                  style={{ minHeight: 32, minWidth: 32, padding: 6, border: '1px solid var(--border-color)' }}
                  title="Read aloud"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
