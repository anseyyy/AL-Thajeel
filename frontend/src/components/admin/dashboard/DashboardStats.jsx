"use client";

import StatCard from "./StatCard";
import {
  LuBuilding2,
  LuCircleCheck,
  LuPercent,
} from "react-icons/lu";

export default function DashboardStats({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-white border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] animate-pulse p-6 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <StatCard
        title="Total Properties"
        value={stats?.total ?? 0}
        description="All registered properties"
        icon={LuBuilding2}
      />
      <StatCard
        title="Active"
        value={stats?.active ?? 0}
        description="Publicly listed"
        icon={LuCircleCheck}
      />
      <StatCard
        title="Sold"
        value={stats?.sold ?? 0}
        description="Completed deals"
        icon={LuPercent}
      />
    </div>
  );
}
