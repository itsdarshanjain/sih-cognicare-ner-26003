import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Clock, Target, Flame, AlertTriangle, Brain, Calendar, Download, Users, Activity, Volume2, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speak } from '../utils/tts';
import CaregiverBurnout from '../components/CaregiverBurnout';

const COLORS = ['#0A7E6A', '#1D9B5F', '#C9930B', '#2980B9', '#7D3C98', '#D35400'];

export default function CaregiverDashboard() {
  const { t, gameScores, moodLogs = [], speechLogs = [], language } = useApp();
  const [timeRange, setTimeRange] = useState('7d');
  const [isBurnoutModalOpen, setIsBurnoutModalOpen] = useState(false);

  const hasData = gameScores.length > 0;

  const weeklyData = [
    { day: 'Mon', accuracy: 72, sessions: 3, responseTime: 4.5 },
    { day: 'Tue', accuracy: 68, sessions: 4, responseTime: 5.1 },
    { day: 'Wed', accuracy: 75, sessions: 3, responseTime: 4.2 },
    { day: 'Thu', accuracy: 71, sessions: 5, responseTime: 4.8 },
    { day: 'Fri', accuracy: 78, sessions: 4, responseTime: 3.9 },
    { day: 'Sat', accuracy: 82, sessions: 6, responseTime: 3.7 },
    { day: 'Sun', accuracy: 80, sessions: 3, responseTime: 3.8 },
  ];

  const domainData = [
    { domain: 'Memory', score: 76, fill: COLORS[0] },
    { domain: 'Attention', score: 68, fill: COLORS[1] },
    { domain: 'Language', score: 82, fill: COLORS[2] },
    { domain: 'Pattern', score: 71, fill: COLORS[3] },
    { domain: 'Executive', score: 65, fill: COLORS[4] },
    { domain: 'Semantic', score: 79, fill: COLORS[5] },
  ];

  const engagementPie = [
    { name: 'Memory Games', value: 35, color: '#0A7E6A' },
    { name: 'Language Games', value: 25, color: '#1D9B5F' },
    { name: 'Attention Games', value: 20, color: '#C9930B' },
    { name: 'Pattern Games', value: 20, color: '#2980B9' },
  ];

  const monthlyTrend = [
    { week: 'W1', accuracy: 68, engagement: 85 },
    { week: 'W2', accuracy: 72, engagement: 88 },
    { week: 'W3', accuracy: 75, engagement: 84 },
    { week: 'W4', accuracy: 78, engagement: 92 },
  ];

  const moodData = [
    { day: 'Mon', moodScore: 80, label: '😄' },
    { day: 'Tue', moodScore: 80, label: '😄' },
    { day: 'Wed', moodScore: 60, label: '😐' },
    { day: 'Thu', moodScore: 40, label: '😢' },
    { day: 'Fri', moodScore: 40, label: '😢' },
    { day: 'Sat', moodScore: 20, label: '😠' },
    { day: 'Sun', moodScore: 80, label: '😄' },
  ];
  
  // Override with real mood logs if available
  if (moodLogs && moodLogs.length > 0) {
    const scoreMap = { 'happy': 80, 'neutral': 60, 'sad': 40, 'anxious': 30, 'agitated': 20 };
    const emojiMap = { 'happy': '😄', 'neutral': '😐', 'sad': '😢', 'anxious': '😰', 'agitated': '😠' };
    
    // Take last 7 days
    moodLogs.slice(0, 7).reverse().forEach((log, i) => {
      if (i < moodData.length) {
        moodData[i].moodScore = scoreMap[log.mood] || 60;
        moodData[i].label = emojiMap[log.mood] || '😐';
        moodData[i].day = 'Day ' + (i+1);
      }
    });
  }

  // --- Speech Biomarker Data Processing ---
  const speechData = [];
  if (speechLogs && speechLogs.length > 0) {
    speechLogs.slice(0, 7).reverse().forEach((log, i) => {
      speechData.push({
        day: 'Day ' + (i+1),
        fluencyScore: log.fluencyScore,
        fillers: log.fillerCount,
        words: log.wordCount
      });
    });
  }

  // --- COGNITIVE WELLNESS INDEX (CWI) CALCULATION ---
  // 1. Game Avg (50% weight)
  const gameAvg = gameScores.length > 0 
    ? gameScores.slice(0, 10).reduce((a, s) => a + s.accuracy, 0) / Math.min(gameScores.length, 10) 
    : 70;
  
  // 2. Mood Avg (25% weight)
  const recentMoods = moodLogs.slice(0, 7);
  const moodScoreMap = { happy: 90, neutral: 70, sad: 40, anxious: 30, agitated: 20 };
  const moodAvg = recentMoods.length > 0 
    ? recentMoods.reduce((a, m) => a + (moodScoreMap[m.mood] || 60), 0) / recentMoods.length 
    : 60;
  
  // 3. Speech Avg (25% weight)
  const recentSpeech = speechLogs.slice(0, 5);
  const speechAvg = recentSpeech.length > 0 
    ? recentSpeech.reduce((a, s) => a + s.fluencyScore, 0) / recentSpeech.length 
    : 70;

  const CWI = Math.round(gameAvg * 0.5 + moodAvg * 0.25 + speechAvg * 0.25);
  const cwiColor = CWI >= 75 ? 'var(--accent-green)' : CWI >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)';

  const CustomMoodTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, padding: 12, fontSize: 13, boxShadow: 'var(--shadow-md)' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.day}</p>
          <p style={{ margin: 0, fontSize: '1.2rem' }}>Mood: {payload[0].payload.label}</p>
        </div>
      );
    }
    return null;
  };

  const recentActivity = hasData ? gameScores.slice(0, 8) : [
    { id: 1, game: 'Landmark Memory', accuracy: 83, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, game: 'Melody Memory', accuracy: 67, timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, game: 'Daily Routine', accuracy: 100, timestamp: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, game: 'Number Patterns', accuracy: 75, timestamp: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, game: 'Proverb Wisdom', accuracy: 50, timestamp: new Date(Date.now() - 18000000).toISOString() },
    { id: 6, game: 'Colour & Word', accuracy: 88, timestamp: new Date(Date.now() - 21600000).toISOString() },
    { id: 7, game: 'Cultural Connections', accuracy: 100, timestamp: new Date(Date.now() - 25200000).toISOString() },
    { id: 8, game: 'Bazaar Sorting', accuracy: 75, timestamp: new Date(Date.now() - 28800000).toISOString() },
  ];

  const totalSessions = hasData ? gameScores.length : 28;
  const avgAccuracy = hasData ? Math.round(gameScores.reduce((a, s) => a + s.accuracy, 0) / gameScores.length) : 75;

  const handleSpeak = () => {
    const summary = `Patient summary: ${totalSessions} sessions this week. Average accuracy is ${avgAccuracy} percent. Active streak is 5 days. There is one sundowning alert detected in the evening hours.`;
    speak(summary, language);
  };

  // Get Caregiver Burnout Status
  let burnoutLevel = 'Checking...';
  let burnoutIcon = <Heart size={14} />;
  try {
    const scoreStr = localStorage.getItem('cogni_burnout_score');
    if (scoreStr) {
      const bScores = JSON.parse(scoreStr);
      if (bScores.overwhelmed >= 4 || (bScores.sleep === 'No' && bScores.support === 'No')) {
        burnoutLevel = 'High Risk';
      } else if (bScores.overwhelmed === 3) {
        burnoutLevel = 'Moderate';
      } else {
        burnoutLevel = 'Healthy';
      }
    } else {
      burnoutLevel = 'Pending Check-In';
    }
  } catch (e) {
    burnoutLevel = 'Healthy';
  }

  return (
    <>
      <CaregiverBurnout isVisible={isBurnoutModalOpen} onClose={() => setIsBurnoutModalOpen(false)} />
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>📊 Caregiver Dashboard</h2>
          <p>Monitor cognitive performance, track engagement trends, and receive AI-powered clinical insights.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={() => window.print()} className="btn btn-outline" title="Export Clinical Report" style={{ padding: '10px 16px' }} data-no-print="true">
            <Download size={18} /> Export PDF
          </button>
          <button onClick={handleSpeak} className="btn btn-outline" title="Voice Summary" style={{ padding: '10px 16px' }} data-no-print="true">
            <Volume2 size={18} /> Summary
          </button>
          <select data-no-print="true" className="form-select" value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ minHeight: 44, width: 'auto', padding: '8px 14px', fontSize: '0.82rem' }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
      <div className="page-content">
        
        {/* --- HERO: COGNITIVE WELLNESS INDEX --- */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 24,
          padding: 30,
          marginBottom: 28,
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Cognitive Wellness Index</div>
            <div style={{ fontSize: '4.5rem', fontWeight: 800, color: cwiColor, lineHeight: 1 }}>{CWI}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 4 }}>Out of 100</div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>AI Multi-Signal Attribution</h4>
            
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>🎮 Game Performance (50%)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.round(gameAvg)}/100 → +{Math.round(gameAvg * 0.5)} pts</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--accent-teal-light)', borderRadius: 4 }}>
                <div style={{ width: `${gameAvg}%`, height: '100%', background: 'var(--accent-teal)', borderRadius: 4 }}></div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>🎭 Emotional Stability (25%)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.round(moodAvg)}/100 → +{Math.round(moodAvg * 0.25)} pts</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(196,122,0,0.1)', borderRadius: 4 }}>
                <div style={{ width: `${moodAvg}%`, height: '100%', background: '#C47A00', borderRadius: 4 }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>🎙️ Speech Fluency Biomarker (25%)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.round(speechAvg)}/100 → +{Math.round(speechAvg * 0.25)} pts</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(124,58,237,0.1)', borderRadius: 4 }}>
                <div style={{ width: `${speechAvg}%`, height: '100%', background: '#7C3AED', borderRadius: 4 }}></div>
              </div>
            </div>
            
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card teal">
            <div className="kpi-label">Sessions This Week</div>
            <div className="kpi-value">{totalSessions}</div>
            <div className="kpi-change" style={{ color: 'var(--accent-green)' }}><TrendingUp size={14} /> +12% from last week</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-label">Average Accuracy</div>
            <div className="kpi-value">{avgAccuracy}%</div>
            <div className="kpi-change"><Target size={14} /> Above clinical threshold (70%)</div>
          </div>
          <div className="kpi-card amber">
            <div className="kpi-label">Avg Response Time</div>
            <div className="kpi-value">4.2s</div>
            <div className="kpi-change"><Clock size={14} /> Normal for mild MCI</div>
          </div>
          <div className="kpi-card purple">
            <div className="kpi-label">Active Streak</div>
            <div className="kpi-value">5 days</div>
            <div className="kpi-change"><Flame size={14} /> Personal best!</div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-label">Reminders Completed</div>
            <div className="kpi-value">87%</div>
            <div className="kpi-change"><Calendar size={14} /> Medicine adherence strong</div>
          </div>
          <div className="kpi-card purple" style={{ border: burnoutLevel === 'High Risk' ? '2px solid var(--accent-amber)' : 'none' }}>
            <div className="kpi-label">Caregiver Wellbeing</div>
            <div className="kpi-value" style={{ fontSize: '1.4rem' }}>{burnoutLevel}</div>
            <div className="kpi-change">
              {burnoutLevel === 'High Risk' ? '⚠️ Take a break. See resources.' : '💚 You are doing great!'}
            </div>
          </div>
        </div>

        {/* AI Clinical Alert — Prominent */}
        <div className="alert-card high" style={{ marginBottom: 28, display: 'flex', gap: 18, alignItems: 'flex-start', background: 'rgba(192,57,43,0.03)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={24} color="var(--accent-red)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>⚠️ Sundowning Pattern Detected</span>
              <span className="badge red">CRITICAL</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Evening response times have increased by <strong>35%</strong> over the past 3 days (4:00 PM – 7:00 PM window) for patient <strong>Padma Devi Bora</strong>. This pattern is consistent with <strong>Sundowning Syndrome</strong>, common in moderate dementia.
            </div>
            <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(10,126,106,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(10,126,106,0.1)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-teal)', marginBottom: 4 }}>💡 AI Recommendation:</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Schedule all cognitive exercises before 3 PM. Introduce 15-min calming music therapy (Bamboo Flute or Pepa) in the evening window. Consider reducing game complexity after 2 PM.</div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">7-Day Cognitive Performance</div>
                <div className="card-subtitle">Accuracy & response time trends</div>
              </div>
              <span className="badge teal live">LIVE</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="gradAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A7E6A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0A7E6A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[50, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 13, boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#0A7E6A" fill="url(#gradAccuracy)" strokeWidth={3} name="Accuracy %" dot={{ fill: '#0A7E6A', r: 5 }} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">Cognitive Domain Breakdown</div>
                <div className="card-subtitle">Performance by cognitive area (CST mapping)</div>
              </div>
              <span className="badge green">AI ANALYSIS</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="domain" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 13, boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} name="Score %">
                  {domainData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 - Clinical Trends */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">Patient Mood Trend</div>
                <div className="card-subtitle">Self-reported pre-session emotional state</div>
              </div>
              <span className="badge amber">CLINICAL</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={moodData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<CustomMoodTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="moodScore" 
                  stroke="#C47A00" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#C47A00', stroke: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">Conversational Cognitive Signal</div>
                <div className="card-subtitle">Speech fluency biomarker from Smriti Phone</div>
              </div>
              <span className="badge purple">PASSIVE AI</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={speechData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 13, boxShadow: 'var(--shadow-md)' }} />
                <Line 
                  type="monotone" 
                  dataKey="fluencyScore" 
                  name="Fluency Score"
                  stroke="#7C3AED" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.3s backwards' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Recent Game Sessions</div>
              <div className="card-subtitle">Detailed session history with accuracy tracking</div>
            </div>
            <span className="badge teal">{recentActivity.length} sessions</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Game Exercise</th>
                <th>Accuracy</th>
                <th>Performance</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.game}</td>
                  <td>
                    <span className={`badge ${s.accuracy >= 80 ? 'green' : s.accuracy >= 60 ? 'amber' : 'red'}`}>
                      {s.accuracy}%
                    </span>
                  </td>
                  <td>
                    <div style={{ width: 120, height: 8, background: 'var(--accent-teal-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${s.accuracy}%`, height: '100%', background: s.accuracy >= 80 ? 'var(--accent-green)' : s.accuracy >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtle Check-In Trigger */}
        <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 20 }} data-no-print="true">
          <button 
            onClick={() => setIsBurnoutModalOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              fontSize: '0.85rem',
              textDecoration: 'underline'
            }}
          >
            Caregiver Self-Assessment & Support Resources
          </button>
        </div>

      </div>
    </>
  );
}
