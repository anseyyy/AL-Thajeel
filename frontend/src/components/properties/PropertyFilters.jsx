"use client";

import React from "react";
import { LuLayoutGrid, LuHouse } from "react-icons/lu";
import {
  MdOutlineVilla,
  MdOutlineApartment,
  MdOutlineStorefront,
  MdOutlineGroups,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const filterOptions = [
  { id: "all", label: "All", icon: LuLayoutGrid },
  { id: "villa", label: "Villas", icon: MdOutlineVilla },
  { id: "house", label: "Houses", icon: LuHouse },
  { id: "apartment", label: "Apartments", icon: MdOutlineApartment },
  { id: "office", label: "Office", icon: HiOutlineBuildingOffice2 },
  { id: "shop", label: "Shops", icon: MdOutlineStorefront },
  { id: "labour", label: "Labour", icon: MdOutlineGroups },
];

export default function PropertyFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="w-full mb-10 flex items-center justify-center">
      <div
        id="filters"
        className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 max-w-full"
      >
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          const Icon = filter.icon;

          return (
            <button
              key={filter.id}
              type="button"
              data-filter={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[0.88rem] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap border outline-none shadow-xs ${
                isActive
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm scale-[1.02]"
                  : "bg-[var(--panel)] text-[var(--sub)] border-[var(--line)] hover:text-[var(--ink)] hover:border-[var(--accent)]/40 hover:bg-[var(--panel)]"
              }`}
            >
              <Icon
                className={`text-[1.1rem] transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-white"
                    : "text-[var(--sub)] group-hover:text-[var(--accent)]"
                }`}
              />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
