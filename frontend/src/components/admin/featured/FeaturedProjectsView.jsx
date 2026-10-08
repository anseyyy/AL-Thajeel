"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import {
  LuStar,
  LuSearch,
  LuBuilding2,
  LuRefreshCw,
  LuCheck,
  LuFilter,
} from "react-icons/lu";

export default function FeaturedProjectsView() {
  const { showSuccess, showError } = useToast();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await api.admin.getProperties({ limit: 100 });
      if (res.success) {
        setProperties(res.data || []);
      }
    } catch (err) {
      console.error("Fetch properties error:", err);
      showError(err.message || "Failed to load properties");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProperties();
  };

  const handleToggleFeatured = async (property) => {
    const nextFeatured = !property.isFeatured;

    // Strict 3 featured properties limit check
    if (nextFeatured) {
      const currentFeaturedCount = properties.filter((p) => p.isFeatured).length;
      if (currentFeaturedCount >= 3) {
        showError(
          "Already 3 properties featured! You can only feature up to 3 properties at a time. Please remove one first."
        );
        return;
      }
    }

    setUpdatingId(property._id);

    // Optimistic UI update
    setProperties((prev) =>
      prev.map((p) =>
        p._id === property._id ? { ...p, isFeatured: nextFeatured } : p
      )
    );

    try {
      const res = await api.admin.updateProperty(property._id, {
        isFeatured: nextFeatured,
      });

      if (res.success) {
        showSuccess(
          nextFeatured
            ? `"${property.title}" is now featured on the homepage showcase.`
            : `"${property.title}" removed from featured showcase.`
        );
      }
    } catch (err) {
      console.error("Toggle featured error:", err);
      showError(err.message || "Failed to update featured status");
      // Rollback on error
      setProperties((prev) =>
        prev.map((p) =>
          p._id === property._id ? { ...p, isFeatured: property.isFeatured } : p
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProperties = properties
    .filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.community?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.emirate?.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterType === "featured") return matchesSearch && item.isFeatured;
      if (filterType === "standard") return matchesSearch && !item.isFeatured;
      return matchesSearch;
    })
    .sort((a, b) => {
      // Featured properties always show first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      // Secondary sort: newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const featuredCount = properties.filter((p) => p.isFeatured).length;

  return (
    <AdminLayout title="Featured Projects">
      <div className="space-y-6 font-sans">

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-xs">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60788A]" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] placeholder:text-[#60788A] focus:outline-none focus:border-[#66A3BF] focus:ring-2 focus:ring-[#66A3BF]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              All ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("featured")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === "featured"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              Featured Only ({featuredCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("standard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === "standard"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              Standard ({properties.length - featuredCount})
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] hover:bg-[#C8DFDB]/40 transition-colors cursor-pointer ml-1 shadow-xs"
              title="Refresh listings"
            >
              <LuRefreshCw className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] p-12 text-center space-y-4 shadow-sm">
            <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#60788A]">Loading properties for featured showcase...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] p-12 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#C8DFDB]/40 text-[#3368A0] flex items-center justify-center mx-auto text-xl">
              <LuBuilding2 />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">No properties found</h3>
            <p className="text-xs text-[#60788A] max-w-sm mx-auto">
              {searchQuery ? "No listings matched your search criteria." : "No properties available to feature."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map((property) => {
              const isUpdating = updatingId === property._id;
              const coverUrl =
                property.coverImage?.url ||
                property.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={property._id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_rgba(51,104,160,0.06)] hover:shadow-md ${
                    property.isFeatured
                      ? "border-[#3368A0] ring-1 ring-[#3368A0]/30"
                      : "border-[rgba(51,104,160,0.16)]"
                  }`}
                >
                  {/* Property Card Header & Image */}
                  <div>
                    <div className="relative h-44 w-full bg-[#F2EFE7] overflow-hidden group">
                      <img
                        src={coverUrl}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-white text-[0.7rem] font-bold uppercase tracking-wider">
                          {property.propertyType}
                        </span>

                        {property.isFeatured && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#3368A0] text-white text-[0.7rem] font-bold flex items-center gap-1 shadow-md">
                            <LuStar className="text-xs fill-white" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-3 text-white font-serif font-bold text-sm drop-shadow-md">
                        {property.currency} {property.price?.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base font-bold text-[#18324A] line-clamp-1">
                          {property.title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#60788A] line-clamp-1">
                        {[property.location?.community, property.location?.emirate]
                          .filter(Boolean)
                          .join(", ") || "United Arab Emirates"}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Component */}
                  <div className="p-4 pt-0">
                    <div className="p-3 rounded-xl bg-[#F2EFE7]/80 border border-[rgba(51,104,160,0.12)] flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[0.72rem] font-bold text-[#18324A] uppercase tracking-wider">
                          FEATURED PROPERTY
                        </div>
                        <p className="text-[0.68rem] text-[#60788A] mt-0.5">
                          Highlight on homepage showcase
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={property.isFeatured}
                        disabled={isUpdating}
                        onClick={() => handleToggleFeatured(property)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                          property.isFeatured ? "bg-[#3368A0]" : "bg-[#D1D5DB]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            property.isFeatured ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
