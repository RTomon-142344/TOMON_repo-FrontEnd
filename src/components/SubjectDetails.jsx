import { getProgramById, YEAR_LEVELS } from '../data/mockData';
import { TermBadge } from './SubjectCard';

export default function SubjectDetails({ subject, onClose }) {
  const program = getProgramById(subject.programId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1 }}>SUBJECT DETAILS</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{subject.code}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{subject.title}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Units</div>
              <div className="detail-value">{subject.units} units</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Semester/Term</div>
              <div className="detail-value"><TermBadge term={subject.term} /></div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Year Level</div>
              <div className="detail-value">{YEAR_LEVELS[subject.yearLevel - 1]}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Program</div>
              <div className="detail-value">{program?.code || "—"}</div>
            </div>
          </div>

          <div className="section-label">Description</div>
          <div className="description-box">{subject.description || "No description provided."}</div>

          <div className="detail-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="detail-item">
              <div className="detail-label">Prerequisites</div>
              <div style={{ marginTop: 8 }}>
                <div className="prereq-list">
                  {subject.prerequisites.length > 0
                    ? subject.prerequisites.map(p => <span key={p} className="prereq-chip">{p}</span>)
                    : <span className="none-chip">None</span>
                  }
                </div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Co-requisites</div>
              <div style={{ marginTop: 8 }}>
                <div className="prereq-list">
                  {subject.corequisites.length > 0
                    ? subject.corequisites.map(c => <span key={c} className="coreq-chip">{c}</span>)
                    : <span className="none-chip">None</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {program && (
            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(123,28,28,0.04)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div className="detail-label" style={{ marginBottom: 4 }}>Program Assignment</div>
              <div style={{ fontWeight: 600, color: "var(--maroon)" }}>{program.code} — {program.name}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}