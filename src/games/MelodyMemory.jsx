import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { instruments, playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

export default function MelodyMemory() {
  const { addScore, language } = useApp();
  const navigate = useNavigate();
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [showStart, setShowStart] = useState(true);

  const playSequence = useCallback((seq) => {
    setIsPlaying(true);
    seq.forEach((idx, i) => {
      setTimeout(() => {
        setActiveIdx(idx);
        instruments[idx].play();
        setTimeout(() => setActiveIdx(null), 500);
        if (i === seq.length - 1) setTimeout(() => setIsPlaying(false), 600);
      }, i * 800);
    });
  }, []);

  const startGame = () => {
    setShowStart(false);
    const first = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)];
    setSequence(first);
    setPlayerSeq([]);
    setLevel(1);
    setGameOver(false);
    speak('Listen to the instruments, then repeat the sequence.', language);
    setTimeout(() => playSequence(first), 500);
  };

  const handleTap = (idx) => {
    if (isPlaying || gameOver) return;
    instruments[idx].play();
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 300);

    const newPlayerSeq = [...playerSeq, idx];
    setPlayerSeq(newPlayerSeq);

    // Check correctness
    const correctSoFar = newPlayerSeq.every((v, i) => v === sequence[i]);
    if (!correctSoFar) {
      playEncourage();
      speak('Almost! Try listening again.', language);
      setGameOver(true);
      addScore('Melody Memory', level - 1, level, level * 3000);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      playSuccess();
      const newLevel = level + 1;
      setLevel(newLevel);
      setPlayerSeq([]);
      if (newLevel > 6) {
        speak('Wonderful! You completed all levels!', language);
        setGameOver(true);
        addScore('Melody Memory', 6, 6, 6 * 3000);
      } else {
        const newSeq = [...sequence, Math.floor(Math.random() * 6)];
        setSequence(newSeq);
        setTimeout(() => playSequence(newSeq), 1000);
      }
    }
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}><ArrowLeft size={20} /></button>
        <div>
          <h2>🎵 Melody Memory</h2>
          <p>Listen to the sequence of NER instruments, then tap to repeat it.</p>
        </div>
      </div>
      <div className="page-content">
        <div className="game-play-area">
          <div className="game-score">
            <span className="score-item">🎼 Level: {level}</span>
            <span className="score-item">🔊 Notes: {sequence.length}</span>
          </div>

          {showStart ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎵</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '1.1rem' }}>
                You will hear a sequence of NER folk instruments.<br />Listen carefully, then tap to repeat the sequence.
              </p>
              <button onClick={startGame} className="btn btn-primary btn-large">
                <Volume2 size={20} /> Start Listening
              </button>
            </div>
          ) : gameOver ? (
            <div style={{ textAlign: 'center' }}>
              <div className={`feedback-box ${level > 4 ? 'success' : 'encourage'}`} style={{ fontSize: '1.3rem' }}>
                {level > 4 ? '🎉 Amazing! You reached level ' + level + '!' : '🌟 Great effort! You reached level ' + level}
              </div>
              <button onClick={startGame} className="btn btn-primary btn-large" style={{ marginTop: 16 }}>
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          ) : (
            <>
              {isPlaying && <div className="feedback-box success" style={{ marginBottom: 20 }}>🎧 Listening... Watch the instruments light up</div>}
              {!isPlaying && <div className="feedback-box encourage" style={{ marginBottom: 20 }}>🎹 Your turn! Tap the instruments in order ({playerSeq.length}/{sequence.length})</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {instruments.map((inst, idx) => (
                  <button
                    key={inst.name}
                    className="btn-game"
                    onClick={() => handleTap(idx)}
                    style={{
                      background: activeIdx === idx ? inst.color + '22' : 'var(--bg-card)',
                      borderColor: activeIdx === idx ? inst.color : 'var(--border-color)',
                      transform: activeIdx === idx ? 'scale(1.05)' : 'scale(1)',
                      textAlign: 'center',
                      padding: '24px 16px',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{inst.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{inst.name}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
