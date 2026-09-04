import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

const ROUTINES = [
  {
    title: 'Brewing Morning Tea (Assam Style)',
    steps: [
      { id: 1, text: '🔥 Boil water in the kettle', order: 1 },
      { id: 2, text: '🍃 Add CTC tea leaves', order: 2 },
      { id: 3, text: '🥛 Add warm milk and crushed ginger', order: 3 },
      { id: 4, text: '☕ Strain into cups and serve', order: 4 },
    ]
  },
  {
    title: 'Morning Self-Care Routine',
    steps: [
      { id: 1, text: '🌅 Wake up at dawn', order: 1 },
      { id: 2, text: '🪥 Brush teeth and wash face', order: 2 },
      { id: 3, text: '💊 Take morning medicine', order: 3 },
      { id: 4, text: '🍛 Eat a wholesome breakfast', order: 4 },
    ]
  },
  {
    title: 'Kitchen Garden Care',
    steps: [
      { id: 1, text: '👟 Put on garden sandals', order: 1 },
      { id: 2, text: '🌱 Check vegetable patches', order: 2 },
      { id: 3, text: '💧 Water the herbs', order: 3 },
      { id: 4, text: '🧼 Wash hands thoroughly', order: 4 },
    ]
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}

export default function DailyRoutine() {
  const { addScore, language } = useApp();
  const navigate = useNavigate();
  const [routineIdx, setRoutineIdx] = useState(0);
  const [shuffled, setShuffled] = useState(() => shuffle(ROUTINES[0].steps));
  const [placed, setPlaced] = useState([]);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);

  const routine = ROUTINES[routineIdx];

  const handlePlace = (step) => {
    if (placed.find(p => p.id === step.id)) return;
    const position = placed.length + 1;
    const isCorrect = step.order === position;
    const newPlaced = [...placed, { ...step, placedAt: position, isCorrect }];
    setPlaced(newPlaced);

    if (isCorrect) {
      playSuccess();
      speak(step.text, language);
    } else {
      playEncourage();
    }

    if (newPlaced.length === 4) {
      const correct = newPlaced.filter(p => p.isCorrect).length;
      setScore(s => s + correct);
      setComplete(true);
      if (correct === 4) speak('Perfect! You got the correct order!', language);
      else speak('Good try! Let\'s see the correct order.', language);
    }
  };

  const nextRoutine = () => {
    const next = (routineIdx + 1) % ROUTINES.length;
    setRoutineIdx(next);
    setShuffled(shuffle(ROUTINES[next].steps));
    setPlaced([]);
    setComplete(false);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div>
          <h2>☀️ Daily Routine</h2>
          <p>Arrange the daily activities in the correct order. Tap each step in sequence.</p>
        </div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">📋 {routine.title}</span>
            <span className="score-item">✅ {placed.length}/4 placed</span>
          </div>

          {complete ? (
            <div style={{ textAlign: 'center' }}>
              <div className={`feedback-box ${placed.every(p => p.isCorrect) ? 'success' : 'encourage'}`}>
                {placed.every(p => p.isCorrect) ? '🎉 Perfect order!' : `🌟 You got ${placed.filter(p => p.isCorrect).length}/4 correct!`}
              </div>
              <div className="sequence-cards" style={{ marginTop: 16 }}>
                {routine.steps.map((step, i) => (
                  <div key={step.id} className="sequence-card placed">
                    <div className="sequence-number">{i + 1}</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{step.text}</div>
                  </div>
                ))}
              </div>
              <button onClick={nextRoutine} className="btn btn-primary btn-large" style={{ marginTop: 16 }}>
                Next Routine →
              </button>
            </div>
          ) : (
            <>
              {/* Placed area */}
              <div style={{ marginBottom: 20, padding: 20, background: 'var(--bg-accent)', borderRadius: 'var(--radius-lg)', minHeight: 80 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Your Order:</div>
                {placed.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Tap the steps below in order...</div>}
                {placed.map((step, i) => (
                  <div key={step.id} className="sequence-card" style={{ background: step.isCorrect ? 'rgba(46,139,87,0.06)' : 'rgba(212,160,38,0.06)', borderColor: step.isCorrect ? 'var(--accent-green)' : 'var(--accent-amber)', marginBottom: 8 }}>
                    <div className="sequence-number">{i + 1}</div>
                    <div style={{ fontWeight: 600 }}>{step.text}</div>
                  </div>
                ))}
              </div>

              {/* Available steps */}
              <div className="sequence-cards">
                {shuffled.filter(s => !placed.find(p => p.id === s.id)).map(step => (
                  <div key={step.id} className="sequence-card" onClick={() => handlePlace(step)} style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.5rem' }}>{step.text.split(' ')[0]}</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{step.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
