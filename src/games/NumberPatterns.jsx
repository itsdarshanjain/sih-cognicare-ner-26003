import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

const PUZZLES = [
  { seq: [2, 4, 6, '?', 10], answer: 8, options: [7, 8, 9], hint: 'Each step adds 2 (counting pairs of handloom threads)' },
  { seq: [5, 10, 15, '?', 25], answer: 20, options: [18, 20, 22], hint: 'Each step adds 5 (counting ₹5 notes at the bazaar)' },
  { seq: [3, 6, 9, '?', 15], answer: 12, options: [10, 11, 12], hint: 'Each step adds 3 (counting betel leaf clusters)' },
  { seq: [10, 20, 30, '?', 50], answer: 40, options: [35, 40, 45], hint: 'Each step adds 10 (counting tea baskets)' },
  { seq: [1, 1, 2, 3, '?'], answer: 5, options: [4, 5, 6], hint: 'Add the last two numbers (Fibonacci — nature\'s pattern)' },
];

export default function NumberPatterns() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = idx >= PUZZLES.length;
  const puzzle = PUZZLES[idx];

  const handleAnswer = (val) => {
    const correct = val === puzzle.answer;
    if (correct) { playSuccess(); setScore(s => s + 1); }
    else playEncourage();
    setFeedback({ correct, hint: puzzle.hint });
    setTimeout(() => { setFeedback(null); setIdx(i => i + 1); }, 2000);
    if (idx === PUZZLES.length - 1) addScore('Number Patterns', score + (correct ? 1 : 0), PUZZLES.length, idx * 3000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>🔢 Number Patterns</h2><p>Find the missing number in each sequence.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">🎯 Score: {score}/{PUZZLES.length}</span>
            <span className="score-item">📝 Puzzle: {idx + 1}/{PUZZLES.length}</span>
          </div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 You got {score}/{PUZZLES.length} correct!</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                {puzzle.seq.map((n, i) => (
                  <div key={i} style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: n === '?' ? '2rem' : '1.5rem', fontWeight: 800, borderRadius: 'var(--radius-md)', border: n === '?' ? '3px dashed var(--accent-teal)' : '2px solid var(--border-color)', background: n === '?' ? 'rgba(13,124,124,0.08)' : 'var(--bg-card)', color: n === '?' ? 'var(--accent-teal)' : 'var(--text-primary)' }}>
                    {n}
                  </div>
                ))}
              </div>
              {feedback && <div className={`feedback-box ${feedback.correct ? 'success' : 'encourage'}`}>{feedback.correct ? '✅ Correct!' : '💡 ' + feedback.hint}</div>}
              {!feedback && (
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {puzzle.options.map(opt => (
                    <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)} style={{ fontSize: '1.3rem', fontWeight: 800 }}>{opt}</button>
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
