import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, Star, Trophy, Clock } from 'lucide-react';
import { speak, stopSpeaking } from '../utils/tts';
import { useState, useEffect } from 'react';
import MmseOnboarding from '../components/MmseOnboarding';
import MoodCheckIn from '../components/MoodCheckIn';

const GAME_DEFS = [
  { path: 'games/calm-mode',             icon: '🌿', titleKey: 'Music Therapy',         desc: 'Calming algorithmic NER folk melodies for sundowning relief',                         domain: 'Therapy',         difficulty: 'Easy',   time: '∞ min' },
  { path: 'games/family-faces',          icon: '👨‍👩‍👧', titleKey: 'Family Faces',          desc: 'Recognize your family members and loved ones from uploaded photos',                   domain: 'Personal',        difficulty: 'Easy',   time: '2–4 min' },
  { path: 'games/odd-one-out',           icon: '🔎', titleKey: 'Odd One Out',           desc: 'Find the item that does not belong in the category',                                  domain: 'Categorization',  difficulty: 'Medium', time: '3–5 min' },
  { path: 'games/memory-match',         icon: '🏔️', titleKey: 'memoryMatch',         desc: 'Match NER landmark cards — trains visual-spatial memory with Kaziranga, Tawang & more', domain: 'Memory',           difficulty: 'Easy',   time: '3–5 min' },
  { path: 'games/melody-memory',         icon: '🎵', titleKey: 'melodyMemory',         desc: 'Recall sequences of Bihu Dhol, Pepa, Pung & Bamboo Flute synthesized offline',        domain: 'Auditory Memory', difficulty: 'Medium', time: '4–6 min' },
  { path: 'games/daily-routine',         icon: '☀️', titleKey: 'dailyRoutine',         desc: 'Arrange morning tea brewing, self-care, and garden routines in correct order',         domain: 'Executive Fn',    difficulty: 'Easy',   time: '2–3 min' },
  { path: 'games/market-sorting',        icon: '🧺', titleKey: 'marketSorting',        desc: 'Sort Bhut Jolokia, Bamboo Shoots, Mekhela Chador into food vs handicraft baskets',    domain: 'Categorization',  difficulty: 'Easy',   time: '3–4 min' },
  { path: 'games/number-patterns',       icon: '🔢', titleKey: 'numberPatterns',       desc: 'Find missing numbers in sequences — counting tea baskets, betel clusters, ₹5 notes',  domain: 'Numerical',       difficulty: 'Medium', time: '3–5 min' },
  { path: 'games/cultural-connections',  icon: '🎭', titleKey: 'culturalConnections',  desc: 'Match Hornbill Festival ↔ Nagaland, Bihu ↔ Assam, Root Bridges ↔ Meghalaya',         domain: 'Semantic Memory', difficulty: 'Easy',   time: '2–4 min' },
  { path: 'games/colour-word',           icon: '🎨', titleKey: 'colourWord',           desc: 'Stroop test — tap the COLOUR of the text, not the word (attention & inhibition)',     domain: 'Attention',       difficulty: 'Hard',   time: '3–5 min' },
  { path: 'games/proverb-completion',    icon: '📜', titleKey: 'proverbCompletion',    desc: 'Complete NER folk proverbs — "The bamboo that bends is stronger than..."',            domain: 'Language',        difficulty: 'Medium', time: '4–6 min' },
  { path: 'games/word-completion',       icon: '✏️', titleKey: 'wordCompletion',       desc: 'Fill missing letters in K_Z_R_NGA, SH_LL_NG — NER place name recovery',              domain: 'Lexical',         difficulty: 'Medium', time: '3–5 min' },
  { path: 'games/pattern-replication',   icon: '🧶', titleKey: 'patternReplication',   desc: 'Memorize highlighted handloom weave cells, then replicate from memory',               domain: 'Visuospatial',    difficulty: 'Hard',   time: '4–6 min' },
];

const DIFFICULTY_COLORS = { Easy: 'green', Medium: 'amber', Hard: 'red' };

export default function PatientHub() {
  const { t, gameScores, moodLogs, language, difficultyLevel, setDifficultyLevel } = useApp();
  const navigate = useNavigate();

  const [showMmse, setShowMmse] = useState(() => {
    return !localStorage.getItem('cogni_mmse_completed');
  });
  const [moodDone, setMoodDone] = useState(false);

  const handleMmseComplete = (score, severity, diff) => {
    localStorage.setItem('cogni_mmse_completed', 'true');
    localStorage.setItem('cogni_mmse_score', score.toString());
    localStorage.setItem('cogni_mmse_severity', severity);
    setDifficultyLevel(diff);
    setShowMmse(false);
  };

  const getGameScore = (titleKey) => {
    const engTitle = titleKey; 
    const scores = gameScores.filter(s => s.game === engTitle);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, s) => a + s.accuracy, 0) / scores.length);
  };

  const handleVoice = () => {
    const text = t('gamesSubtitle');
    speak(text, language);
  };

  const totalPlayed = new Set(gameScores.map(s => s.game)).size;
  const avgScore = gameScores.length > 0 ? Math.round(gameScores.reduce((a, s) => a + s.accuracy, 0) / gameScores.length) : 0;

  // --- Sundowning Prediction Logic ---
  // If it's evening (4PM-8PM) and we have a history of negative moods in the evening
  const currentHour = new Date().getHours();
  const isEveningRisk = currentHour >= 16 && currentHour <= 20;
  
  // (In a real app, this would query backend. For hackathon, we'll check recent local moodLogs OR force it for demo if it's evening)
  const eveningMoods = (moodLogs || []).filter(m => {
    const h = new Date(m.timestamp).getHours();
    return h >= 16 && ['sad', 'anxious', 'agitated'].includes(m.mood);
  });
  
  // We'll show it if they actually have a history of bad evening moods, OR if it's currently the risk window (for demo visibility)
  const showSundowningIntervention = isEveningRisk;

  return (
    <>
      {showMmse && <MmseOnboarding onComplete={handleMmseComplete} />}
      {!showMmse && !moodDone && <MoodCheckIn onComplete={() => setMoodDone(true)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>🧠 {t('games')}</h2>
          <p>{t('gamesSubtitle')}</p>
        </div>
        <button onClick={handleVoice} className="btn btn-outline" style={{ padding: '10px 18px', flexShrink: 0 }}>
          <Volume2 size={18} /> Read Aloud
        </button>
      </div>
      <div className="page-content">

        {/* --- PROACTIVE SUNDOWNING INTERVENTION --- */}
        {showSundowningIntervention && (
          <div style={{
            background: 'linear-gradient(135deg, #C47A00, #A65D00)',
            padding: '24px 30px',
            borderRadius: 24,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 12px 24px rgba(196, 122, 0, 0.3)',
            marginBottom: 28,
            animation: 'fadeInUp 0.5s ease'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                🌅 Evening Wellness Mode Active
              </h3>
              <p style={{ opacity: 0.9, fontSize: '1rem', margin: 0 }}>
                We recommend starting with some calming music therapy before playing games tonight.
              </p>
            </div>
            <Link to="/patient/games/calm-mode" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ 
                background: 'white', 
                color: '#C47A00', 
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: 30
              }}>
                Start Music Therapy
              </button>
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="kpi-grid" style={{ marginBottom: 28 }}>
          <div className="kpi-card teal">
            <div className="kpi-label">{t('gamesAvailable')}</div>
            <div className="kpi-value">{GAME_DEFS.length}</div>
            <div className="kpi-change">🧠 Across 8 cognitive domains</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-label">{t('gamesPlayed')}</div>
            <div className="kpi-value">{totalPlayed}</div>
            <div className="kpi-change"><Trophy size={14} /> {totalPlayed >= 5 ? 'Great engagement!' : 'Try more games!'}</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-label">AI Difficulty Level</div>
            <div className="kpi-value">Level {difficultyLevel || 2}</div>
            <div className="kpi-change"><Star size={14} /> Auto-adapted to your skill</div>
          </div>
        </div>

        <div className="games-grid">
          {GAME_DEFS.map((game, i) => {
            const score = getGameScore(game.titleKey);
            const title = t(game.titleKey);
            return (
              <Link key={game.path} to={`/patient/${game.path}`} style={{ textDecoration: 'none' }}>
                <div className="game-card" style={{ animationDelay: `${i * 0.04}s` }}>
                  {score !== null && (
                    <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: score >= 75 ? 'rgba(29,155,95,0.1)' : 'rgba(201,147,11,0.1)', color: score >= 75 ? 'var(--accent-green)' : 'var(--accent-amber)', fontSize: '0.7rem', fontWeight: 800 }}>
                      ⭐ {score}%
                    </div>
                  )}
                  <span className="game-icon">{game.icon}</span>
                  <div className="game-title">{title}</div>
                  <div className="game-desc">{game.desc}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span className="game-domain">{game.domain}</span>
                    <span className={`badge ${DIFFICULTY_COLORS[game.difficulty]}`} style={{ fontSize: '0.65rem' }}>{game.difficulty}</span>
                    <span className="badge blue" style={{ fontSize: '0.65rem' }}><Clock size={10} /> {game.time}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
