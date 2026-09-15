import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function MoodCheckIn({ onComplete }) {
  const { t, addMoodLog } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we already logged mood today
    const lastMoodDate = localStorage.getItem('cogni_last_mood_date');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastMoodDate !== today) {
      setIsVisible(true);
    } else {
      onComplete(); // Already checked in today
    }
  }, [onComplete]);

  const handleMoodSelect = (mood) => {
    addMoodLog(mood);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('cogni_last_mood_date', today);
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const moods = [
    { key: 'happy', emoji: '😄', label: 'Happy' },
    { key: 'neutral', emoji: '😐', label: 'Okay' },
    { key: 'sad', emoji: '😢', label: 'Sad' },
    { key: 'anxious', emoji: '😰', label: 'Anxious' },
    { key: 'agitated', emoji: '😠', label: 'Agitated' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '40px 30px',
        borderRadius: 24,
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: 12 }}>
          {t('howAreYouFeeling') || 'How are you feeling today?'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 30 }}>
          {t('moodCheckInDesc') || 'Before we start playing, let us know your mood.'}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => handleMoodSelect(m.key)}
              style={{
                background: 'var(--bg-primary)',
                border: '2px solid var(--accent-teal-light)',
                borderRadius: 16,
                padding: '16px 20px',
                fontSize: '2.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                minWidth: 100
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--accent-teal)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--accent-teal-light)';
              }}
            >
              {m.emoji}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t(m.key) || m.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
