import { useState } from 'react';
import { AlertTriangle, TrendingDown, Brain, Droplets, Clock, Check, Bell, Filter } from 'lucide-react';

const ALERTS = [
  { id: 1, severity: 'high', title: 'Sundowning Pattern Detected', patient: 'Padma Devi Bora', desc: 'Evening response times increased by 35% (4-7 PM) over 3 consecutive days. Consider scheduling games before 3 PM and introducing calming music therapy.', time: '30 min ago', icon: <Clock size={20} />, recommendation: 'Move all cognitive exercises to morning slot. Enable Bamboo Flute ambient mode after 4 PM.' },
  { id: 2, severity: 'high', title: 'Memory Score Decline', patient: 'Tombi Devi Thokchom', desc: 'Landmark Memory accuracy dropped from 78% to 52% over one week. Consistent downward trajectory detected.', time: '2 hours ago', icon: <TrendingDown size={20} />, recommendation: 'Reduce grid to 4 cards, enable hint mode, increase display time to 5 seconds.' },
  { id: 3, severity: 'medium', title: 'Hydration Reminder Missed', patient: 'Ramnath Sharma', desc: 'Patient has not completed 3 of 4 water reminders today. Below the recommended 6-glass daily minimum.', time: '4 hours ago', icon: <Droplets size={20} />, recommendation: 'Send caregiver notification. Enable voice reminder with louder volume.' },
  { id: 4, severity: 'medium', title: 'Music Therapy Recommendation', patient: 'Lalthanzami', desc: 'Based on Melody Memory trends, patient responds exceptionally well to instrumental stimulation (accuracy: 88%).', time: '6 hours ago', icon: <Brain size={20} />, recommendation: 'Schedule 15-min Bamboo Flute + Pung session daily at 10 AM.' },
  { id: 5, severity: 'low', title: 'Weekly Engagement Milestone', patient: 'All Patients', desc: 'All 5 patients completed at least 3 sessions this week. Current engagement rate: 87% — above the 70% clinical threshold.', time: '1 day ago', icon: <Brain size={20} />, recommendation: 'Continue current intervention schedule. Consider adding one new game type.' },
  { id: 6, severity: 'medium', title: 'Language Interface Feedback', patient: 'Bansiewdor Kharlukhi', desc: 'Patient switched from English to Khasi interface 4 times today, suggesting comprehension difficulty with English.', time: '1 day ago', icon: <AlertTriangle size={20} />, recommendation: 'Set Khasi as default language. Enable auto-TTS for all game instructions.' },
  { id: 7, severity: 'low', title: 'Pattern Recognition Improvement', patient: 'Padma Devi Bora', desc: 'Weaving Patterns score improved from 60% to 82% over 2 weeks — indicates visuospatial recovery.', time: '2 days ago', icon: <Brain size={20} />, recommendation: 'Increase pattern complexity by one level. Consider adding 4x4 grid option.' },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState(new Set());

  const filtered = ALERTS.filter(a => {
    if (dismissed.has(a.id)) return false;
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2>🔔 AI Alerts & Clinical Insights</h2>
          <p>AI-powered behavioral analysis detects cognitive patterns, anomalies, and care opportunities.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {['all', 'high', 'medium', 'low'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
              style={{ padding: '8px 16px', minHeight: 40, fontSize: '0.78rem', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>
      <div className="page-content">
        <div className="kpi-grid" style={{ marginBottom: 28 }}>
          <div className="kpi-card red">
            <div className="kpi-label">Critical Alerts</div>
            <div className="kpi-value">{ALERTS.filter(a => a.severity === 'high').length}</div>
            <div className="kpi-change"><AlertTriangle size={14} /> Requires immediate attention</div>
          </div>
          <div className="kpi-card amber">
            <div className="kpi-label">Warnings</div>
            <div className="kpi-value">{ALERTS.filter(a => a.severity === 'medium').length}</div>
            <div className="kpi-change"><Bell size={14} /> Monitor closely</div>
          </div>
          <div className="kpi-card green">
            <div className="kpi-label">Positive Insights</div>
            <div className="kpi-value">{ALERTS.filter(a => a.severity === 'low').length}</div>
            <div className="kpi-change"><Brain size={14} /> Progress indicators</div>
          </div>
        </div>

        {filtered.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.severity}`} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: alert.severity === 'high' ? 'rgba(192,57,43,0.08)' : alert.severity === 'medium' ? 'rgba(201,147,11,0.08)' : 'rgba(29,155,95,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: alert.severity === 'high' ? 'var(--accent-red)' : alert.severity === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)'
            }}>
              {alert.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{alert.title}</span>
                <span className={`badge ${alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'amber' : 'green'}`}>
                  {alert.severity}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>• {alert.patient}</span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>{alert.desc}</div>
              <div style={{ padding: '12px 16px', background: 'rgba(10,126,106,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(10,126,106,0.08)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>💡 AI Recommendation</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{alert.recommendation}</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => setDismissed(p => new Set([...p, alert.id]))}
                  style={{ padding: '6px 14px', minHeight: 36, fontSize: '0.78rem' }}>
                  <Check size={14} /> Acknowledge
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 80, textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 600 }}>{alert.time}</div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>All alerts acknowledged</div>
            <div style={{ fontSize: '0.88rem', marginTop: 4 }}>No pending alerts in this category</div>
          </div>
        )}
      </div>
    </>
  );
}
