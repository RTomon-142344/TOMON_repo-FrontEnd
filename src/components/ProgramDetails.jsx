import { useState } from 'react';
import { YEAR_LEVELS, getSubjectsByProgram, getStatusClass } from '../data/mockData';
import { TermBadge } from './SubjectCard';

export function StatusBadge({ status }) {
  const cls = getStatusClass(status);
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export function EditProgramForm({ program, onCancel }) {
  const [form, setForm] = useState({ ...program });
  return (
    <div>
      <div className="section-label">Edit Program (Design Only)</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Program Code</label>
          <input
            className="form-input"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option>Bachelor's</option>
            <option>Diploma</option>
            <option>Master's</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Program Name</label>
        <input
          className="form-input"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Duration</label>
          <input
            className="form-input"
            value={form.duration}
            onChange={e => setForm({ ...form, duration: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total Units</label>
          <input
            className="form-input"
            type="number"
            value={form.units}
            onChange={e => setForm({ ...form, units: e.target.value })}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Phased Out</option>
          <option>Under Review</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={onCancel}>💾 Save Changes (Design)</button>
      </div>
    </div>
  );
}

export function AddProgramModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1 }}>NEW PROGRAM</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Add Program</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <EditProgramForm
            program={{ code: "", name: "", type: "Bachelor's", duration: "4 years", units: 0, status: "Active", description: "" }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProgramDetails({ program, onClose, onSubjectClick }) {
  const [openYears, setOpenYears] = useState([1, 2, 3, 4]);
  const [showForm, setShowForm] = useState(false);

  const toggleYear = (y) =>
    setOpenYears(prev =>
      prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]
    );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, letterSpacing: 1 }}>PROGRAM DETAILS</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{program.code}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{program.name}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!showForm ? (
            <>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Type</div>
                  <div className="detail-value">{program.type}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{program.duration}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Total Units</div>
                  <div className="detail-value">{program.units}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value"><StatusBadge status={program.status} /></div>
                </div>
              </div>

              <div className="section-label">Description</div>
              <div className="description-box">{program.description}</div>

              <div className="section-label">Curriculum by Year Level</div>
              {[1, 2, 3, 4].map(y => {
                const subs = getSubjectsByProgram(program.id, y);
                if (!subs.length) return null;
                const isOpen = openYears.includes(y);
                return (
                  <div className="year-section" key={y}>
                    <div className="year-header" onClick={() => toggleYear(y)}>
                      <div style={{ width: 28, height: 28, background: "var(--maroon)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: 12, fontWeight: 700 }}>
                        {y}
                      </div>
                      <div className="year-label">{YEAR_LEVELS[y - 1]}</div>
                      <span className="year-toggle">({subs.length} subjects) {isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div className="year-subjects">
                        {subs.map(s => (
                          <div className="year-subject-item" key={s.id} onClick={() => onSubjectClick(s)}>
                            <span style={{ fontWeight: 700, color: "var(--maroon)", fontSize: 12, minWidth: 60 }}>{s.code}</span>
                            <span style={{ flex: 1, fontSize: 13 }}>{s.title}</span>
                            <TermBadge term={s.term} />
                            <span className="units-badge">{s.units}u</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <EditProgramForm program={program} onCancel={() => setShowForm(false)} />
          )}
        </div>

        <div className="modal-footer">
          {!showForm && (
            <>
              <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
              <button className="btn btn-gold btn-sm" onClick={() => setShowForm(true)}>✏️ Edit Program</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}