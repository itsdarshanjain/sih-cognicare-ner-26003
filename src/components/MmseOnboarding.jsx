import { useState } from 'react';
import { Brain } from 'lucide-react';

export default function MmseOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      q: "What year is it currently?",
      options: ["2024", "2025", "2026", "2027"],
      answer: "2026"
    },
    {
      q: "What season is it right now?",
      options: ["Summer", "Winter", "Monsoon", "Spring"],
      answer: "Monsoon"
    },
    {
      q: "Please remember these three words: Apple, Table, Coin.",
      type: "info",
      options: ["Okay, I will remember them"]
    },
    {
      q: "Can you count backwards from 100 by 7s? What is 100 - 7?",
      options: ["83", "93", "97", "87"],
      answer: "93"
    },
    {
      q: "What were the three words I asked you to remember?",
      options: ["Apple, Chair, Pen", "Orange, Table, Coin", "Apple, Table, Coin"],
      answer: "Apple, Table, Coin"
    }
  ];

  const handleAnswer = (option) => {
    let currentScore = score;
    if (questions[step].answer && option === questions[step].answer) {
      currentScore += 1;
      setScore(currentScore);
    }
    
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      // Calculate severity and set initial difficulty
      // Max score from these questions is 4
      const severity = currentScore >= 3 ? 'Mild' : (currentScore >= 1 ? 'Moderate' : 'Severe');
      const diff = currentScore >= 3 ? 3 : (currentScore >= 1 ? 2 : 1);
      
      onComplete(currentScore, severity, diff);
    }
  };

  const curr = questions[step];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '40px 30px', borderRadius: 24, maxWidth: 500, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ background: 'var(--accent-teal-light)', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent-teal)' }}>
            <Brain size={30} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-teal)', marginBottom: 8 }}>Welcome to CogniCare</h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Let's do a quick memory check to personalize your games.</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.02)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 20, textAlign: 'center', color: '#333' }}>{curr.q}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {curr.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(opt)}
                style={{ padding: 16, borderRadius: 12, border: '2px solid var(--accent-teal-light)', background: '#fff', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', color: '#222', fontWeight: 600 }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-teal-light)'; e.currentTarget.style.borderColor = 'var(--accent-teal)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--accent-teal-light)'; }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === step ? 'var(--accent-teal)' : 'rgba(0,0,0,0.1)' }} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => onComplete(4, 'Mild', 3)} 
            style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Skip for now (Default to Mild)
          </button>
        </div>
      </div>
    </div>
  );
}
