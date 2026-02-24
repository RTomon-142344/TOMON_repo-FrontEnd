import { StatusBadge } from './ProgramDetails';

export default function ProgramCard({ program, onClick }) {
  return (
    <div
      className="program-card"
      onClick={() => onClick(program)}
      style={{ animationDelay: `${program.id * 0.05}s` }}
    >
      <div className="program-card-body">
        <div className="program-code-badge">{program.code}</div>
        <div className="program-name">{program.name}</div>
        <div className="program-meta">
          <span className="program-tag type">📚 {program.type}</span>
          <span className="program-tag duration">⏱ {program.duration}</span>
          <span className="program-tag units">📋 {program.units} units</span>
        </div>
      </div>
      <div className="program-card-footer">
        <StatusBadge status={program.status} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>View Details →</span>
      </div>
    </div>
  );
}