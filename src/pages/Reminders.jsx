import { useState, useEffect } from 'react';
import { Check, Volume2, Clock, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speak } from '../utils/tts';
import { playSuccess } from '../utils/audio';

// Base static reminders
const BASE_REMINDERS = [
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
  custom:   { bg: 'rgba(52,152,219,0.08)', border: 'rgba(52,152,219,0.2)' },
};

export default function Reminders() {
  const { t, language } = useApp();
  const [completed, setCompleted] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('cogni_reminders_completed') || '[]')); } catch { return new Set(); }
  });
  
  const [customReminders, setCustomReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cogni_custom_reminders') || '[]'); } catch { return []; }
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState('12:00');
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  // Request Notification Permission only when needed (e.g. when adding a custom reminder)

  const allReminders = [...BASE_REMINDERS, ...customReminders].sort((a, b) => a.time.localeCompare(b.time));

  // Timer loop for time update and notifications
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      // To prevent duplicate alerts in the same minute, we check seconds
      if (now.getSeconds() === 0) {
        const activeReminder = allReminders.find(r => r.time === timeStr && !completed.has(r.id));
        if (activeReminder) {
          triggerAlert(activeReminder);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [allReminders, completed]);

  const triggerAlert = (r) => {
    const title = r.isCustom ? r.labelKey : t(r.labelKey);
    const detail = r.isCustom ? r.detailKey : t(r.detailKey);
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`CogniCare: ${title}`, {
        body: detail,
        icon: '/favicon.ico' // Assuming a favicon exists
      });
    }
    
    // Audio alert
    playSuccess();
    speak(`Reminder: ${title}. ${detail}`, language);
  };

  useEffect(() => {
    localStorage.setItem('cogni_reminders_completed', JSON.stringify([...completed]));
  }, [completed]);
  
  useEffect(() => {
    localStorage.setItem('cogni_custom_reminders', JSON.stringify(customReminders));
  }, [customReminders]);

  const toggle = (id) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else { next.add(id); playSuccess(); }
      return next;
    });
  };

  const speakReminder = (r) => {
    const label = r.isCustom ? r.labelKey : t(r.labelKey);
    const detail = r.isCustom ? r.detailKey : t(r.detailKey);
    speak(`${label}. ${detail}`, language);
  };

  const handleAddReminder = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    if (newTime && newTitle) {
      const newR = {
        id: Date.now(),
        time: newTime,
        labelKey: newTitle, // using raw text for custom
        detailKey: newDetail, // using raw text for custom
        icon: '🔔',
        category: 'custom',
        urgency: 'medium',
        isCustom: true
      };
      setCustomReminders(prev => [...prev, newR]);
      setShowAddModal(false);
      setNewTitle('');
      setNewDetail('');
      setNewTime('12:00');
    }
  };

  const progress = allReminders.length > 0 ? Math.round((completed.size / allReminders.length) * 100) : 0;
  const medicinesDone = allReminders.filter(r => r.category === 'medicine' && completed.has(r.id)).length;
  const totalMedicines = allReminders.filter(r => r.category === 'medicine').length;
  const waterDone = allReminders.filter(r => r.category === 'water' && completed.has(r.id)).length;
  const totalWater = allReminders.filter(r => r.category === 'water').length;
  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🔔 {t('reminders')}</h2>
          <p>{language === 'en'
            ? 'Your daily schedule — tap each item when completed. Caregivers are notified of missed reminders.'
            : t('gamesSubtitle')}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
          <Plus size={18} /> {t('addReminderBtn') || '+ Add Reminder'}
        </button>
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
            <div className="kpi-change">{completed.size}/{allReminders.length} ✓</div>
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

        {/* Reminder List */}
        {allReminders.map((r, i) => {
          const colors = CATEGORY_COLORS[r.category] || CATEGORY_COLORS.rest;
          const label  = r.isCustom ? r.labelKey : t(r.labelKey);
          const detail = r.isCustom ? r.detailKey : t(r.detailKey);
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

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card animate-scale" style={{ width: 400, maxWidth: '90%', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{t('addReminder') || 'Add Custom Reminder'}</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-muted)' }}>{t('timeLabel') || 'Time'}</label>
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-muted)' }}>{t('titleLabel') || 'Title'}</label>
              <input type="text" placeholder="e.g. Video Call with Son" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-muted)' }}>{t('detailLabel') || 'Details (Optional)'}</label>
              <input type="text" placeholder="e.g. Set up laptop and wait" value={newDetail} onChange={e => setNewDetail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('cancel') || 'Cancel'}</button>
              <button onClick={handleAddReminder} disabled={!newTitle || !newTime} className="btn btn-primary" style={{ flex: 1 }}>{t('saveReminder') || 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
