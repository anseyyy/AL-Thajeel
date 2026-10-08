"use client";

import { LuSparkles } from "react-icons/lu";

export default function PropertyStatusBadge({ status, isFeatured, published }) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(102,163,191,0.18)] text-[#3368A0] border border-[rgba(51,104,160,0.22)] font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3368A0] animate-pulse" />
            Active
          </span>
        );
      case "sold":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Sold
          </span>
        );
      case "inactive":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8E8E4] text-[#60788A] border border-gray-200 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60788A]" />
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      {getStatusBadge()}
      
      {isFeatured && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold bg-[#C8DFDB] text-[#3368A0] border border-[rgba(51,104,160,0.20)] font-sans">
          <LuSparkles className="text-xs text-[#3368A0]" />
          Featured
        </span>
      )}

      {published === false && status !== "sold" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium bg-amber-50 text-amber-700 border border-amber-200 font-sans">
          Unpublished
        </span>
      )}
    </div>
  );
}
