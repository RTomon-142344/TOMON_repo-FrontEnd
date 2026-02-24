import { getProgramById, getTermClass } from '../data/mockData';

export function TermBadge({ term }) {
  const cls = getTermClass(term);
  const label =
    term === "Per Semester" ? "Semester" :
    term === "Per Term" ? "Term" :
    "Sem & Term";
  return <span className={`term-badge ${cls}`}>{label}</span>;
}

export default function SubjectCard({ subject, onClick }) {
  const program = getProgramById(subject.programId);

  return (
    <div
      className="subject-card"
      onClick={() => onClick(subject)}
      style={{ animationDelay: `${subject.id * 0.03}s` }}
    >
      <div className="subject-card-accent" />
      <div className="subject-card-body">
        <span className="subject-code">{subject.code}</span>
        <span className="subject-title">{subject.title}</span>
        <div className="subject-tags">
          <TermBadge term={subject.term} />
          <span className="units-badge">{subject.units} units</span>
          {subject.prerequisites.length > 0 && (
            <span className="prereq-badge">⚠ {subject.prerequisites.length} prereq</span>
          )}
          {program && (
            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(123,28,28,0.06)", color: "var(--maroon)", fontWeight: 600 }}>
              {program.code}
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 18, color: "var(--text-muted)" }}>›</span>
      </div>
    </div>
  );
}