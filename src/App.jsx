import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Brain, Gamepad2, Bell, LayoutDashboard, Users, Activity, Heart, Globe, ChevronLeft, Palette } from 'lucide-react';
import { useApp, SUPPORTED_LANGUAGES, THEMES } from './context/AppContext';

// Pages
import Landing from './pages/Landing';
import SmritiSaathiWidget from './components/SmritiSaathiWidget';
import PatientHub from './pages/PatientHub';
import Reminders from './pages/Reminders';
import CaregiverDashboard from './pages/CaregiverDashboard';
import PatientProfiles from './pages/PatientProfiles';
import AlertsPage from './pages/AlertsPage';

// Games
import MemoryMatch from './games/MemoryMatch';
import MelodyMemory from './games/MelodyMemory';
import DailyRoutine from './games/DailyRoutine';
import MarketSorting from './games/MarketSorting';
import NumberPatterns from './games/NumberPatterns';
import CulturalConnections from './games/CulturalConnections';
import ColourWord from './games/ColourWord';
import ProverbCompletion from './games/ProverbCompletion';
import WordCompletion from './games/WordCompletion';
import PatternReplication from './games/PatternReplication';

function AppLayout({ children, portalType }) {
  const { language, setLanguage, theme, setTheme, t } = useApp();

  const patientNav = [
    { path: '/patient',            label: t('games'),     icon: <Gamepad2 size={20} /> },
    { path: '/patient/reminders',  label: t('reminders'), icon: <Bell size={20} /> },
  ];

  const caregiverNav = [
    { path: '/caregiver',           label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
    { path: '/caregiver/patients',  label: t('patients'),  icon: <Users size={20} /> },
    { path: '/caregiver/alerts',    label: t('alerts'),    icon: <Activity size={20} /> },
  ];

  const nav = portalType === 'patient' ? patientNav : caregiverNav;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Brain size={26} color="#FFFFFF" />
            </div>
            <div>
              <h1>{t('appName')}</h1>
              <span>{portalType === 'patient' ? t('patient') : t('caregiver')} Portal</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {nav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient' || item.path === '/caregiver'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Controls */}
        <div className="sidebar-footer">
          {/* Language Selector */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Globe size={13} /> {t('selectLanguage')}
            </label>
            <select
              className="form-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.85rem', padding: '10px 12px', minHeight: '44px', cursor: 'pointer' }}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} style={{ color: '#000', background: '#fff' }}>
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Palette size={13} /> {t('selectTheme')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {Object.entries(THEMES).map(([key, th]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  style={{
                    padding: '7px 6px',
                    borderRadius: 8,
                    border: theme === key ? '2px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.12)',
                    background: theme === key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                  title={th.name}
                >
                  <span>{th.emoji}</span>
                  <span style={{ opacity: 0.85, fontSize: '0.65rem' }}>{th.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Portal */}
          <NavLink to="/" className="nav-item" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
            <ChevronLeft size={16} /> {t('switchPortal')}
          </NavLink>
        </div>
      </aside>

      <div className="main-content">
        {children}
        <SmritiSaathiWidget />
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-brand"><Heart size={14} /> {t('appName')}</div>
            <div className="footer-credit">Made with ❤️ by <strong>Team Prakalp</strong> — SIH 2026</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function PatientLayout() {
  return (
    <AppLayout portalType="patient">
      <Routes>
        <Route index element={<PatientHub />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="games/memory-match" element={<MemoryMatch />} />
        <Route path="games/melody-memory" element={<MelodyMemory />} />
        <Route path="games/daily-routine" element={<DailyRoutine />} />
        <Route path="games/market-sorting" element={<MarketSorting />} />
        <Route path="games/number-patterns" element={<NumberPatterns />} />
        <Route path="games/cultural-connections" element={<CulturalConnections />} />
        <Route path="games/colour-word" element={<ColourWord />} />
        <Route path="games/proverb-completion" element={<ProverbCompletion />} />
        <Route path="games/word-completion" element={<WordCompletion />} />
        <Route path="games/pattern-replication" element={<PatternReplication />} />
      </Routes>
    </AppLayout>
  );
}

function CaregiverLayout() {
  return (
    <AppLayout portalType="caregiver">
      <Routes>
        <Route index element={<CaregiverDashboard />} />
        <Route path="patients" element={<PatientProfiles />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/patient/*" element={<PatientLayout />} />
        <Route path="/caregiver/*" element={<CaregiverLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
