import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

const PAIRS = [
  { left: 'Hornbill Festival', right: 'Nagaland' },
  { left: 'Bihu Dance', right: 'Assam' },
  { left: 'Cheraw Dance', right: 'Mizoram' },
  { left: 'Majuli Island', right: 'River Island' },
  { left: 'Kangla Fort', right: 'Manipur' },
  { left: 'Root Bridges', right: 'Meghalaya' },
];

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export default function CulturalConnections() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [leftShuffle] = useState(() => shuffle(PAIRS.map(p => p.left)));
  const [rightShuffle] = useState(() => shuffle(PAIRS.map(p => p.right)));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [score, setScore] = useState(0);

  const handleLeft = (l) => { if (!matched.has(l)) setSelectedLeft(l); };
  const handleRight = (r) => {
    if (!selectedLeft || matched.has(r)) return;
    const pair = PAIRS.find(p => p.left === selectedLeft);
    if (pair && pair.right === r) {
      playSuccess();
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft); newMatched.add(r);
      setMatched(newMatched);
      setScore(s => s + 1);
      if (newMatched.size === PAIRS.length * 2) addScore('Cultural Connections', PAIRS.length, PAIRS.length, PAIRS.length * 2500);
    } else { playEncourage(); }
    setSelectedLeft(null);
  };

  const done = matched.size === PAIRS.length * 2;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>🎭 Cultural Connections</h2><p>Match each NER festival or landmark with its state.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score"><span className="score-item">🎯 Matched: {score}/{PAIRS.length}</span></div>
          {done ? (
            <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>🎉 All connections made!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Festival / Landmark</div>
                {leftShuffle.map(l => (
                  <button key={l} className={`btn-game ${matched.has(l) ? 'correct' : ''} ${selectedLeft === l ? 'selected' : ''}`}
                    onClick={() => handleLeft(l)} disabled={matched.has(l)}
                    style={{ marginBottom: 8, textAlign: 'left', opacity: matched.has(l) ? 0.5 : 1, borderColor: selectedLeft === l ? 'var(--accent-teal)' : undefined }}>
                    {l}
                  </button>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>State / Identity</div>
                {rightShuffle.map(r => (
                  <button key={r} className={`btn-game ${matched.has(r) ? 'correct' : ''}`}
                    onClick={() => handleRight(r)} disabled={matched.has(r)}
                    style={{ marginBottom: 8, textAlign: 'left', opacity: matched.has(r) ? 0.5 : 1 }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
