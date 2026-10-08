"use client";

import { LuTriangleAlert, LuX } from "react-icons/lu";

export default function DeletePropertyDialog({
  isOpen,
  property,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(51,104,160,0.18)] border border-[rgba(51,104,160,0.16)] p-6 sm:p-7 z-10 animate-[rise_0.2s_ease-out] font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(51,104,160,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <LuTriangleAlert className="text-xl" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#18324A]">
                Delete Property
              </h3>
              <p className="text-xs text-[#60788A]">Permanent removal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#60788A] hover:text-[#18324A] hover:bg-[#F2EFE7] transition-colors"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        <div className="py-5">
          <p className="text-[0.92rem] text-[#18324A] mb-3">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#3368A0]">
              "{property.title}"
            </span>
            ?
          </p>
          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/60 text-[0.82rem] text-red-800 leading-relaxed">
            This action will permanently remove the property document from the
            database and delete all associated Cloudinary images. This cannot be
            undone.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#C8DFDB] text-[#3368A0] text-[0.88rem] font-semibold hover:bg-[#b5d4ce] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[0.88rem] font-semibold shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Property</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
