import { useState } from 'react';
import { AlertCircle, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EmergencySOS() {
  const { t } = useApp();
  const [activated, setActivated] = useState(false);

  const handleSOS = () => {
    setActivated(true);
    
    // Attempt to vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 500]);
    }
    
    // Play a loud alert sound using Web Audio API
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.6);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.9);
      
      gain.gain.value = 0.5; // reasonably loud
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error("Audio API not supported", e);
    }

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      setActivated(false);
    }, 15000);
  };

  const triggerSMSFallback = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          window.open(`sms:+919876543210?body=EMERGENCY: Patient needs help. Location: https://maps.google.com/?q=${lat},${lon}`);
        },
        () => {
          window.open(`sms:+919876543210?body=EMERGENCY: Patient needs help.`);
        }
      );
    } else {
      window.open(`sms:+919876543210?body=EMERGENCY: Patient needs help.`);
    }
  };

  return (
    <>
      <button 
        className="sos-btn"
        onClick={handleSOS}
        title="Emergency Help"
      >
        <HeartPulse size={28} />
      </button>

      {/* Full Screen Overlay when Activated */}
      {activated && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(229, 57, 53, 0.95)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          animation: 'pulse-bg 1s infinite alternate'
        }}>
          <style>
            {`
              @keyframes pulse-bg {
                0% { background: rgba(229, 57, 53, 0.95); }
                100% { background: rgba(198, 40, 40, 0.95); }
              }
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
              }
            `}
          </style>
          
          <div style={{ animation: 'shake 0.5s infinite', marginBottom: 20 }}>
            <AlertCircle size={80} color="white" />
          </div>
          
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', textAlign: 'center' }}>
            {t('helpIsComing') || 'Help is on the way!'}
          </h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, textAlign: 'center', maxWidth: 500 }}>
            {t('notifyingCaregiver') || 'Notifying Caregiver...'}
          </p>
          
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <button 
              onClick={() => setActivated(false)}
              style={{
                padding: '16px 32px',
                borderRadius: 30,
                border: '2px solid white',
                background: 'transparent',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {t('cancel') || 'Cancel Alert'}
            </button>
            <button 
              onClick={triggerSMSFallback}
              style={{
                padding: '16px 32px',
                borderRadius: 30,
                border: 'none',
                background: 'white',
                color: 'var(--accent-red, #E53935)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              Send SMS SOS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
