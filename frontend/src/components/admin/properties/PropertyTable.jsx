"use client";

import Link from "next/link";
import PropertyStatusBadge from "./PropertyStatusBadge";
import {
  LuPencil,
  LuTrash2,
  LuBed,
  LuBath,
  LuMaximize,
  LuCheck,
  LuRotateCcw,
  LuImage,
  LuEye,
  LuEyeOff,
  LuTag,
} from "react-icons/lu";

export default function PropertyTable({
  properties,
  isLoading,
  onStatusChange,
  onPublishToggle,
  onDeleteClick,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] p-8 text-center space-y-4 font-sans">
        <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[0.92rem] text-[#60788A]">Loading properties...</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] p-12 text-center font-sans space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#C8DFDB]/40 text-[#3368A0] border border-[rgba(51,104,160,0.2)] flex items-center justify-center mx-auto text-2xl">
          <LuImage />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#18324A]">
            No properties found
          </h3>
          <p className="text-[0.88rem] text-[#60788A] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new real estate property.
          </p>
        </div>
        <Link
          href="/admin/dashboard/properties/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white text-sm font-semibold shadow-md transition-all no-underline"
        >
          <span>+ Add Property</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#C8DFDB] border-b border-[rgba(51,104,160,0.20)] text-[#18324A] text-[0.78rem] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-3 text-center w-12">#</th>
                <th className="py-3.5 px-4 w-20">Preview</th>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Type / Purpose</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(51,104,160,0.12)] text-[0.88rem] text-[#18324A]">
              {properties.map((property, index) => {
                const coverImgUrl =
                  property.coverImage?.url ||
                  property.images?.[0]?.url ||
                  "/images/logo/althajeellogo.webp";

                return (
                  <tr
                    key={property._id}
                    className="hover:bg-[rgba(200,223,219,0.25)] transition-colors group"
                  >
                    {/* Serial Number */}
                    <td className="py-4 px-3 align-middle text-center font-bold text-[#60788A] text-xs">
                      {index + 1}
                    </td>

                    {/* Thumbnail */}
                    <td className="py-4 px-4 align-middle">
                      <div className="w-16 h-12 rounded-lg bg-[#C8DFDB]/30 overflow-hidden border border-[rgba(51,104,160,0.16)] relative shrink-0">
                        <img
                          src={coverImgUrl}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </td>

                    {/* Title & Info */}
                    <td className="py-4 px-4 align-middle min-w-[220px]">
                      <div className="font-serif font-bold text-[#18324A] text-[0.98rem] leading-snug line-clamp-1">
                        {property.title}
                      </div>
                      <div className="flex items-center gap-3 text-[0.76rem] text-[#60788A] mt-1 font-sans font-medium">
                        {property.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <LuBed className="text-[#3368A0]" /> {property.bedrooms} Beds
                          </span>
                        )}
                        {property.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <LuBath className="text-[#3368A0]" /> {property.bathrooms} Baths
                          </span>
                        )}
                        {property.area > 0 && (
                          <span className="flex items-center gap-1">
                            <LuMaximize className="text-[#3368A0]" /> {property.area.toLocaleString()}{" "}
                            {property.areaUnit || "sq.ft"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type & Purpose */}
                    <td className="py-4 px-4 align-middle">
                      <div className="capitalize font-semibold text-[#18324A]">
                        {property.propertyType}
                      </div>
                      <div className="text-[0.76rem] text-[#60788A] uppercase font-bold tracking-wider">
                        For {property.purpose}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 align-middle">
                      <div className="text-[#18324A] font-semibold line-clamp-1">
                        {property.location?.community || property.location?.city || "UAE"}
                      </div>
                      <div className="text-[0.76rem] text-[#60788A] font-medium">
                        {property.location?.emirate || "Dubai"}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 align-middle font-semibold">
                      <div className="text-[#3368A0] font-bold text-[0.96rem]">
                        {property.currency || "AED"}{" "}
                        {property.price?.toLocaleString()}
                      </div>
                      {property.priceLabel && (
                        <div className="text-[0.72rem] text-[#60788A] font-normal">
                          {property.priceLabel}
                        </div>
                      )}
                    </td>

                    {/* Status & Badges */}
                    <td className="py-4 px-4 align-middle">
                      <PropertyStatusBadge
                        status={property.status}
                        isFeatured={property.isFeatured}
                        published={property.published}
                      />
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Sold / Reactivate Button */}
                        {property.status === "sold" ? (
                          <button
                            type="button"
                            onClick={() => onStatusChange(property._id, "active")}
                            title="Reactivate Property (Set to Active)"
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LuRotateCcw className="text-xs" />
                            <span>Active</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStatusChange(property._id, "sold")}
                            title="Mark as Sold"
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LuTag className="text-xs" />
                            <span>Sold</span>
                          </button>
                        )}

                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            onPublishToggle(property._id, !property.published)
                          }
                          title={property.published ? "Unpublish" : "Publish"}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            property.published
                              ? "text-[#3368A0] bg-[#C8DFDB]/40 hover:bg-[#C8DFDB]"
                              : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                          }`}
                        >
                          {property.published ? (
                            <LuEye className="text-sm" />
                          ) : (
                            <LuEyeOff className="text-sm" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <Link
                          href={`/admin/dashboard/properties/${property._id}`}
                          title="Edit Property"
                          className="p-2 rounded-lg text-[#18324A] bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <LuPencil className="text-sm" />
                        </Link>



                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteClick(property)}
                          title="Delete Property"
                          className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <LuTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-4 md:hidden font-sans">
        {properties.map((property) => {
          const coverImgUrl =
            property.coverImage?.url ||
            property.images?.[0]?.url ||
            "/images/logo/althajeellogo.webp";

          return (
            <div
              key={property._id}
              className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] p-4 shadow-[0_4px_14px_rgba(51,104,160,0.06)] space-y-3.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-20 h-16 rounded-xl bg-[#C8DFDB]/30 overflow-hidden border border-[rgba(51,104,160,0.16)] shrink-0">
                  <img
                    src={coverImgUrl}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-[#18324A] text-base line-clamp-1">
                    {property.title}
                  </h4>
                  <div className="text-[#3368A0] font-bold text-[0.92rem] mt-0.5">
                    {property.currency || "AED"} {property.price?.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#60788A] capitalize mt-0.5 font-medium">
                    {property.propertyType} · For {property.purpose}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(51,104,160,0.12)] text-xs text-[#60788A]">
                <span className="font-medium">
                  {property.location?.community || property.location?.emirate || "UAE"}
                </span>
                <PropertyStatusBadge
                  status={property.status}
                  isFeatured={property.isFeatured}
                  published={property.published}
                />
              </div>

              {/* Mobile Actions Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[rgba(51,104,160,0.12)]">
                <div className="flex items-center gap-1.5">
                  {property.status === "sold" ? (
                    <button
                      type="button"
                      onClick={() => onStatusChange(property._id, "active")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200"
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStatusChange(property._id, "sold")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200"
                    >
                      Mark Sold
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onPublishToggle(property._id, !property.published)
                    }
                    className="p-1.5 rounded-lg text-[#3368A0] bg-[#C8DFDB]/40"
                    title={property.published ? "Unpublish" : "Publish"}
                  >
                    {property.published ? <LuEye /> : <LuEyeOff />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/dashboard/properties/${property._id}`}
                    className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-[#18324A]"
                  >
                    <LuPencil className="text-sm" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteClick(property)}
                    className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600"
                  >
                    <LuTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
