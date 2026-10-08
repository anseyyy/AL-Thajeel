import Link from "next/link";
import {
  LuImage,
  LuMaximize2,
  LuMapPin,
  LuChevronRight,
  LuHouse,
} from "react-icons/lu";
import {
  MdOutlineVilla,
  MdOutlineApartment,
  MdOutlineStorefront,
  MdOutlineGroups,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

function getCategoryIcon(type) {
  switch (type?.toLowerCase()) {
    case "villa":
    case "villas":
      return MdOutlineVilla;
    case "house":
    case "houses":
      return LuHouse;
    case "apartment":
    case "apartments":
    case "flat":
    case "flats":
      return MdOutlineApartment;
    case "office":
    case "offices":
      return HiOutlineBuildingOffice2;
    case "shop":
    case "shops":
    case "kiosk":
    case "kiosks":
      return MdOutlineStorefront;
    case "labour":
      return MdOutlineGroups;
    default:
      return LuHouse;
  }
}

export default function PropertyCard({
  id,
  type,
  tag,
  categoryLabel,
  title,
  price,
  priceSubtitle,
  area,
  location,
  description,
  shortDescription,
  images = [],
}) {
  const CategoryIcon = getCategoryIcon(type);
  const displayTag = tag || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "Property");
  const displayPrice = priceSubtitle || price;
  const displayDesc = shortDescription || description;
  const propertyUrl = `/properties/${id || "palm-jumeirah-villa"}`;

  // Normalize image urls
  const actualImages = (images || [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  const photosCount = actualImages.length;
  const mainImage = actualImages[0];
  const subImages = actualImages.slice(1, 4); // Max 3 thumbnails below main image
  const remainingCount = photosCount > 4 ? photosCount - 4 : 0;

  return (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-none p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[var(--accent)]/50 group">
      <div>
        {/* Top Image Gallery Area */}
        <div className="relative">
          {/* Main Hero Image / Placeholder */}
          <Link
            href={propertyUrl}
            className="block relative w-full aspect-[16/10] rounded-none overflow-hidden bg-gradient-to-br from-[#1c1d22] to-[#0d0e11] group-hover:brightness-105 transition-all border-0 outline-none"
          >
            {mainImage ? (
              <img
                src={mainImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover border-0 outline-none"
              />
            ) : (
              /* No Image Placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none border-0">
                <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center mb-2 text-white/40 group-hover:text-[var(--gold)] group-hover:scale-105 transition-all">
                  <LuImage className="text-2xl" />
                </div>
                <span className="text-[0.78rem] tracking-wider uppercase text-white/50 font-medium">
                  No Image Available
                </span>
              </div>
            )}

            {/* Top Left Tag Badge */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="inline-block px-3 py-1 bg-white/95 text-[var(--accent)] text-xs font-semibold rounded-none shadow-xs tracking-wide">
                {displayTag}
              </span>
            </div>

            {/* Bottom Right Photo Count Badge (only if images exist) */}
            {photosCount > 0 && (
              <div className="absolute bottom-3 right-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[0.75rem] font-medium rounded-none shadow-xs">
                  <LuImage className="text-xs" />
                  <span>
                    {photosCount} {photosCount === 1 ? "photo" : "photos"}
                  </span>
                </span>
              </div>
            )}
          </Link>

          {/* Sub-Thumbnails Row: Always strictly 3-column slots (1/3 card size each, never full-width) */}
          {subImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {subImages.map((src, idx) => {
                const isLastWithOverflow = idx === 2 && remainingCount > 0;

                return (
                  <div
                    key={idx}
                    className="relative h-16 w-full rounded-none bg-[#18191d] overflow-hidden flex items-center justify-center border-0 outline-none"
                  >
                    <img
                      src={src}
                      alt={`${title} view ${idx + 2}`}
                      className="absolute inset-0 w-full h-full object-cover border-0 outline-none"
                    />

                    {/* Overflow Photos Overlay */}
                    {isLastWithOverflow && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center text-white font-semibold text-xs tracking-wider z-10">
                        +{remainingCount + 1} photos
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Title & Pricing */}
        <div className="mt-4.5">
          <Link href={propertyUrl} className="no-underline group-hover:text-[var(--accent)] transition-colors">
            <h3 className="font-serif font-bold text-[1.28rem] text-[var(--ink)] leading-snug mb-1">
              {title}
            </h3>
          </Link>
          <div className="text-[var(--accent)] font-semibold text-[1.05rem] mb-2">
            {displayPrice}
          </div>
          {displayDesc && (
            <p className="text-[var(--sub)] text-[0.88rem] line-clamp-2 leading-relaxed m-0 mb-4">
              {displayDesc}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Specs & Action Section */}
      <div>
        <div className="border-t border-[var(--line)] pt-3.5 mb-4">
          <div className="flex items-center justify-between text-[0.84rem] text-[var(--sub)] gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <CategoryIcon className="text-base text-[var(--accent)] shrink-0" />
              <span>{categoryLabel || displayTag}</span>
            </span>

            {area && (
              <span className="flex items-center gap-1.5">
                <LuMaximize2 className="text-base text-[var(--accent)] shrink-0" />
                <span>{area}</span>
              </span>
            )}

            {location && (
              <span className="flex items-center gap-1.5 truncate max-w-[130px]">
                <LuMapPin className="text-base text-[var(--accent)] shrink-0" />
                <span className="truncate">{location}</span>
              </span>
            )}
          </div>
        </div>

        {/* View details CTA Button */}
        <Link
          href={propertyUrl}
          className="inline-flex items-center justify-between gap-2.5 bg-[var(--gold)] text-[var(--gold-ink)] py-2.5 px-5 rounded-none font-semibold text-[0.92rem] no-underline transition-all hover:brightness-105 active:scale-95 shadow-xs"
        >
          <span>View details</span>
          <LuChevronRight className="text-base" />
        </Link>
      </div>
    </div>
  );
}
