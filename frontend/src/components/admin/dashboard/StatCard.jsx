"use client";

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  role = "primary",
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.08)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(51,104,160,0.12)] hover:-translate-y-0.5 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.84rem] font-bold tracking-wider text-[#60788A] uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-lg border border-[rgba(51,104,160,0.12)]">
            <Icon />
          </div>
        )}
      </div>

      <div>
        <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3368A0] tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-[0.8rem] text-[#60788A] mt-1.5 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
