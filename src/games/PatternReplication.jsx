import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';

export default function PatternReplication() {
  const { addScore } = useApp();
  const navigate = useNavigate();
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [phase, setPhase] = useState('showing'); // showing | recalling | result
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIdx, setShowingIdx] = useState(-1);

  const gridSize = 9;
  const patternLength = level + 2;

  const generatePattern = useCallback(() => {
    const indices = [];
    while (indices.length < patternLength) {
      const r = Math.floor(Math.random() * gridSize);
      if (!indices.includes(r)) indices.push(r);
    }
    return indices;
  }, [patternLength]);

  const startLevel = useCallback(() => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setPlayerPattern([]);
    setPhase('showing');

    // Animate showing
    newPattern.forEach((idx, i) => {
      setTimeout(() => setShowingIdx(idx), i * 600);
    });
    setTimeout(() => {
      setShowingIdx(-1);
      setPhase('recalling');
    }, newPattern.length * 600 + 500);
  }, [generatePattern]);

  useEffect(() => { startLevel(); }, [level]);

  const handleCellClick = (idx) => {
    if (phase !== 'recalling') return;
    if (playerPattern.includes(idx)) return;
    const newPlayer = [...playerPattern, idx];
    setPlayerPattern(newPlayer);

    if (newPlayer.length === pattern.length) {
      const correct = pattern.every(p => newPlayer.includes(p));
      if (correct) {
        playSuccess();
        setScore(s => s + 1);
        setPhase('result');
        if (level >= 5) {
          addScore('Weaving Patterns', score + 1, 5, level * 3000);
        } else {
          setTimeout(() => setLevel(l => l + 1), 1500);
        }
      } else {
        playEncourage();
        setPhase('result');
        addScore('Weaving Patterns', score, 5, level * 3000);
      }
    }
  };

  const isPatternCell = (idx) => pattern.includes(idx);
  const isPlayerCell = (idx) => playerPattern.includes(idx);
  const isShowingCell = (idx) => showingIdx === idx || (phase === 'showing' && pattern.includes(idx) && showingIdx >= pattern.indexOf(idx));

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div><h2>🧶 Weaving Patterns</h2><p>Memorize the pattern, then replicate it from memory.</p></div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">📊 Level: {level}/5</span>
            <span className="score-item">🧩 Tiles: {patternLength}</span>
          </div>

          {phase === 'showing' && <div className="feedback-box success">👀 Memorize the highlighted pattern...</div>}
          {phase === 'recalling' && <div className="feedback-box encourage">🎯 Now tap {patternLength} cells to replicate! ({playerPattern.length}/{patternLength})</div>}
          {phase === 'result' && (
            <div className={`feedback-box ${pattern.every(p => playerPattern.includes(p)) ? 'success' : 'encourage'}`}>
              {pattern.every(p => playerPattern.includes(p))
                ? level >= 5 ? '🎉 All levels complete!' : '✅ Correct! Next level...'
                : `🌟 Good try! You matched ${playerPattern.filter(p => pattern.includes(p)).length}/${patternLength}`}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 360, margin: '24px auto' }}>
            {Array.from({ length: gridSize }).map((_, idx) => {
              const isShowing = phase === 'showing' && isPatternCell(idx);
              const isPlayer = isPlayerCell(idx);
              const isCorrectReveal = phase === 'result' && isPatternCell(idx);
              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  style={{
                    aspectRatio: '1', borderRadius: 'var(--radius-md)',
                    border: `3px solid ${isShowing ? 'var(--accent-teal)' : isPlayer ? (isPatternCell(idx) ? 'var(--accent-green)' : 'var(--accent-amber)') : isCorrectReveal ? 'var(--accent-teal)' : 'var(--border-color)'}`,
                    background: isShowing ? 'rgba(13,124,124,0.25)' : isPlayer ? (isPatternCell(idx) ? 'rgba(46,139,87,0.15)' : 'rgba(212,160,38,0.1)') : isCorrectReveal ? 'rgba(13,124,124,0.1)' : 'var(--bg-card)',
                    cursor: phase === 'recalling' ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  }}
                >
                  {isShowing && '🧶'}
                  {isPlayer && (isPatternCell(idx) ? '✅' : '❌')}
                  {isCorrectReveal && !isPlayer && '🧶'}
                </div>
              );
            })}
          </div>

          {phase === 'result' && level >= 5 && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button onClick={() => { setLevel(1); setScore(0); }} className="btn btn-primary btn-large"><RotateCcw size={20} /> Play Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
