import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { PROGRAMS, SUBJECTS, getProgramById } from '../data/mockData';
import { TermBadge } from './SubjectCard';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <span className="animate-count">{display}</span>;
}

export default function Dashboard() {
  const total = PROGRAMS.length;
  const totalSub = SUBJECTS.length;
  const active = PROGRAMS.filter(p => p.status === "Active").length;
  const inactive = PROGRAMS.filter(p => p.status !== "Active").length;
  const withPrereq = SUBJECTS.filter(s => s.prerequisites.length > 0).length;

  const semData = [
    { name: "1st Sem", value: SUBJECTS.filter(s => s.semester?.includes("1st Semester")).length },
    { name: "2nd Sem", value: SUBJECTS.filter(s => s.semester?.includes("2nd Semester")).length },
    { name: "1st Term", value: SUBJECTS.filter(s => s.semester?.includes("1st Term")).length },
    { name: "2nd Term", value: SUBJECTS.filter(s => s.semester?.includes("2nd Term")).length },
    { name: "Both", value: SUBJECTS.filter(s => s.term === "Both").length },
  ];

  const statusData = [
    { name: "Active", value: active },
    { name: "Phased Out", value: PROGRAMS.filter(p => p.status === "Phased Out").length },
    { name: "Under Review", value: PROGRAMS.filter(p => p.status === "Under Review").length },
  ];

  const PIE_COLORS = ["#16a34a", "#dc2626", "#d97706"];

  const recentPrograms = [...PROGRAMS]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);

  const recentSubjects = [...SUBJECTS].slice(-4).reverse();

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="section-title">Dashboard Overview</div>
          <div className="section-count">Academic Year 2024–2025</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {[
          { icon: "🎓", iconCls: "maroon", num: total,     label: "Total Programs",       sub: `${active} active programs` },
          { icon: "📚", iconCls: "gold",   num: totalSub,  label: "Total Subjects",        sub: `Across all programs` },
          { icon: "✅", iconCls: "green",  num: active,    label: "Active Programs",       sub: `${inactive} inactive/phased` },
          { icon: "⚠️", iconCls: "blue",   num: withPrereq,label: "Subjects w/ Prereqs",  sub: `${totalSub - withPrereq} without prerequisites` },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`icon ${s.iconCls}`}>{s.icon}</div>
            <div className="stat-num"><AnimatedNumber value={s.num} /></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Subjects by Semester/Term</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={semData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
              <Bar dataKey="value" name="Subjects" radius={[6, 6, 0, 0]}>
                {semData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "var(--maroon)" : "var(--gold)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">🥧 Program Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={{ stroke: "var(--text-muted)" }}
              >
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-grid">
        <div className="recent-card">
          <div className="chart-title">🆕 Recently Added Programs</div>
          {recentPrograms.map(p => (
            <div className="recent-item" key={p.id}>
              <div className="recent-dot" />
              <div className="recent-info">
                <div className="recent-code">{p.code}</div>
                <div className="recent-name">{p.name}</div>
              </div>
              <div className="recent-date">{p.dateAdded}</div>
            </div>
          ))}
        </div>

        <div className="recent-card">
          <div className="chart-title">🆕 Recently Added Subjects</div>
          {recentSubjects.map(s => {
            const p = getProgramById(s.programId);
            return (
              <div className="recent-item" key={s.id}>
                <div className="recent-dot" style={{ background: "var(--maroon)" }} />
                <div className="recent-info">
                  <div className="recent-code">{s.code}</div>
                  <div className="recent-name">{s.title} · {p?.code}</div>
                </div>
                <TermBadge term={s.term} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}