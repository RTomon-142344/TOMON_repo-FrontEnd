import { useState } from 'react';
import { SUBJECTS, PROGRAMS, getProgramById } from '../data/mockData';
import SubjectCard from './SubjectCard';
import SubjectDetails from './SubjectDetails';
import FilterBar from './FilterBar';

export default function SubjectList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);

  const filtered = SUBJECTS.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
    const matchSem = !filters.semester || s.semester === filters.semester || s.term === filters.semester;
    const matchUnits = !filters.units || String(s.units) === filters.units;
    const matchPrereq = !filters.prereq || (filters.prereq === "With" ? s.prerequisites.length > 0 : s.prerequisites.length === 0);
    const prog = getProgramById(s.programId);
    const matchProg = !filters.program || prog?.code === filters.program;
    return matchQ && matchSem && matchUnits && matchPrereq && matchProg;
  });

  const programCodes = [...new Set(PROGRAMS.map(p => p.code))];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Subject Offerings</div>
          <div className="section-count">{filtered.length} of {SUBJECTS.length} subjects</div>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        filterOptions={{
          searchPlaceholder: "Search by code or title...",
          selects: [
            { key: "semester", label: "All Semesters", options: ["1st Semester", "2nd Semester", "1st Term", "2nd Term", "Both"] },
            { key: "units", label: "All Units", options: ["1", "2", "3", "4", "5", "6"] },
            { key: "prereq", label: "All Prereqs", options: ["With", "Without"] },
            { key: "program", label: "All Programs", options: programCodes },
          ]
        }}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">No Subjects Found</div>
          <div className="empty-text">Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="subject-list">
          {filtered.map(s => (
            <SubjectCard key={s.id} subject={s} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <SubjectDetails subject={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}