import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, Star, Trophy, Clock } from 'lucide-react';
import { speak, stopSpeaking } from '../utils/tts';

const GAME_DEFS = [
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
  const { t, gameScores, language } = useApp();

  const getGameScore = (titleKey) => {
    // Match by translated title (scores stored under English name)
    const engTitle = titleKey; // We store scores by game path key
    const scores = gameScores.filter(s => s.game === engTitle);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, s) => a + s.accuracy, 0) / scores.length);
  };

  const handleVoice = () => {
    speak(t('welcome') + '. ' + t('gamesSubtitle'), language);
  };

  const totalPlayed = new Set(gameScores.map(s => s.game)).size;
  const avgScore = gameScores.length > 0 ? Math.round(gameScores.reduce((a, s) => a + s.accuracy, 0) / gameScores.length) : 0;

  return (
    <>
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
            <div className="kpi-label">{t('overallAccuracy')}</div>
            <div className="kpi-value">{avgScore > 0 ? `${avgScore}%` : '—'}</div>
            <div className="kpi-change"><Star size={14} /> {avgScore >= 75 ? t('correct') : avgScore > 0 ? t('tryAgain') : '—'}</div>
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
