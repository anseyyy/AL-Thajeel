const filterOptions = [
  { id: "all", label: "All" },
  { id: "villa", label: "Villas" },
  { id: "flat", label: "Flats" },
  { id: "kiosk", label: "Kiosks" },
  { id: "warehouse", label: "Warehouses" },
];

export default function PropertyFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-8" id="filters">
      {filterOptions.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            data-filter={filter.id}
            className={`font-sans text-[0.86rem] py-2 px-4 rounded-full border cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
              isActive
                ? "bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] font-medium shadow-sm"
                : "border-[var(--line)] bg-transparent text-[var(--sub)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
