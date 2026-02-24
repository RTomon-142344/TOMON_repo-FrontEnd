import { useState } from 'react';
import { PROGRAMS } from '../data/mockData';
import ProgramCard from './ProgramCard';
import ProgramDetails from './ProgramDetails';
import SubjectDetails from './SubjectDetails';
import FilterBar from './FilterBar';
import { AddProgramModal } from './ProgramDetails';

export default function ProgramList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = PROGRAMS.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    const matchStatus = !filters.status || p.status === filters.status;
    const matchType = !filters.type || p.type === filters.type;
    return matchQ && matchStatus && matchType;
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Program Offerings</div>
          <div className="section-count">{filtered.length} of {PROGRAMS.length} programs</div>
        </div>
        <button className="btn btn-gold" onClick={() => setShowAdd(true)}>+ Add Program</button>
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        filterOptions={{
          searchPlaceholder: "Search by code or name...",
          selects: [
            { key: "status", label: "All Status", options: ["Active", "Phased Out", "Under Review"] },
            { key: "type", label: "All Types", options: ["Bachelor's", "Diploma"] },
          ]
        }}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Programs Found</div>
          <div className="empty-text">Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="program-grid">
          {filtered.map(p => (
            <ProgramCard key={p.id} program={p} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <ProgramDetails
          program={selected}
          onClose={() => setSelected(null)}
          onSubjectClick={s => setSubjectSelected(s)}
        />
      )}
      {subjectSelected && (
        <SubjectDetails subject={subjectSelected} onClose={() => setSubjectSelected(null)} />
      )}
      {showAdd && <AddProgramModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}