import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

const WORDS = [
  { word: 'KAZIRANGA', masked: 'K _ Z _ R _ N G A', hint: 'Famous national park in Assam — home of the one-horned rhino' },
  { word: 'SHILLONG', masked: 'S H _ L L _ N G', hint: 'Capital city of Meghalaya — Scotland of the East' },
  { word: 'MANIPUR', masked: 'M _ N _ P U R', hint: 'NER state — birthplace of Polo (Sagol Kangjei)' },
  { word: 'BRAHMAPUTRA', masked: 'B R _ H M _ P U T R A', hint: 'Mighty river flowing through Assam' },
  { word: 'KOHIMA', masked: 'K _ H _ M A', hint: 'Capital of Nagaland — WWII Battle site' },
  { word: 'GANGTOK', masked: 'G _ N G T _ K', hint: 'Capital of Sikkim — gateway to Kangchenjunga' },
];

export default function WordCompletion() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const done = idx >= WORDS.length;
  const word = WORDS[idx];

  const handleSubmit = () => {
    const correct = input.toUpperCase().trim() === word.word;
    if (correct) { playSuccess(); setScore(s => s + 1); }
    else playEncourage();
    setFeedback({ correct, answer: word.word });
    setTimeout(() => { setFeedback(null); setInput(''); setIdx(i => i + 1); }, 2500);
    if (idx === WORDS.length - 1) addScore('Word Recall', score + (correct ? 1 : 0), WORDS.length, idx * 4000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>✏️ Word Recall</h2><p>Type the complete NER place name using the hints provided.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score"><span className="score-item">🎯 Score: {score}/{WORDS.length}</span></div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 You recalled {score}/{WORDS.length} words!</div>
          ) : (
            <>
              <div className="card" style={{ textAlign: 'center', padding: 36, marginBottom: 24 }}>
                <div style={{ fontFamily: 'monospace', fontSize: '2.2rem', fontWeight: 800, letterSpacing: 6, color: 'var(--accent-teal)', marginBottom: 16 }}>{word.masked}</div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>💡 {word.hint}</div>
              </div>
              {feedback && <div className={`feedback-box ${feedback.correct ? 'success' : 'encourage'}`}>{feedback.correct ? '✅ Correct!' : `💡 The answer is: ${feedback.answer}`}</div>}
              {!feedback && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())}
                    placeholder="Type the word..." className="form-select" style={{ flex: 1, fontSize: '1.1rem', fontWeight: 700, letterSpacing: 2 }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button onClick={handleSubmit} className="btn btn-primary" style={{ minWidth: 120 }}>Submit</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
