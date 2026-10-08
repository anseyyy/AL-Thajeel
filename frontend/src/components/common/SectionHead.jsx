export default function SectionHead({ title, description, subtitle, className = "" }) {
  const descText = description || subtitle;
  return (
    <div className={`max-w-[560px] ${className ? className : "mb-9.5"}`}>
      {title && (
        <h2 className="font-serif font-semibold text-[clamp(1.6rem,3vw,2.2rem)] mb-2.5 text-[var(--ink)] leading-tight">
          {title}
        </h2>
      )}
      {descText && (
        <p className="text-[var(--sub)] m-0 leading-[1.55] text-[0.95rem]">
          {descText}
        </p>
      )}
    </div>
  );
}
