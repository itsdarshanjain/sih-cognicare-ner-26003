import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

const PROVERBS = [
  { text: 'A river cuts through rock not because of its power, but because of its ___', answer: 'persistence', options: ['strength', 'persistence', 'speed', 'size'], origin: 'Assamese Proverb' },
  { text: 'The bamboo that bends is stronger than the oak that ___', answer: 'resists', options: ['breaks', 'resists', 'falls', 'grows'], origin: 'Naga Proverb' },
  { text: 'One who does not climb the hill cannot view the ___', answer: 'plain', options: ['sky', 'plain', 'river', 'forest'], origin: 'Khasi Proverb' },
  { text: 'A single ___ cannot hold up the roof', answer: 'pillar', options: ['hand', 'wall', 'pillar', 'beam'], origin: 'Mizo Proverb' },
  { text: 'The bird on the tree trusts its own ___, not the branch', answer: 'wings', options: ['claws', 'wings', 'eyes', 'feathers'], origin: 'Manipuri Proverb' },
  { text: 'Do not look at the ___ of the drum, but listen to its sound', answer: 'face', options: ['colour', 'face', 'shape', 'wood'], origin: 'Garo Proverb' },
];

export default function ProverbCompletion() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = idx >= PROVERBS.length;
  const proverb = PROVERBS[idx];

  const handleAnswer = (opt) => {
    const correct = opt === proverb.answer;
    if (correct) { playSuccess(); setScore(s => s + 1); }
    else playEncourage();
    setFeedback({ correct, answer: proverb.answer });
    setTimeout(() => { setFeedback(null); setIdx(i => i + 1); }, 2500);
    if (idx === PROVERBS.length - 1) addScore('Proverb Wisdom', score + (correct ? 1 : 0), PROVERBS.length, idx * 3000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>📜 Proverb Wisdom</h2><p>Complete the NER folk proverb with the missing word.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score"><span className="score-item">🎯 Score: {score}/{PROVERBS.length}</span></div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 You got {score}/{PROVERBS.length} correct!</div>
          ) : (
            <>
              <div className="card" style={{ textAlign: 'center', padding: 36, marginBottom: 24 }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.8, fontStyle: 'italic', color: 'var(--text-primary)' }}>
                  "{proverb.text}"
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: 600, marginTop: 12 }}>— {proverb.origin}</div>
              </div>
              {feedback && <div className={`feedback-box ${feedback.correct ? 'success' : 'encourage'}`}>{feedback.correct ? '✅ Correct!' : `💡 The answer is: "${feedback.answer}"`}</div>}
              {!feedback && (
                <div className="options-grid">
                  {proverb.options.map(opt => (
                    <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)} style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
