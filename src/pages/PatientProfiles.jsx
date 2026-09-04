import { useState } from 'react';
import { Users, Activity, Calendar, Plus, Search, Brain, Clock, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const PATIENTS = [
  { id: 1, name: 'Padma Devi Bora', age: 74, lang: 'Assamese', stage: 'Mild MCI', lastActive: '2 hours ago', sessions: 42, emoji: '👵', accuracy: 76, trend: 'up', weekData: [{d:'M',s:70},{d:'T',s:72},{d:'W',s:75},{d:'T',s:71},{d:'F',s:78},{d:'S',s:82},{d:'S',s:80}] },
  { id: 2, name: 'Tombi Devi Thokchom', age: 68, lang: 'Manipuri', stage: 'Moderate', lastActive: '5 hours ago', sessions: 31, emoji: '👵', accuracy: 62, trend: 'down', weekData: [{d:'M',s:68},{d:'T',s:65},{d:'W',s:63},{d:'T',s:60},{d:'F',s:62},{d:'S',s:58},{d:'S',s:55}] },
  { id: 3, name: 'Ramnath Sharma', age: 79, lang: 'Bengali', stage: 'Mild MCI', lastActive: '1 day ago', sessions: 56, emoji: '👴', accuracy: 72, trend: 'up', weekData: [{d:'M',s:68},{d:'T',s:70},{d:'W',s:72},{d:'T',s:74},{d:'F',s:73},{d:'S',s:75},{d:'S',s:76}] },
  { id: 4, name: 'Lalthanzami', age: 71, lang: 'Mizo', stage: 'Mild MCI', lastActive: '3 hours ago', sessions: 28, emoji: '👵', accuracy: 80, trend: 'up', weekData: [{d:'M',s:75},{d:'T',s:78},{d:'W',s:76},{d:'T',s:80},{d:'F',s:82},{d:'S',s:84},{d:'S',s:83}] },
  { id: 5, name: 'Bansiewdor Kharlukhi', age: 76, lang: 'Khasi', stage: 'Moderate', lastActive: '6 hours ago', sessions: 19, emoji: '👴', accuracy: 58, trend: 'down', weekData: [{d:'M',s:62},{d:'T',s:60},{d:'W',s:58},{d:'T',s:55},{d:'F',s:56},{d:'S',s:54},{d:'S',s:52}] },
];

export default function PatientProfiles() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>👤 Patient Profiles</h2>
          <p>Manage patient records, view cognitive trends, and customize care plans.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <Plus size={18} /> Add Patient
        </button>
      </div>
      <div className="page-content">
        {/* KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 28 }}>
          <div className="kpi-card teal">
            <div className="kpi-label">Total Patients</div>
            <div className="kpi-value">{PATIENTS.length}</div>
            <div className="kpi-change"><Users size={14} /> Active on platform</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-label">Active Today</div>
            <div className="kpi-value">3</div>
            <div className="kpi-change"><Activity size={14} /> 60% engagement rate</div>
          </div>
          <div className="kpi-card amber">
            <div className="kpi-label">Total Sessions</div>
            <div className="kpi-value">{PATIENTS.reduce((a, p) => a + p.sessions, 0)}</div>
            <div className="kpi-change"><Calendar size={14} /> All time</div>
          </div>
          <div className="kpi-card blue">
            <div className="kpi-label">Avg Accuracy</div>
            <div className="kpi-value">{Math.round(PATIENTS.reduce((a, p) => a + p.accuracy, 0) / PATIENTS.length)}%</div>
            <div className="kpi-change"><Target size={14} /> Across all patients</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-select" placeholder="Search patients by name..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
        </div>

        {/* Patient Cards */}
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => setSelected(selected === p.id ? null : p.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ fontSize: '3.2rem', minWidth: 70, textAlign: 'center' }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.15rem' }}>{p.name}</span>
                  <span className={`badge ${p.stage === 'Moderate' ? 'amber' : 'green'}`}>{p.stage}</span>
                  {p.trend === 'up' && <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.78rem', fontWeight: 700 }}><TrendingUp size={14} /> Improving</span>}
                  {p.trend === 'down' && <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.78rem', fontWeight: 700 }}><TrendingDown size={14} /> Declining</span>}
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  <span>Age: <strong style={{ color: 'var(--text-primary)' }}>{p.age}</strong></span>
                  <span>Language: <strong style={{ color: 'var(--text-primary)' }}>{p.lang}</strong></span>
                  <span>Accuracy: <strong style={{ color: p.accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{p.accuracy}%</strong></span>
                  <span>Sessions: <strong style={{ color: 'var(--text-primary)' }}>{p.sessions}</strong></span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Last Active</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-teal)' }}>{p.lastActive}</div>
              </div>
            </div>

            {/* Expanded Detail */}
            {selected === p.id && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)', animation: 'fadeInUp 0.3s ease-out' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>7-Day Accuracy Trend</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={p.weekData}>
                    <XAxis dataKey="d" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 100]} hide />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="s" fill={p.trend === 'up' ? '#1D9B5F' : '#C9930B'} radius={[6, 6, 0, 0]} name="Accuracy %" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '10px 16px', fontSize: '0.82rem' }}>
                    <Brain size={16} /> View Full Report
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '10px 16px', fontSize: '0.82rem' }}>
                    <Clock size={16} /> Session History
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '10px 16px', fontSize: '0.82rem' }}>
                    <Activity size={16} /> Adjust Difficulty
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
