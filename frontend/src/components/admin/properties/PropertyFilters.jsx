"use client";

import { LuSearch, LuX } from "react-icons/lu";

export default function PropertyFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
  purpose,
  setPurpose,
  onReset,
}) {
  const statusTabs = [
    { value: "", label: "All Properties" },
    { value: "active", label: "Active" },
    { value: "sold", label: "Sold" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-4 font-sans mb-6">
      {/* Top row: Search and Selects */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#60788A]">
            <LuSearch className="text-base" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, community, or description..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] placeholder-[#60788A]/70 focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#60788A] hover:text-[#18324A]"
            >
              <LuX className="text-sm" />
            </button>
          )}
        </div>

        {/* Property Type Selector */}
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all cursor-pointer min-w-[130px]"
          >
            <option value="">All Types</option>
            <option value="villa">Villa</option>
            <option value="flat">Flat</option>
            <option value="kiosk">Kiosk</option>
            <option value="warehouse">Warehouse</option>
          </select>

          {/* Purpose Selector */}
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all cursor-pointer min-w-[120px]"
          >
            <option value="">All Purpose</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Reset Filters button if any active */}
          {(search || status || type || purpose) && (
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-2.5 bg-[#C8DFDB]/40 hover:bg-[#C8DFDB] text-[#3368A0] text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer border border-[rgba(51,104,160,0.16)]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Status filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[rgba(51,104,160,0.12)]">
        <span className="text-xs font-bold text-[#60788A] uppercase tracking-wider mr-2 shrink-0">
          Status:
        </span>
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-[0.82rem] font-semibold transition-all shrink-0 cursor-pointer ${
              status === tab.value
                ? "bg-[#3368A0] text-white border border-[#3368A0] shadow-xs"
                : "bg-white hover:bg-[#C8DFDB]/40 text-[#18324A] hover:text-[#3368A0] border border-[rgba(51,104,160,0.16)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
