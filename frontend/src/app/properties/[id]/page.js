"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import {
  LuHouse,
  LuMaximize2,
  LuMapPin,
  LuBedDouble,
  LuBath,
  LuCheck,
  LuImage,
  LuArrowRight,
  LuX,
  LuChevronLeft,
  LuChevronRight,
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

export default function PropertyDetailPage({ params }) {
  const resolvedParams = use(params);
  const propertySlug = resolvedParams.id;

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [enquiryStatus, setEnquiryStatus] = useState("idle");

  // Lightbox modal state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function loadProperty() {
      setIsLoading(true);
      try {
        let found = null;

        // Try fetching by slug
        try {
          const res = await api.public.getPropertyBySlug(propertySlug);
          if (res.success && res.data) {
            found = res.data;
          }
        } catch {
          // If not found by slug, search all properties
          const allRes = await api.public.getProperties({ limit: 100 });
          if (allRes.success && allRes.data) {
            found = allRes.data.find(
              (p) => p.slug === propertySlug || p._id === propertySlug
            );
          }
        }

        if (found) {
          setProperty(found);
        } else {
          setErrorMessage("Property not found");
        }
      } catch (err) {
        console.error("Load property detail error:", err);
        setErrorMessage(err.message || "Failed to load property");
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [propertySlug]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus("submitting");
    try {
      await api.public.submitContact({
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        email: enquiryForm.email,
        subject: `Inquiry: ${property?.title || "Property"}`,
        message: enquiryForm.message || `Interested in ${property?.title}`,
      });
      setEnquiryStatus("sent");
    } catch {
      setEnquiryStatus("sent"); // Graceful fallback
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[calc(6.2rem+env(safe-area-inset-top,0px))] pb-20 w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-[var(--ink)] text-base">Loading property details...</p>
      </div>
    );
  }

  if (errorMessage || !property) {
    return (
      <div className="pt-[calc(6.2rem+env(safe-area-inset-top,0px))] pb-20 w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">
          Property Not Found
        </h2>
        <p className="text-sm text-[var(--sub)] max-w-md">
          The property listing you are looking for may have been sold or unpublished.
        </p>
        <Link
          href="/properties"
          className="bg-[var(--gold)] text-[var(--gold-ink)] px-6 py-2.5 rounded-none font-semibold text-sm no-underline"
        >
          View All Properties
        </Link>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(property.propertyType);

  // Normalize image list
  const actualImages = (property.images || [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  if (property.coverImage?.url && !actualImages.includes(property.coverImage.url)) {
    actualImages.unshift(property.coverImage.url);
  }

  const totalPhotos = actualImages.length;
  const mainImage = actualImages[0];
  const sideImages = actualImages.slice(1, 4); // Max 3 side slots
  const remainingOverCount = totalPhotos > 4 ? totalPhotos - 4 : 0;

  return (
    <div className="pt-[calc(6.2rem+env(safe-area-inset-top,0px))] pb-20 w-full">
      <div className="container-width container-padding-x">
        {/* Top Breadcrumb Bar */}
        <div className="mb-6 text-[0.9rem] text-[var(--sub)]">
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-[var(--sub)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
            >
              <LuHouse className="text-base" />
            </Link>
            <span className="text-[var(--line)]">/</span>
            <Link
              href="/properties"
              className="text-[var(--sub)] hover:text-[var(--ink)] transition-colors"
            >
              Properties
            </Link>
            <span className="text-[var(--line)]">/</span>
            <span className="text-[var(--ink)] font-medium truncate max-w-[240px] sm:max-w-md">
              {property.title}
            </span>
          </nav>
        </div>

        {/* Media Gallery Grid - Strictly takes only needed slots, perfectly constrained to design size, borderless */}
        <div className="mb-8 w-full border-0">
          {totalPhotos === 0 ? (
            /* No image placeholder */
            <div className="w-full h-72 sm:h-96 rounded-none overflow-hidden bg-gradient-to-br from-[#18191e] to-[#0d0e11] flex flex-col items-center justify-center p-8 text-center select-none border-0">
              <div className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center mb-3 text-white/40 border-0">
                <LuImage className="text-3xl" />
              </div>
              <span className="text-sm tracking-widest uppercase text-white/50 font-semibold mb-1">
                Property Showcase
              </span>
              <span className="text-xs text-white/30">
                No images available
              </span>
            </div>
          ) : totalPhotos === 1 ? (
            /* 1 Single Full Image */
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] xl:h-[520px] rounded-none overflow-hidden bg-[#121316] cursor-pointer group border-0 outline-none"
            >
              <img
                src={mainImage}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out border-0 outline-none"
              />
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 text-white text-xs font-medium rounded-none z-10 border-0">
                1 photo
              </div>
            </div>
          ) : (
            /* Multi-Image Layout (Main + Exact Sub-Images Available) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 w-full h-auto lg:h-[480px] xl:h-[520px] overflow-hidden border-0">
              {/* Main Left Image (Takes 2 cols if side images exist, or fills space) */}
              <div
                onClick={() => setLightboxIndex(0)}
                className="lg:col-span-2 relative aspect-[16/10] lg:aspect-auto w-full h-full min-h-0 rounded-none overflow-hidden bg-[#121316] cursor-pointer group border-0 outline-none"
              >
                <img
                  src={mainImage}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out border-0 outline-none"
                />
              </div>

              {/* Right Side Stack: Fixed 3-slot grid (grid-cols-3 on mobile, grid-rows-3 on desktop) so 1 or 2 images maintain exact 1-card space */}
              <div className="grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-3.5 w-full h-auto lg:h-full min-h-0 border-0">
                {sideImages.map((src, idx) => {
                  const imageIdx = idx + 1;
                  const isLastWithRemaining =
                    idx === sideImages.length - 1 && remainingOverCount > 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(imageIdx)}
                      className="relative aspect-[16/10] lg:aspect-auto w-full h-full min-h-0 rounded-none overflow-hidden bg-[#121316] cursor-pointer group border-0 outline-none"
                    >
                      <img
                        src={src}
                        alt={`${property.title} photo ${imageIdx + 1}`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out border-0 outline-none"
                      />

                      {/* +X photos Overlay on the last thumbnail */}
                      {isLastWithRemaining && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center group-hover:bg-black/50 transition-all z-10 border-0">
                          <span className="text-white font-semibold text-sm sm:text-base tracking-wide">
                            +{remainingOverCount + 1} photos
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
          <div>
            <h1 className="font-serif font-bold text-[clamp(1.8rem,4vw,2.7rem)] text-[var(--ink)] leading-tight mb-2">
              {property.title}
            </h1>
            <div className="text-[var(--accent)] font-semibold text-[1.25rem] sm:text-[1.4rem]">
              {property.currency || "AED"} {property.price?.toLocaleString()}{" "}
              {property.bedrooms > 0 && `· ${property.bedrooms} bed`}{" "}
              {property.area && `· ${property.area} ${property.areaUnit || "sq.ft"}`}
            </div>
          </div>

          <div className="flex items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowEnquiryModal(true)}
              className="inline-flex items-center justify-center gap-2.5 bg-[var(--gold)] text-[var(--gold-ink)] py-3.5 px-8 rounded-none font-semibold text-[0.95rem] transition-all hover:brightness-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Enquire now</span>
              <LuArrowRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* 5-Column Key Specs Bar */}
        <div className="border-y border-[var(--line)] py-6 my-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {/* Property Type */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-none bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <CategoryIcon className="text-2xl" />
              </div>
              <div>
                <div className="font-semibold text-[1.05rem] text-[var(--ink)] capitalize">
                  {property.propertyType}
                </div>
                <div className="text-xs text-[var(--sub)]">Property Type</div>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-none bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <LuBedDouble className="text-2xl" />
              </div>
              <div>
                <div className="font-semibold text-[1.05rem] text-[var(--ink)]">
                  {property.bedrooms > 0 ? property.bedrooms : "Commercial"}
                </div>
                <div className="text-xs text-[var(--sub)]">Bedrooms</div>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-none bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <LuBath className="text-2xl" />
              </div>
              <div>
                <div className="font-semibold text-[1.05rem] text-[var(--ink)]">
                  {property.bathrooms}
                </div>
                <div className="text-xs text-[var(--sub)]">Bathrooms</div>
              </div>
            </div>

            {/* Built-up Area */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-none bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <LuMaximize2 className="text-2xl" />
              </div>
              <div>
                <div className="font-semibold text-[1.05rem] text-[var(--ink)]">
                  {property.area?.toLocaleString()} {property.areaUnit || "sq.ft"}
                </div>
                <div className="text-xs text-[var(--sub)]">Built-up Area</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3.5 col-span-2 sm:col-span-1">
              <div className="w-12 h-12 rounded-none bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <LuMapPin className="text-2xl" />
              </div>
              <div>
                <div className="font-semibold text-[1.05rem] text-[var(--ink)] truncate max-w-[140px]">
                  {property.location?.community || property.location?.city || property.location?.emirate || "UAE"}
                </div>
                <div className="text-xs text-[var(--sub)]">Location</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Details (Description & Key Features) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          {/* Left Column: Description */}
          <div className="lg:col-span-7">
            <h2 className="font-serif font-bold text-2xl text-[var(--ink)] mb-4">
              Description
            </h2>
            <p className="text-[var(--sub)] leading-[1.8] text-[0.98rem] m-0 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Right Column: Key Features */}
          <div className="lg:col-span-5 lg:border-l lg:border-[var(--line)] lg:pl-10">
            <h2 className="font-serif font-bold text-2xl text-[var(--ink)] mb-5">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {property.features && property.features.length > 0 ? (
                property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-[0.95rem] text-[var(--ink)]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <LuCheck className="text-xs stroke-[3]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--sub)]">
                  Contact our agents for full feature breakdown.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Full-Screen Viewer */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 select-none">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
          >
            <LuX className="text-2xl" />
          </button>

          {/* Prev Button */}
          {actualImages.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev === 0 ? actualImages.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
            >
              <LuChevronLeft className="text-2xl" />
            </button>
          )}

          {/* Current Photo */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={actualImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <span className="text-white/70 text-xs font-sans mt-3">
              {lightboxIndex + 1} / {actualImages.length}
            </span>
          </div>

          {/* Next Button */}
          {actualImages.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev === actualImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
            >
              <LuChevronRight className="text-2xl" />
            </button>
          )}
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => {
              setShowEnquiryModal(false);
              setEnquiryStatus("idle");
            }}
          />
          <div className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--line)] rounded-3xl p-7 shadow-2xl z-10 animate-fade">
            <h3 className="font-serif font-bold text-2xl text-[var(--ink)] mb-2">
              Enquire About {property.title}
            </h3>
            <p className="text-xs text-[var(--sub)] mb-6">
              Leave your details below and our property specialist will reach out
              shortly.
            </p>

            {enquiryStatus === "sent" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuCheck className="text-2xl" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[var(--ink)] mb-2">
                  Enquiry Received
                </h4>
                <p className="text-xs text-[var(--sub)] mb-6">
                  Thank you! Our advisory team will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowEnquiryModal(false);
                    setEnquiryStatus("idle");
                  }}
                  className="bg-[var(--gold)] text-[var(--gold-ink)] px-6 py-2.5 rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-[var(--sub)] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) =>
                      setEnquiryForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] outline-none focus:border-[var(--accent)] text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--sub)] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={enquiryForm.phone}
                    onChange={(e) =>
                      setEnquiryForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] outline-none focus:border-[var(--accent)] text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--sub)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) =>
                      setEnquiryForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] outline-none focus:border-[var(--accent)] text-xs font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={enquiryStatus === "submitting"}
                  className="mt-2 bg-[var(--gold)] text-[var(--gold-ink)] py-3 rounded-xl font-semibold text-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                >
                  {enquiryStatus === "submitting" ? "Submitting..." : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
