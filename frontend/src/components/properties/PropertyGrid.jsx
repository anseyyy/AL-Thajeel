"use client";

import { useState, useEffect, useCallback } from "react";
import PropertyCard from "@/components/common/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { api } from "@/lib/api";
import { LuBuilding2 } from "react-icons/lu";

export default function PropertyGrid() {
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.public.getProperties({
        type: filter !== "all" ? filter : undefined,
        limit: 50,
      });

      if (res.success && res.data) {
        const mapped = res.data.map((p) => {
          const imgList = (p.images || []).map((img) =>
            typeof img === "string" ? img : img.url
          );
          if (p.coverImage?.url && !imgList.includes(p.coverImage.url)) {
            imgList.unshift(p.coverImage.url);
          }

          return {
            id: p.slug || p._id,
            type: p.propertyType,
            tag: p.propertyType ? p.propertyType.toUpperCase() : "PROPERTY",
            categoryLabel: p.propertyType
              ? p.propertyType.charAt(0).toUpperCase() + p.propertyType.slice(1)
              : "Property",
            title: p.title,
            price: `${p.currency || "AED"} ${p.price?.toLocaleString()}`,
            priceSubtitle:
              p.priceLabel ||
              `${p.currency || "AED"} ${p.price?.toLocaleString()}`,
            area: p.area ? `${p.area} ${p.areaUnit || "sq.ft"}` : "",
            location:
              [p.location?.community, p.location?.emirate]
                .filter(Boolean)
                .join(", ") || "Dubai, UAE",
            description: p.description,
            shortDescription: p.description?.slice(0, 140),
            images: imgList,
          };
        });
        setProperties(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch public properties:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <>
      <PropertyFilters activeFilter={filter} onFilterChange={setFilter} />

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--sub)] font-sans">
            Loading properties...
          </p>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[var(--panel)] border border-[var(--line)] p-12">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto text-xl">
            <LuBuilding2 />
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--ink)]">
            No properties found
          </h3>
          <p className="text-xs text-[var(--sub)] max-w-sm mx-auto">
            There are currently no listings in this category. Please select
            another category or check back soon.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5"
          id="propertyGrid"
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      )}
    </>
  );
}

