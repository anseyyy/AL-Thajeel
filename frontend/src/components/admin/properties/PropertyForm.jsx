"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyImageUploader from "./PropertyImageUploader";
import PropertyFeaturesInput from "./PropertyFeaturesInput";
import { useToast } from "@/context/ToastContext";
import {
  LuSave,
  LuArrowLeft,
  LuInfo,
  LuTriangleAlert,
  LuBuilding,
  LuMapPin,
  LuDollarSign,
  LuImage,
  LuSparkles,
} from "react-icons/lu";

export default function PropertyForm({
  initialData = null,
  isEdit = false,
  onSubmit,
  isSubmitting,
}) {
  const router = useRouter();
  const { showError } = useToast();

  // Basic info
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [propertyType, setPropertyType] = useState(
    initialData?.propertyType || "villa"
  );
  const [purpose, setPurpose] = useState(initialData?.purpose || "sale");

  // Details
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms ?? 0);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms ?? 0);
  const [area, setArea] = useState(initialData?.area ?? 0);
  const [areaUnit, setAreaUnit] = useState(initialData?.areaUnit || "sq.ft");

  // Location
  const [emirate, setEmirate] = useState(
    initialData?.location?.emirate || "Dubai"
  );
  const [city, setCity] = useState(initialData?.location?.city || "Dubai");
  const [community, setCommunity] = useState(
    initialData?.location?.community || ""
  );
  const [address, setAddress] = useState(
    initialData?.location?.address || ""
  );

  // Pricing
  const [price, setPrice] = useState(initialData?.price ?? "");
  const [priceLabel, setPriceLabel] = useState(initialData?.priceLabel || "");
  const [currency, setCurrency] = useState(initialData?.currency || "AED");

  // Features
  const [features, setFeatures] = useState(initialData?.features || []);

  // Publishing & Status
  const [status, setStatus] = useState(initialData?.status || "active");
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false
  );
  const [published, setPublished] = useState(
    initialData?.published !== undefined ? initialData.published : true
  );

  // Images state
  const [existingImages, setExistingImages] = useState(
    initialData?.images || []
  );
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || initialData?.images?.[0] || null
  );
  const [newFiles, setNewFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemovedImageIds((prev) => [...prev, publicId]);

    // If removed was cover image, reset cover image
    if (coverImage?.publicId === publicId) {
      const remaining = existingImages.filter((img) => img.publicId !== publicId);
      setCoverImage(remaining[0] || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showError("Property title is required");
      return;
    }
    if (!description.trim()) {
      showError("Property description is required");
      return;
    }
    if (price === "" || isNaN(Number(price))) {
      showError("Please enter a valid price");
      return;
    }

    // Build FormData payload to support multipart file upload
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("propertyType", propertyType);
    formData.append("purpose", purpose);
    formData.append("status", status);
    formData.append("price", Number(price));
    if (priceLabel) formData.append("priceLabel", priceLabel.trim());
    formData.append("currency", currency);
    formData.append("bedrooms", Number(bedrooms) || 0);
    formData.append("bathrooms", Number(bathrooms) || 0);
    formData.append("area", Number(area) || 0);
    formData.append("areaUnit", areaUnit);

    formData.append(
      "location",
      JSON.stringify({
        emirate: emirate.trim(),
        city: city.trim(),
        community: community.trim(),
        address: address.trim(),
      })
    );

    formData.append("features", JSON.stringify(features));
    formData.append("isFeatured", isFeatured);
    formData.append("published", published);

    // Existing images to keep / remove / reorder
    if (isEdit) {
      if (existingImages && existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
      if (removedImageIds.length > 0) {
        formData.append("removeImageIds", JSON.stringify(removedImageIds));
      }
      if (coverImage && !coverImage.isNew) {
        formData.append("coverImage", JSON.stringify(coverImage));
      }
    }

    // Append new image files
    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(51,104,160,0.16)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#3368A0] hover:text-[#285781] transition-colors cursor-pointer"
        >
          <LuArrowLeft className="text-base" />
          <span>Back to Properties</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/properties")}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[rgba(51,104,160,0.22)] bg-white text-[#18324A] text-xs font-semibold hover:bg-[#C8DFDB]/30 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Property...</span>
              </>
            ) : (
              <>
                <LuSave className="text-sm" />
                <span>{isEdit ? "Update Property" : "Save Property"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuBuilding />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              1. Basic Information
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Title, category, purpose, and description
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Palm Jumeirah Ultra Luxury Beachfront Villa"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.92rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all font-serif font-bold"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Property Type *
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all cursor-pointer"
            >
              <option value="villa">Villa</option>
              <option value="flat">Flat / Apartment</option>
              <option value="kiosk">Kiosk</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Purpose *
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all cursor-pointer"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Full Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive narrative describing the property, architecture, views, finishings, and lifestyle..."
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/18 transition-all leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Property Specifications */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuInfo />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              2. Property Specifications
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Bedrooms, bathrooms, and built-up area
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="5"
              className="w-full px-4 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="6"
              className="w-full px-4 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Area
            </label>
            <input
              type="number"
              min="0"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="8200"
              className="w-full px-4 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Area Unit
            </label>
            <select
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] transition-all cursor-pointer"
            >
              <option value="sq.ft">sq.ft</option>
              <option value="m²">m²</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Location */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuMapPin />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              3. Location Details
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Emirate, city, community, and address
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Emirate *
            </label>
            <select
              value={emirate}
              onChange={(e) => {
                setEmirate(e.target.value);
                if (e.target.value !== "Dubai") setCity(e.target.value);
              }}
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] transition-all cursor-pointer"
            >
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dubai"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Community / Neighborhood
            </label>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="e.g. Palm Jumeirah, Downtown, Al Barari"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Street / Building Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Frond N, Villa 14"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Pricing */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuDollarSign />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              4. Pricing & Currency
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Set the price, optional price label, and currency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Price (Numeric) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="8900000"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.92rem] text-[#3368A0] font-bold focus:outline-none focus:border-[#66A3BF] transition-all"
            />
            {price && !isNaN(Number(price)) && (
              <p className="text-[0.78rem] text-[#3368A0] font-bold mt-1">
                Preview: {currency} {Number(price).toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-medium focus:outline-none focus:border-[#66A3BF] transition-all cursor-pointer"
            >
              <option value="AED">AED (UAE Dirham)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Price Label (Optional)
            </label>
            <input
              type="text"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              placeholder="e.g. Price on Request, Starting from"
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] focus:outline-none focus:border-[#66A3BF] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Gallery & Media */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuImage />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              5. Image Gallery & Cover
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Upload up to 10 high resolution images and select a cover photo
            </p>
          </div>
        </div>

        <PropertyImageUploader
          existingImages={existingImages}
          coverImage={coverImage}
          newFiles={newFiles}
          onNewFilesChange={setNewFiles}
          onExistingImagesChange={setExistingImages}
          onCoverImageChange={setCoverImage}
          onRemoveExistingImage={handleRemoveExistingImage}
        />
      </div>

      {/* Section 6: Features */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuSparkles />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              6. Features & Amenities
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Add luxury selling points and key amenities
            </p>
          </div>
        </div>

        <PropertyFeaturesInput
          features={features}
          onChange={setFeatures}
        />
      </div>

      {/* Section 7: Publishing & Status */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(51,104,160,0.12)]">
          <div className="w-8 h-8 rounded-lg bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-base border border-[rgba(51,104,160,0.16)]">
            <LuInfo />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">
              7. Publishing & Status
            </h3>
            <p className="text-xs text-[#60788A] font-medium">
              Control listing visibility and promotional placement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18324A] mb-1.5">
              Property Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[0.88rem] text-[#18324A] font-bold focus:outline-none focus:border-[#66A3BF] transition-all cursor-pointer"
            >
              <option value="active">Active (Available)</option>
              <option value="sold">Sold (Deal Closed)</option>
              <option value="inactive">Inactive (Draft / Archived)</option>
            </select>

            {status === "sold" && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <LuTriangleAlert className="text-sm shrink-0 mt-0.5 text-amber-600" />
                <span>
                  This property will no longer appear in the public active listings.
                </span>
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F2EFE7]/50 border border-[rgba(51,104,160,0.16)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#18324A]">
                Featured Property
              </p>
              <p className="text-[0.76rem] text-[#60788A] mt-0.5 font-medium">
                Highlight on homepage showcase
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3368A0]" />
            </label>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F2EFE7]/50 border border-[rgba(51,104,160,0.16)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#18324A]">
                Public Visibility
              </p>
              <p className="text-[0.76rem] text-[#60788A] mt-0.5 font-medium">
                Display on public property catalog
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3368A0]" />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/properties")}
          className="px-5 py-3 rounded-xl border border-[rgba(51,104,160,0.22)] bg-white text-[#18324A] text-xs font-semibold hover:bg-[#C8DFDB]/30 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Property...</span>
            </>
          ) : (
            <>
              <LuSave className="text-sm" />
              <span>{isEdit ? "Update Property" : "Save Property"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
