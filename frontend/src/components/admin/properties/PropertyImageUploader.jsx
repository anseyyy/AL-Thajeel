"use client";

import { useState, useRef } from "react";
import {
  LuUpload,
  LuX,
  LuStar,
  LuCircleAlert,
  LuArrowLeft,
  LuArrowRight,
} from "react-icons/lu";

export default function PropertyImageUploader({
  existingImages = [],
  coverImage = null,
  newFiles = [],
  onNewFilesChange,
  onExistingImagesChange,
  onCoverImageChange,
  onRemoveExistingImage,
}) {
  const fileInputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  const totalImageCount = existingImages.length + newFiles.length;

  const handleFileSelect = (e) => {
    setErrorMsg("");
    const selectedFiles = Array.from(e.target.files || []);

    if (totalImageCount + selectedFiles.length > 10) {
      setErrorMsg("Maximum 10 images allowed per property.");
      return;
    }

    const validFiles = [];
    for (const file of selectedFiles) {
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        setErrorMsg("Only JPG, JPEG, PNG, and WEBP formats are supported.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Each image must be under 10MB.");
        return;
      }
      validFiles.push(file);
    }

    const updated = [...newFiles, ...validFiles];
    onNewFilesChange(updated);

    // If no cover image yet, set first as cover
    if (!coverImage && existingImages.length === 0 && updated.length > 0) {
      onCoverImageChange({ isNew: true, index: 0 });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeNewFile = (index) => {
    const updated = newFiles.filter((_, i) => i !== index);
    onNewFilesChange(updated);
  };

  // Reorder existing images
  const moveExisting = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= existingImages.length) return;
    const reordered = [...existingImages];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    if (onExistingImagesChange) {
      onExistingImagesChange(reordered);
    }
  };

  // Reorder new files
  const moveNew = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= newFiles.length) return;
    const reordered = [...newFiles];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onNewFilesChange(reordered);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#66A3BF] hover:border-[#3368A0] bg-[rgba(200,223,219,0.35)] hover:bg-[#C8DFDB] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-full bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] group-hover:scale-110 flex items-center justify-center mx-auto mb-3 shadow-xs transition-transform">
          <LuUpload className="text-2xl" />
        </div>

        <h4 className="font-serif font-bold text-base text-[#18324A]">
          Upload Property Images
        </h4>
        <p className="text-xs text-[#60788A] mt-1 max-w-sm mx-auto font-medium">
          Drag and drop or click to browse. Max 10 images (JPG, PNG, WEBP up to
          10MB each).
        </p>

        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[rgba(51,104,160,0.16)] text-[0.76rem] font-bold text-[#3368A0]">
          <span>{totalImageCount} / 10 Images</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <LuCircleAlert className="text-sm shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Thumbnails Grid */}
      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#60788A] px-1 font-bold uppercase tracking-wider">
            <span>Image Order & Thumbnail</span>
            <span className="text-[0.72rem] lowercase font-normal">
              use arrows to reorder • star to set thumbnail
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Existing Cloudinary Images */}
            {existingImages.map((img, idx) => {
              const isCover =
                coverImage?.publicId === img.publicId ||
                coverImage?.url === img.url ||
                (!coverImage && idx === 0);

              return (
                <div
                  key={img.publicId || idx}
                  className={`group relative rounded-xl overflow-hidden bg-white border-2 aspect-4/3 shadow-xs transition-all ${
                    isCover
                      ? "border-[#3368A0] ring-2 ring-[#3368A0]/30"
                      : "border-[rgba(51,104,160,0.16)]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Property image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Position Badge */}
                  <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                    #{idx + 1}
                  </div>

                  {/* Main Thumbnail Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 bg-[#3368A0] text-white text-[0.65rem] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                      <LuStar className="text-xs fill-current" />
                      <span>Thumbnail</span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onCoverImageChange(img)}
                        title="Set as Main Thumbnail"
                        className={`p-1.5 rounded-lg text-xs cursor-pointer shadow ${
                          isCover
                            ? "bg-[#3368A0] text-white"
                            : "bg-white/90 text-[#18324A] hover:bg-white"
                        }`}
                      >
                        <LuStar className={isCover ? "fill-current" : ""} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveExistingImage(img.publicId)}
                        title="Remove image"
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer shadow"
                      >
                        <LuX />
                      </button>
                    </div>

                    {/* Reorder Arrows */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveExisting(idx, idx - 1)}
                        title="Move Left / Earlier"
                        className="p-1.5 rounded-lg bg-white/90 text-[#18324A] hover:bg-white text-xs disabled:opacity-40 cursor-pointer shadow"
                      >
                        <LuArrowLeft />
                      </button>
                      <button
                        type="button"
                        disabled={idx === existingImages.length - 1}
                        onClick={() => moveExisting(idx, idx + 1)}
                        title="Move Right / Later"
                        className="p-1.5 rounded-lg bg-white/90 text-[#18324A] hover:bg-white text-xs disabled:opacity-40 cursor-pointer shadow"
                      >
                        <LuArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Newly Selected Local Files */}
            {newFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              const isCover =
                coverImage?.isNew && coverImage?.index === idx;

              return (
                <div
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden bg-white border-2 aspect-4/3 shadow-xs transition-all ${
                    isCover
                      ? "border-[#3368A0] ring-2 ring-[#3368A0]/30"
                      : "border-[#66A3BF]"
                  }`}
                >
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Position Badge */}
                  <div className="absolute top-1.5 right-1.5 bg-[#3368A0] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                    New #{existingImages.length + idx + 1}
                  </div>

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 bg-[#3368A0] text-white text-[0.65rem] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                      <LuStar className="text-xs fill-current" />
                      <span>Thumbnail</span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          onCoverImageChange({ isNew: true, index: idx })
                        }
                        title="Set as Main Thumbnail"
                        className={`p-1.5 rounded-lg text-xs cursor-pointer shadow ${
                          isCover
                            ? "bg-[#3368A0] text-white"
                            : "bg-white/90 text-[#18324A] hover:bg-white"
                        }`}
                      >
                        <LuStar className={isCover ? "fill-current" : ""} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        title="Remove image"
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer shadow"
                      >
                        <LuX />
                      </button>
                    </div>

                    {/* Reorder Arrows */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveNew(idx, idx - 1)}
                        title="Move Left"
                        className="p-1.5 rounded-lg bg-white/90 text-[#18324A] hover:bg-white text-xs disabled:opacity-40 cursor-pointer shadow"
                      >
                        <LuArrowLeft />
                      </button>
                      <button
                        type="button"
                        disabled={idx === newFiles.length - 1}
                        onClick={() => moveNew(idx, idx + 1)}
                        title="Move Right"
                        className="p-1.5 rounded-lg bg-white/90 text-[#18324A] hover:bg-white text-xs disabled:opacity-40 cursor-pointer shadow"
                      >
                        <LuArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
