"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionHead from "@/components/common/SectionHead";
import PropertyCard from "@/components/common/PropertyCard";
import { properties as fallbackProperties } from "@/data/properties";
import { api } from "@/lib/api";
import { LuArrowRight } from "react-icons/lu";

export default function FeaturedProperties() {
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.public.getProperties({
          featured: "true",
          limit: 3,
        });

        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.slice(0, 3).map((p) => {
            const imgList = (p.images || []).map((img) =>
              typeof img === "string" ? img : img.url
            );
            if (p.coverImage?.url && !imgList.includes(p.coverImage.url)) {
              imgList.unshift(p.coverImage.url);
            }

            return {
              id: p.slug || p._id,
              type: p.propertyType,
              tag: p.propertyType ? p.propertyType.toUpperCase() : "FEATURED",
              categoryLabel: p.propertyType
                ? p.propertyType.charAt(0).toUpperCase() + p.propertyType.slice(1)
                : "Property",
              title: p.title,
              price: `${p.currency || "AED"} ${p.price?.toLocaleString()}`,
              priceSubtitle:
                p.priceLabel || `${p.currency || "AED"} ${p.price?.toLocaleString()}`,
              area: p.area ? `${p.area} ${p.areaUnit || "sq.ft"}` : "",
              location:
                [p.location?.community, p.location?.emirate].filter(Boolean).join(", ") ||
                "Dubai, UAE",
              description: p.description,
              shortDescription: p.description?.slice(0, 140),
              images: imgList,
              photosCount: imgList.length || 1,
            };
          });
          setFeaturedList(mapped);
        } else {
          // Fallback to static mock data if database has no featured properties yet
          setFeaturedList(fallbackProperties.filter((p) => p.featured).slice(0, 3));
        }
      } catch (err) {
        console.warn("Featured properties API fetch, using fallback data:", err);
        setFeaturedList(fallbackProperties.filter((p) => p.featured).slice(0, 3));
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="py-[clamp(3rem,7vw,5.5rem)] w-full">
      <div className="container-width container-padding-x">
        {/* Top Header Row with Section Title and View All Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9.5">
          <SectionHead
            title="Featured this week"
            description={
              <>
                A short list, kept current. Full details and viewings are arranged once you
                <br className="hidden sm:inline" /> reach out.
              </>
            }
            className="mb-0"
          />
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--ink)] border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] transition-all cursor-pointer rounded-none group shrink-0 self-start sm:self-end shadow-xs"
          >
            <span>View All</span>
            <LuArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
          {featuredList.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}
