import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import { getDashboard } from '../services/api';

// ── Loading Skeleton ─────────────────────────────────────────
function Skeleton({ height = 20, width = '100%', style = {} }) {
  return (
    <div style={{
      height, width, borderRadius: 8,
      background: 'linear-gradient(90deg, var(--border) 25%, var(--bg-dark) 50%, var(--border) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style,
    }} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <Skeleton height={40} width={40} style={{ borderRadius: '50%', marginBottom: 12 }} />
      <Skeleton height={32} width="60%" style={{ marginBottom: 8 }} />
      <Skeleton height={16} width="80%" style={{ marginBottom: 6 }} />
      <Skeleton height={13} width="60%" />
    </div>
  );
}

// ── Animated Count ───────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span className="animate-count">{display.toLocaleString()}</span>;
}

// ── Custom Tooltip ───────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
}

const PIE_COLORS = ['#7B1C1C', '#F5C518', '#16a34a', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

// ── Month label formatter: "2024-08" → "Aug '24" ────────────
function fmtMonth(m) {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const names = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${names[+mo]} '${y.slice(2)}`;
}

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Error state ──────────────────────────────────────────
  if (error) return (
    <div className="empty-state">
      <div className="empty-icon">⚠️</div>
      <div className="empty-title">Could not load dashboard</div>
      <div className="empty-text">{error}</div>
      <button className="btn btn-gold" style={{ marginTop: 16 }}
        onClick={() => { setError(''); setLoading(true); getDashboard().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); }}>
        Retry
      </button>
    </div>
  );

  const stats = data?.stats;
  const statCards = stats ? [
    { icon: '🎓', iconCls: 'maroon', num: stats.total_students,  label: 'Total Students',      sub: 'All enrolled students'        },
    { icon: '📚', iconCls: 'gold',   num: stats.total_courses,   label: 'Total Courses',       sub: 'Across all departments'       },
    { icon: '✅', iconCls: 'green',  num: stats.total_enrolled,  label: 'Students Enrolled',   sub: 'With at least one course'     },
    { icon: '📅', iconCls: 'blue',   num: stats.avg_attendance,  label: 'Avg Daily Attendance', sub: 'Based on school day records' },
  ] : [];

  const enrollmentData = (data?.monthly_enrollment || []).map(r => ({
    ...r, month: fmtMonth(r.month),
  }));

  return (
    <div>
      {/* Shimmer keyframe */}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">Dashboard Overview</div>
          <div className="section-count">Academic Year 2024–2025</div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        {loading
          ? [0,1,2,3].map(i => <StatCardSkeleton key={i} />)
          : statCards.map((s, i) => (
            <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`icon ${s.iconCls}`}>{s.icon}</div>
              <div className="stat-num"><AnimatedNumber value={s.num} /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))
        }
      </div>

      {/* ── Bar Chart: Monthly Enrollment ── */}
      <div className="chart-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
        <div className="chart-card">
          <div className="chart-title">📊 Monthly Enrollment Trends</div>
          {loading ? <Skeleton height={220} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={enrollmentData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Students" radius={[6,6,0,0]}>
                  {enrollmentData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? 'var(--maroon)' : 'var(--gold)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Pie Chart: Course Distribution ── */}
        <div className="chart-card">
          <div className="chart-title">🥧 Students by Department</div>
          {loading ? <Skeleton height={220} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.course_distribution || []}
                  cx="50%" cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: 'var(--text-muted)' }}
                >
                  {(data?.course_distribution || []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Line Chart: Attendance Trend ── */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">📈 Daily Attendance Pattern</div>
        {loading ? <Skeleton height={220} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.attendance_trend || []} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                interval={Math.floor((data?.attendance_trend?.length || 1) / 8)}
              />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} domain={[0, 500]} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone" dataKey="count" name="Present"
                stroke="var(--maroon)" strokeWidth={2} dot={false}
                activeDot={{ r: 5, fill: 'var(--gold)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}