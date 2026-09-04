import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

const ITEMS = [
  { name: 'Bamboo Shoots (Khorisa)', emoji: '🎋', category: 'food' },
  { name: 'Japi Hat', emoji: '👒', category: 'craft' },
  { name: 'Bhut Jolokia', emoji: '🌶️', category: 'food' },
  { name: 'Mekhela Chador', emoji: '👘', category: 'craft' },
  { name: 'Black Rice (Chak-Hao)', emoji: '🍚', category: 'food' },
  { name: 'Mizo Puan', emoji: '🧣', category: 'craft' },
  { name: 'Assam Tea Leaves', emoji: '🍵', category: 'food' },
  { name: 'Naga Shawl', emoji: '🧥', category: 'craft' },
];

export default function MarketSorting() {
  const { addScore, language } = useApp();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const item = ITEMS[currentIdx];
  const done = currentIdx >= ITEMS.length;

  const handleSort = (category) => {
    const correct = item.category === category;
    if (correct) { playSuccess(); setScore(s => s + 1); setFeedback('correct'); }
    else { playEncourage(); setFeedback('wrong'); speak('This goes in the other basket.', language); }
    setTimeout(() => { setFeedback(null); setCurrentIdx(i => i + 1); }, 1200);
    if (currentIdx === ITEMS.length - 1) addScore('Bazaar Sorting', score + (correct ? 1 : 0), ITEMS.length, currentIdx * 2000);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>🧺 Bazaar Sorting</h2><p>Sort NER market goods into the correct category baskets.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">🎯 Score: {score}/{ITEMS.length}</span>
            <span className="score-item">📦 Item: {currentIdx + 1}/{ITEMS.length}</span>
          </div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 All sorted! You got {score}/{ITEMS.length} correct!</div>
          ) : (
            <>
              <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
                <div style={{ fontSize: '4rem', marginBottom: 12 }}>{item.emoji}</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: 700 }}>{item.name}</div>
              </div>
              {feedback && <div className={`feedback-box ${feedback === 'correct' ? 'success' : 'encourage'}`}>{feedback === 'correct' ? '✅ Correct!' : '🔄 Try the other basket'}</div>}
              <div className="options-grid">
                <button className="option-btn" onClick={() => handleSort('food')} style={{ borderColor: '#2E8B57', fontSize: '1.2rem' }}>
                  🥬 Food & Crops
                </button>
                <button className="option-btn" onClick={() => handleSort('craft')} style={{ borderColor: '#D4A026', fontSize: '1.2rem' }}>
                  🧶 Handicrafts & Textiles
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
