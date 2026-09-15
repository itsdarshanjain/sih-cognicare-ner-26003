import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccess, playEncourage } from '../utils/audio';
import { speak } from '../utils/tts';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FamilyFaces() {
  const { t, addScore, language, difficultyLevel } = useApp();
  const navigate = useNavigate();
  
  // Setup state
  const [photos, setPhotos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cogni_family_photos') || '[]'); } catch { return []; }
  });
  const [setupMode, setSetupMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  
  // Game state
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);

  // Sync photos to localStorage
  useEffect(() => {
    localStorage.setItem('cogni_family_photos', JSON.stringify(photos));
    if (photos.length === 0) setSetupMode(true);
  }, [photos]);

  // Start game round
  useEffect(() => {
    if (!setupMode && photos.length >= 2 && currentRound < photos.length) {
      const correctPerson = photos[currentRound];
      speak(t('whoIsThis') || `Who is this?`, language);
      
      // Generate options (1 correct, rest wrong)
      // Difficulty level determines number of options (2 to 4)
      const numOptions = Math.min(photos.length, difficultyLevel >= 3 ? 4 : (difficultyLevel === 2 ? 3 : 2));
      
      const wrongOptions = shuffleArray(photos.filter(p => p.id !== correctPerson.id)).slice(0, numOptions - 1);
      const allOptions = shuffleArray([correctPerson, ...wrongOptions]);
      
      setOptions(allOptions);
      if (currentRound === 0) setStartTime(Date.now());
    } else if (!setupMode && currentRound > 0 && currentRound >= photos.length) {
      // Game over
      setGameComplete(true);
      const timeTaken = Date.now() - startTime;
      addScore('Family Faces', score, photos.length, timeTaken);
      speak(t('gameComplete'), language);
    }
  }, [currentRound, setupMode, photos]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = () => {
    if (newName && newImage) {
      setPhotos([...photos, { id: Date.now(), name: newName, image: newImage }]);
      setNewName('');
      setNewImage('');
    }
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleAnswer = (selectedId) => {
    const correctPerson = photos[currentRound];
    if (selectedId === correctPerson.id) {
      playSuccess();
      setScore(s => s + 1);
      speak(`${t('yesThatIs') || 'Yes, that is'} ${correctPerson.name}`, language);
    } else {
      playEncourage();
      speak(`${t('notQuiteThisIs') || 'Not quite, this is'} ${correctPerson.name}`, language);
    }
    
    setTimeout(() => {
      setCurrentRound(r => r + 1);
    }, 1500);
  };

  const restart = () => {
    setScore(0);
    setCurrentRound(0);
    setGameComplete(false);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2>👨‍👩‍👧 {t('familyFaces')}</h2>
            <p>{t('familyFacesDesc') || 'Personal memory training with your loved ones.'}</p>
          </div>
        </div>
        <button onClick={() => setSetupMode(!setupMode)} className={`btn ${setupMode ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '8px 16px' }}>
          {setupMode ? 'Play Game' : 'Manage Photos'}
        </button>
      </div>
      
      <div className="page-content">
        {setupMode ? (
          // SETUP MODE (CAREGIVER)
          <div className="game-play-area" style={{ textAlign: 'left', maxWidth: 800, margin: '0 auto' }}>
            <div className="feedback-box info" style={{ marginBottom: 24, fontSize: '0.9rem' }}>
              <strong>Caregiver Setup:</strong> Upload at least 2 clear photos of family members or friends. This creates a deeply personal and emotionally resonant memory exercise.
            </div>
            
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', background: 'var(--bg-primary)', padding: 24, borderRadius: 16 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Add New Person</h3>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Person's Name</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Ramesh (Son)" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Upload Photo</label>
                  <div style={{ position: 'relative', height: 120, border: '2px dashed var(--accent-teal-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {newImage ? <img src={newImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload color="var(--accent-teal)" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                </div>
                <button onClick={addPhoto} disabled={!newName || !newImage} className="btn btn-primary" style={{ width: '100%' }}>Add to Gallery</button>
              </div>
              
              <div style={{ flex: '2 1 400px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Saved Faces ({photos.length})</h3>
                {photos.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#888', background: 'var(--bg-primary)', borderRadius: 16 }}>
                    <ImageIcon size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                    <p>No photos added yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                    {photos.map(p => (
                      <div key={p.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                        <div style={{ padding: 8, fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>{p.name}</div>
                        <button onClick={() => removePhoto(p.id)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {photos.length >= 2 && (
              <div style={{ marginTop: 30, textAlign: 'center' }}>
                <button onClick={() => setSetupMode(false)} className="btn btn-primary btn-large">Start Playing Game</button>
              </div>
            )}
          </div>
        ) : (
          // GAMEPLAY MODE (PATIENT)
          <div className="game-play-area">
            {photos.length < 2 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <h3>Caregiver Setup Required</h3>
                <p>Please add at least 2 photos to play this game.</p>
                <button onClick={() => setSetupMode(true)} className="btn btn-primary" style={{ marginTop: 16 }}>Go to Setup</button>
              </div>
            ) : gameComplete ? (
              <div style={{ textAlign: 'center' }}>
                <div className="feedback-box success" style={{ fontSize: '1.3rem' }}>
                  🎉 {t('gameComplete')}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>You got {score} out of {photos.length} correct!</p>
                <button onClick={restart} className="btn btn-primary btn-large">
                  <RotateCcw size={20} /> Play Again
                </button>
              </div>
            ) : currentRound < photos.length ? (
              <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <div className="game-score" style={{ marginBottom: 20 }}>
                  <span className="score-item">Question {currentRound + 1} of {photos.length}</span>
                  <span className="score-item">Score: {score}</span>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', marginBottom: 24, color: 'var(--accent-teal)' }}>Who is this?</h3>
                
                <div style={{ width: 280, height: 280, margin: '0 auto 30px', borderRadius: '50%', overflow: 'hidden', border: '6px solid var(--accent-teal-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img src={photos[currentRound].image} alt="Who is this?" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: options.length > 2 ? '1fr 1fr' : '1fr', gap: 16 }}>
                  {options.map(opt => (
                    <button 
                      key={opt.id} 
                      onClick={() => handleAnswer(opt.id)}
                      style={{ 
                        padding: '18px', 
                        fontSize: '1.2rem', 
                        fontWeight: 700, 
                        borderRadius: 16, 
                        border: '2px solid var(--accent-teal-light)', 
                        background: '#fff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: 'var(--text-primary)'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--accent-teal-light)'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
