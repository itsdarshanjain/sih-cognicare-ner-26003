import { useState, useEffect } from 'react';
import { Heart, Activity, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function CaregiverBurnout({ isVisible, onClose }) {
  const [step, setStep] = useState('questions'); // 'questions' | 'resources' | 'thanks'
  const [answers, setAnswers] = useState({
    overwhelmed: 0,
    sleep: '',
    support: ''
  });

  // Reset state when opened
  useEffect(() => {
    if (isVisible) {
      setStep('questions');
      setAnswers({ overwhelmed: 0, sleep: '', support: '' });
    }
  }, [isVisible]);

  const handleSubmit = () => {
    localStorage.setItem('cogni_burnout_last_date', new Date().toISOString().split('T')[0]);
    localStorage.setItem('cogni_burnout_score', JSON.stringify(answers));
    
    // Check if burnout is high
    const isBurnedOut = answers.overwhelmed >= 4 || (answers.sleep === 'No' && answers.support === 'No');
    
    if (isBurnedOut) {
      setStep('resources');
    } else {
      setStep('thanks');
      setTimeout(() => onClose(), 3000);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '30px 40px',
        borderRadius: 24,
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}>
        
        {step === 'questions' && (
          <div style={{ animation: 'fadeInUp 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, background: 'rgba(10,126,106,0.1)', borderRadius: '50%', color: 'var(--accent-teal)' }}>
                <Heart size={28} />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>Caregiver Wellbeing Check</h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem' }}>
              Your mental health matters just as much as the patient's. Please take a moment to answer these honestly.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: 'var(--text-primary)' }}>1. How overwhelmed do you feel today?</label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1,2,3,4,5].map(num => (
                  <button key={num}
                    onClick={() => setAnswers({...answers, overwhelmed: num})}
                    style={{
                      width: 45, height: 45, borderRadius: '50%', border: '2px solid',
                      borderColor: answers.overwhelmed === num ? 'var(--accent-teal)' : 'var(--border-color)',
                      background: answers.overwhelmed === num ? 'var(--accent-teal)' : 'var(--bg-primary)',
                      color: answers.overwhelmed === num ? '#FFF' : 'var(--text-primary)',
                      fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >{num}</button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                <span>1 (Calm)</span><span>5 (Highly)</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: 'var(--text-primary)' }}>2. Are you sleeping well this week?</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Yes', 'Somewhat', 'No'].map(opt => (
                  <button key={opt}
                    onClick={() => setAnswers({...answers, sleep: opt})}
                    className={`btn ${answers.sleep === opt ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '8px 0' }}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: 'var(--text-primary)' }}>3. Do you feel emotionally supported?</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Yes', 'Somewhat', 'No'].map(opt => (
                  <button key={opt}
                    onClick={() => setAnswers({...answers, support: opt})}
                    className={`btn ${answers.support === opt ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '8px 0' }}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={!answers.overwhelmed || !answers.sleep || !answers.support}
              className="btn btn-primary" 
              style={{ width: '100%', opacity: (!answers.overwhelmed || !answers.sleep || !answers.support) ? 0.5 : 1 }}
            >
              Submit Check-In
            </button>
          </div>
        )}

        {step === 'resources' && (
          <div style={{ animation: 'fadeInUp 0.3s', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: 16, background: 'rgba(196,122,0,0.1)', borderRadius: '50%', color: 'var(--accent-amber)', marginBottom: 16 }}>
              <Activity size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 8 }}>You matter too.</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem' }}>
              It sounds like you are carrying a heavy load right now. Please consider reaching out to these free support networks for caregivers:
            </p>

            <div style={{ textAlign: 'left', background: 'var(--bg-primary)', padding: 16, borderRadius: 12, marginBottom: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><PhoneCall size={16}/> Vandrevala Foundation Helpline</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Free 24x7 psychiatric and counseling support in India.</div>
              <div style={{ color: 'var(--accent-teal)', fontWeight: 'bold', marginTop: 4 }}>Call: 1860-2662-345</div>
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-primary)', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><PhoneCall size={16}/> iCall Psychosocial Helpline</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Professional counseling by TISS.</div>
              <div style={{ color: 'var(--accent-teal)', fontWeight: 'bold', marginTop: 4 }}>Call: 9152987821</div>
            </div>

            <button onClick={() => onClose()} className="btn btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        )}

        {step === 'thanks' && (
          <div style={{ animation: 'fadeInUp 0.3s', textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={60} color="var(--accent-green)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 8 }}>Thank You</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              You're doing amazing. Your care makes a real difference. 💚
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
