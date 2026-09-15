import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

const CATEGORIES = {
  fruits: [
    { id: 'f1', name: 'Apple', emoji: '🍎' },
    { id: 'f2', name: 'Banana', emoji: '🍌' },
    { id: 'f3', name: 'Orange', emoji: '🍊' },
    { id: 'f4', name: 'Grapes', emoji: '🍇' },
    { id: 'f5', name: 'Mango', emoji: '🥭' },
  ],
  animals: [
    { id: 'a1', name: 'Dog', emoji: '🐕' },
    { id: 'a2', name: 'Cat', emoji: '🐈' },
    { id: 'a3', name: 'Elephant', emoji: '🐘' },
    { id: 'a4', name: 'Tiger', emoji: '🐅' },
    { id: 'a5', name: 'Rhino', emoji: '🦏' },
  ],
  vehicles: [
    { id: 'v1', name: 'Car', emoji: '🚗' },
    { id: 'v2', name: 'Bus', emoji: '🚌' },
    { id: 'v3', name: 'Train', emoji: '🚂' },
    { id: 'v4', name: 'Bicycle', emoji: '🚲' },
    { id: 'v5', name: 'Airplane', emoji: '✈️' },
  ],
  clothing: [
    { id: 'c1', name: 'Shirt', emoji: '👕' },
    { id: 'c2', name: 'Pants', emoji: '👖' },
    { id: 'c3', name: 'Dress', emoji: '👗' },
    { id: 'c4', name: 'Shoe', emoji: '👞' },
    { id: 'c5', name: 'Hat', emoji: '🎩' },
  ]
};

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function OddOneOut() {
  const { t, addScore, language, difficultyLevel } = useApp();
  const navigate = useNavigate();
  
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState([]);
  const [oddOneId, setOddOneId] = useState(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(0);
  
  const TOTAL_ROUNDS = 5;

  const generateRound = () => {
    const catKeys = Object.keys(CATEGORIES);
    // Pick a main category and an odd category
    const mainCatKey = catKeys[Math.floor(Math.random() * catKeys.length)];
    let oddCatKey = catKeys[Math.floor(Math.random() * catKeys.length)];
    while (oddCatKey === mainCatKey) {
      oddCatKey = catKeys[Math.floor(Math.random() * catKeys.length)];
    }

    const mainCatItems = shuffleArray(CATEGORIES[mainCatKey]);
    const oddCatItems = shuffleArray(CATEGORIES[oddCatKey]);

    // Number of items depends on difficulty (3 to 4)
    const totalItems = difficultyLevel >= 3 ? 4 : 3;
    
    // Select totalItems - 1 from main category, and 1 from odd category
    const selectedMain = mainCatItems.slice(0, totalItems - 1);
    const selectedOdd = oddCatItems[0];
    
    setOddOneId(selectedOdd.id);
    setOptions(shuffleArray([...selectedMain, selectedOdd]));
    
    if (currentRound === 0) {
      setStartTime(Date.now());
      speak(t('oddOneOutPrompt') || 'Find the odd one out. Which item does not belong?', language);
    }
  };

  useEffect(() => {
    if (currentRound < TOTAL_ROUNDS) {
      generateRound();
    } else if (currentRound > 0) {
      setGameComplete(true);
      const timeTaken = Date.now() - startTime;
      addScore('Odd One Out', score, TOTAL_ROUNDS, timeTaken);
      speak(t('gameComplete'), language);
    }
  }, [currentRound]);

  const handleAnswer = (id) => {
    if (id === oddOneId) {
      playSuccess();
      setScore(s => s + 1);
      speak(t('correct'), language);
    } else {
      playEncourage();
      speak(t('tryAgain'), language);
    }
    
    setTimeout(() => {
      setCurrentRound(r => r + 1);
    }, 1000);
  };

  const restart = () => {
    setScore(0);
    setCurrentRound(0);
    setGameComplete(false);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>{t('oddOneOut')}</h2>
          <p>{t('oddOneOutDesc') || 'Find the item that does not belong with the others.'}</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="game-play-area">
          {gameComplete ? (
            <div style={{ textAlign: 'center' }}>
              <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>
                🎉 {t('gameComplete')}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>You got {score} out of {TOTAL_ROUNDS} correct!</p>
              <button onClick={restart} className="btn btn-primary btn-large">
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <div className="game-score" style={{ marginBottom: 30 }}>
                <span className="score-item">Round {currentRound + 1} of {TOTAL_ROUNDS}</span>
                <span className="score-item">Score: {score}</span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: 40, color: 'var(--text-primary)' }}>
                Which one is different?
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
                {options.map(opt => (
                  <button 
                    key={opt.id} 
                    onClick={() => handleAnswer(opt.id)}
                    style={{ 
                      background: 'var(--bg-secondary)', 
                      border: '2px solid rgba(0,0,0,0.05)', 
                      borderRadius: 24, 
                      padding: '30px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = 'var(--accent-teal)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ fontSize: '3.5rem' }}>{opt.emoji}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{opt.name}</div>
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
