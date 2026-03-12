import { useState, useEffect, useCallback } from 'react';
import { getStudents } from '../services/api';

const DEPARTMENTS = ['All', 'BSIT', 'BSCS', 'BSIS', 'DICT', 'BSECE'];

const DEPT_COLORS = {
  BSIT:  '#3b82f6',
  BSCS:  '#8b5cf6',
  BSIS:  '#10b981',
  DICT:  '#f59e0b',
  BSECE: '#ef4444',
};

// ── Student Detail Modal ─────────────────────────────────────
function StudentModal({ student, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 520, width: '90%', borderRadius: 16, overflow: 'hidden', padding: 0 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
          padding: '28px 28px 22px', position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', color: '#fff', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'var(--gold)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#1a0a00',
              flexShrink: 0,
            }}>
              {student.first_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{student.full_name}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 }}>{student.student_number}</div>
              <span style={{
                display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 700,
                background: DEPT_COLORS[student.department] || '#666', color: '#fff',
              }}>{student.department}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 28px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {[
              { icon: '✉️', label: 'Email',      value: student.email },
              { icon: '⚧',  label: 'Gender',     value: student.gender },
              { icon: '📅', label: 'Enrolled',   value: new Date(student.enrolled_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: '📚', label: 'Total Courses', value: `${student.courses?.length || 0} course${student.courses?.length !== 1 ? 's' : ''}` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: 'var(--card-bg)', borderRadius: 10,
                padding: '11px 13px', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 3 }}>{icon} {label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, letterSpacing: 1, marginBottom: 10 }}>
            ENROLLED COURSES
          </div>

          {student.courses?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {student.courses.map(course => (
                <div key={course.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 13px', borderRadius: 10,
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                }}>
                  <span style={{
                    background: 'var(--gold)', color: '#1a0a00', borderRadius: 6,
                    padding: '3px 8px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
                  }}>{course.code}</span>
                  <span style={{ fontSize: 13 }}>{course.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ opacity: 0.45, fontSize: 13 }}>No courses enrolled.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Students Page ───────────────────────────────────────
export default function SubjectList() {
  const [students, setStudents]     = useState([]);
  const [meta, setMeta]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [department, setDepartment] = useState('All');
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, per_page: 20 });
      if (search)               params.append('search', search);
      if (department !== 'All') params.append('department', department);

      const data = await getStudents(params.toString());
      setStudents(data.data);
      setMeta(data);
    } catch {
      setError('Failed to load students. Is Laravel running?');
    } finally {
      setLoading(false);
    }
  }, [search, department, page]);

  // Debounce fetch
  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
  }, [fetchStudents]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [search, department]);

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* Page Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Student Records</h2>
        <p style={{ fontSize: 13, opacity: 0.55, margin: '4px 0 0' }}>
          {meta ? `${meta.total} students total` : 'Loading...'}
        </p>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', opacity: 0.45, pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or student number..."
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--card-bg)',
              color: 'var(--text)', fontSize: 13, boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>

        {/* Department pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DEPARTMENTS.map(dept => (
            <button key={dept} onClick={() => setDepartment(dept)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s',
              background: department === dept ? 'var(--gold)' : 'var(--card-bg)',
              color: department === dept ? '#1a0a00' : 'var(--text)',
            }}>{dept}</button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#991b1b', padding: '11px 16px', borderRadius: 10,
          marginBottom: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          ⚠️ {error}
          <button onClick={fetchStudents} style={{
            padding: '4px 12px', borderRadius: 6, background: '#991b1b',
            color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12,
          }}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: 14,
        border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--maroon-dark)', color: '#fff' }}>
              {['Student No.', 'Name', 'Dept', 'Gender', 'Enrolled Courses', 'Date Enrolled', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  {[90, 150, 60, 55, 130, 90, 50].map((w, j) => (
                    <td key={j} style={{ padding: '13px 16px' }}>
                      <div style={{
                        height: 12, borderRadius: 6, width: w,
                        background: 'var(--border)', opacity: 0.5,
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 52, textAlign: 'center', opacity: 0.4 }}>
                  No students found.
                </td>
              </tr>
            ) : students.map((student, idx) => (
              <tr key={student.id}
                onClick={() => setSelected(student)}
                style={{
                  borderTop: '1px solid var(--border)', cursor: 'pointer',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.012)',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.012)'}
              >
                <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, opacity: 0.6, fontWeight: 600 }}>
                  {student.student_number}
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                  <div style={{ fontSize: 11, opacity: 0.45, marginTop: 1 }}>{student.email}</div>
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <span style={{
                    padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: DEPT_COLORS[student.department] || '#666', color: '#fff',
                  }}>{student.department}</span>
                </td>
                <td style={{ padding: '11px 16px', opacity: 0.75, fontSize: 12 }}>{student.gender}</td>
                <td style={{ padding: '11px 16px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {student.courses?.slice(0, 2).map(c => (
                      <span key={c.id} style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11,
                        background: 'var(--gold)', color: '#1a0a00', fontWeight: 700,
                      }}>{c.code}</span>
                    ))}
                    {student.courses?.length > 2 && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11,
                        background: 'var(--border)', fontWeight: 600, opacity: 0.65,
                      }}>+{student.courses.length - 2}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '11px 16px', opacity: 0.55, fontSize: 12 }}>
                  {new Date(student.enrolled_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(student); }}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                      background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer',
                    }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 18 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '7px 18px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--card-bg)', color: 'var(--text)', fontSize: 13,
              cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
            }}>← Prev</button>

          <span style={{ fontSize: 13, opacity: 0.6 }}>
            Page {meta.current_page} of {meta.last_page} · {meta.total} students
          </span>

          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            style={{
              padding: '7px 18px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--card-bg)', color: 'var(--text)', fontSize: 13,
              cursor: page === meta.last_page ? 'not-allowed' : 'pointer',
              opacity: page === meta.last_page ? 0.4 : 1,
            }}>Next →</button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}