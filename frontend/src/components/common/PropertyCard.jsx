function PropertyIllustration({ type }) {
  const commonClasses = "w-full h-[110px] mb-4 stroke-[var(--accent)]";

  switch (type?.toLowerCase()) {
    case "villa":
    case "villas":
      return (
        <svg viewBox="0 0 200 110" fill="none" className={commonClasses} aria-hidden="true">
          <polygon points="20,60 100,20 180,60" strokeWidth="2" />
          <rect x="35" y="60" width="130" height="42" strokeWidth="2" />
          <rect x="90" y="72" width="20" height="30" strokeWidth="1.5" />
        </svg>
      );
    case "flat":
    case "flats":
      return (
        <svg viewBox="0 0 200 110" fill="none" className={commonClasses} aria-hidden="true">
          <rect x="30" y="35" width="140" height="65" strokeWidth="2" />
          <rect x="55" y="55" width="24" height="45" strokeWidth="1.5" />
          <rect x="120" y="55" width="24" height="20" strokeWidth="1.5" />
        </svg>
      );
    case "kiosk":
    case "kiosks":
      return (
        <svg viewBox="0 0 200 110" fill="none" className={commonClasses} aria-hidden="true">
          <rect x="55" y="45" width="90" height="50" strokeWidth="2" />
          <rect x="70" y="60" width="60" height="20" strokeWidth="1.5" />
        </svg>
      );
    case "warehouse":
    case "warehouses":
      return (
        <svg viewBox="0 0 200 110" fill="none" className={commonClasses} aria-hidden="true">
          <rect x="20" y="40" width="160" height="60" strokeWidth="2" />
          <polygon points="20,40 100,15 180,40" strokeWidth="2" />
          <rect x="80" y="65" width="40" height="35" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 110" fill="none" className={commonClasses} aria-hidden="true">
          <rect x="30" y="35" width="140" height="65" strokeWidth="2" />
          <rect x="55" y="55" width="24" height="45" strokeWidth="1.5" />
        </svg>
      );
  }
}

export default function PropertyCard({
  type,
  tag,
  title,
  price,
  details,
  description,
}) {
  const displayTag =
    tag || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "");
  const displayPrice = price || details;

  return (
    <div
      className="border border-[var(--line)] rounded-[2px] p-5.5 bg-[var(--panel)] transition-all duration-200 hover:border-[var(--accent)] hover:shadow-sm"
      data-type={type}
    >
      {displayTag && (
        <span className="inline-block text-[0.72rem] text-[var(--accent)] border border-[var(--accent)] rounded-full py-0.5 px-2.5 mb-2.5 font-medium">
          {displayTag}
        </span>
      )}
      <PropertyIllustration type={type} />
      <h3 className="font-serif text-[1.15rem] font-semibold my-1 text-[var(--ink)]">
        {title}
      </h3>
      {displayPrice && (
        <div className="text-[var(--accent)] font-semibold text-[0.95rem] mb-1.5">
          {displayPrice}
        </div>
      )}
      {description && (
        <p className="text-[var(--sub)] text-[0.9rem] m-0 leading-[1.5]">
          {description}
        </p>
      )}
    </div>
  );
}
