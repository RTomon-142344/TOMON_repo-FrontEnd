export default function FilterBar({ search, onSearch, filters, onFilter, filterOptions }) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={filterOptions.searchPlaceholder || "Search..."}
        />
      </div>
      {filterOptions.selects?.map(sel => (
        <select
          key={sel.key}
          className="filter-select"
          value={filters[sel.key] || ""}
          onChange={e => onFilter(sel.key, e.target.value)}
        >
          <option value="">{sel.label}</option>
          {sel.options.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ))}
    </div>
  );
}