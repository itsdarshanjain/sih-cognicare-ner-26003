import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Clock, Target, Flame, AlertTriangle, Brain, Calendar, Download, Users, Activity, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speak } from '../utils/tts';

const COLORS = ['#0A7E6A', '#1D9B5F', '#C9930B', '#2980B9', '#7D3C98', '#D35400'];

export default function CaregiverDashboard() {
  const { gameScores, language } = useApp();
  const [timeRange, setTimeRange] = useState('7d');

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
    { week: 'W1', accuracy: 62, engagement: 45 },
    { week: 'W2', accuracy: 68, engagement: 58 },
    { week: 'W3', accuracy: 72, engagement: 72 },
    { week: 'W4', accuracy: 75, engagement: 80 },
  ];

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

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>📊 Caregiver Dashboard</h2>
          <p>Monitor cognitive performance, track engagement trends, and receive AI-powered clinical insights.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={handleSpeak} className="btn btn-outline" title="Voice Summary" style={{ padding: '10px 16px' }}>
            <Volume2 size={18} /> Summary
          </button>
          <select className="form-select" value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ minHeight: 44, width: 'auto', padding: '8px 14px', fontSize: '0.82rem' }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
      <div className="page-content">
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
          <div className="kpi-card red">
            <div className="kpi-label">Active Alerts</div>
            <div className="kpi-value">2</div>
            <div className="kpi-change"><AlertTriangle size={14} /> 1 critical, 1 warning</div>
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

        {/* Charts Row 2 */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">Game Category Distribution</div>
                <div className="card-subtitle">Time spent per cognitive category</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={engagementPie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value}%)`}>
                  {engagementPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Progression</div>
                <div className="card-subtitle">Accuracy & engagement over 4 weeks</div>
              </div>
              <span className="badge purple">TREND</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 13 }} />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#0A7E6A" strokeWidth={3} dot={{ r: 5 }} name="Accuracy %" />
                <Line type="monotone" dataKey="engagement" stroke="#C9930B" strokeWidth={3} dot={{ r: 5 }} name="Engagement %" strokeDasharray="5 5" />
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
      </div>
    </>
  );
}
