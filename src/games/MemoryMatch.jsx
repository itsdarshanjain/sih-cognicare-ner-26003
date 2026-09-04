import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

const LANDMARKS = [
  { id: 'kaziranga', emoji: '🦏', name: 'Kaziranga', desc: 'Famous national park in Assam' },
  { id: 'kangchenjunga', emoji: '🏔️', name: 'Kangchenjunga', desc: 'Highest peak in Sikkim' },
  { id: 'rootbridge', emoji: '🌿', name: 'Root Bridges', desc: 'Living root bridges of Meghalaya' },
  { id: 'loktak', emoji: '🏞️', name: 'Loktak Lake', desc: 'Floating lake of Manipur' },
  { id: 'tawang', emoji: '🛕', name: 'Tawang', desc: 'Ancient monastery in Arunachal' },
  { id: 'majuli', emoji: '🏝️', name: 'Majuli Island', desc: 'World\'s largest river island in Assam' },
  { id: 'teagarden', emoji: '🍵', name: 'Tea Gardens', desc: 'Assam tea plantation heritage' },
  { id: 'bamboo', emoji: '🎋', name: 'Bamboo Hills', desc: 'Mizo highland bamboo forests' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MemoryMatch() {
  const { t, addScore, language } = useApp();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const selected = LANDMARKS.slice(0, 6);
    const pairs = [...selected, ...selected].map((item, i) => ({ ...item, uid: `${item.id}-${i}` }));
    setCards(shuffleArray(pairs));
    speak('Match the landmark cards. Find pairs of NER landmarks.', language);
  }, []);

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.has(cards[idx].id)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].id === cards[b].id) {
        const newMatched = new Set(matched);
        newMatched.add(cards[a].id);
        setMatched(newMatched);
        playSuccess();
        speak(cards[a].desc, language);
        setTimeout(() => setFlipped([]), 600);
        if (newMatched.size === 6) {
          setTimeout(() => {
            setGameComplete(true);
            addScore('Landmark Memory', 6, 6, moves * 2000);
            speak(t('gameComplete'), language);
          }, 800);
        }
      } else {
        playEncourage();
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const restart = () => {
    const selected = LANDMARKS.slice(0, 6);
    const pairs = [...selected, ...selected].map((item, i) => ({ ...item, uid: `${item.id}-${i}` }));
    setCards(shuffleArray(pairs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setGameComplete(false);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>🏔️ Landmark Memory</h2>
          <p>Find matching pairs of NER landmarks. Tap two cards to reveal them.</p>
        </div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">🎯 Matched: {matched.size}/6</span>
            <span className="score-item">🔄 Moves: {moves}</span>
          </div>

          {gameComplete ? (
            <div style={{ textAlign: 'center' }}>
              <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>
                🎉 {t('gameComplete')}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>You completed it in {moves} moves!</p>
              <button onClick={restart} className="btn btn-primary btn-large">
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          ) : (
            <div className="memory-grid size-4">
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx);
                const isMatched = matched.has(card.id);
                return (
                  <div
                    key={card.uid}
                    className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                    onClick={() => handleFlip(idx)}
                  >
                    {isFlipped || isMatched ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem' }}>{card.emoji}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: 4, color: 'var(--accent-teal)' }}>{card.name}</div>
                      </div>
                    ) : (
                      <div className="card-back">🧠</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
