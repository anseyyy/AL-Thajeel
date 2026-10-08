"use client";

import { useState } from "react";
import { LuPlus, LuX, LuCheck } from "react-icons/lu";

export default function PropertyFeaturesInput({ features = [], onChange }) {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = (e) => {
    e?.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    if (!features.includes(trimmed)) {
      onChange([...features, trimmed]);
    }
    setInputVal("");
  };

  const handleRemove = (indexToRemove) => {
    onChange(features.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Input Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Private pool, Sea view, Maid's room..."
          className="flex-1 px-4 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] placeholder-[#60788A]/70 focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all font-medium"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-[#3368A0] hover:bg-[#285781] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <LuPlus className="text-sm" />
          <span>Add</span>
        </button>
      </div>

      {/* Feature tags list */}
      {features.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {features.map((feat, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8DFDB]/35 border border-[rgba(51,104,160,0.18)] text-xs font-semibold text-[#18324A] group hover:border-[#3368A0] transition-all"
            >
              <LuCheck className="text-[#3368A0] text-xs shrink-0" />
              <span>{feat}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 text-[#60788A] hover:text-red-600 transition-colors p-0.5"
                title="Remove feature"
              >
                <LuX className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#60788A] italic">
          No features added yet. Type a feature and click Add.
        </p>
      )}
    </div>
  );
}
