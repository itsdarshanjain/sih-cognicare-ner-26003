import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

const ROUNDS = [
  { word: 'RED', color: '#E74C3C', options: ['Red', 'Blue', 'Green', 'Purple'], answer: 'Red' },
  { word: 'BLUE', color: '#27AE60', options: ['Blue', 'Green', 'Yellow', 'Red'], answer: 'Green' },
  { word: 'GREEN', color: '#8E44AD', options: ['Green', 'Purple', 'Orange', 'Blue'], answer: 'Purple' },
  { word: 'YELLOW', color: '#2980B9', options: ['Yellow', 'Red', 'Blue', 'Green'], answer: 'Blue' },
  { word: 'PURPLE', color: '#E67E22', options: ['Purple', 'Orange', 'Green', 'Red'], answer: 'Orange' },
  { word: 'ORANGE', color: '#E74C3C', options: ['Orange', 'Blue', 'Red', 'Yellow'], answer: 'Red' },
  { word: 'RED', color: '#2980B9', options: ['Red', 'Blue', 'Green', 'Purple'], answer: 'Blue' },
  { word: 'GREEN', color: '#E67E22', options: ['Green', 'Purple', 'Orange', 'Red'], answer: 'Orange' },
];

const COLOR_MAP = { Red: '#E74C3C', Blue: '#2980B9', Green: '#27AE60', Purple: '#8E44AD', Yellow: '#F1C40F', Orange: '#E67E22' };

export default function ColourWord() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = idx >= ROUNDS.length;
  const round = ROUNDS[idx];

  const handleAnswer = (opt) => {
    const correct = opt === round.answer;
    if (correct) { playSuccess(); setScore(s => s + 1); }
    else playEncourage();
    setFeedback(correct);
    setTimeout(() => { setFeedback(null); setIdx(i => i + 1); }, 1200);
    if (idx === ROUNDS.length - 1) addScore('Colour & Word', score + (correct ? 1 : 0), ROUNDS.length, idx * 2000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>🎨 Colour & Word Test</h2><p>Tap the COLOUR of the text, not the word itself. Focus carefully!</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">🎯 Score: {score}/{ROUNDS.length}</span>
            <span className="score-item">📝 Round: {idx + 1}/{ROUNDS.length}</span>
          </div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 You got {score}/{ROUNDS.length} correct!</div>
          ) : (
            <>
              <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 24 }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: round.color, fontFamily: "'Lora', serif" }}>{round.word}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 12 }}>What COLOUR is this text?</div>
              </div>
              {feedback !== null && <div className={`feedback-box ${feedback ? 'success' : 'encourage'}`}>{feedback ? '✅ Correct!' : '🔄 That was the word, not the colour!'}</div>}
              {feedback === null && (
                <div className="options-grid">
                  {round.options.map(opt => (
                    <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}
                      style={{ fontSize: '1.1rem', fontWeight: 700, borderLeft: `6px solid ${COLOR_MAP[opt]}` }}>
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
