"use client";

import { useState } from "react";
import {
  LuX,
  LuMail,
  LuPhone,
  LuUser,
  LuCalendar,
  LuCircleCheck,
  LuTrash2,
} from "react-icons/lu";

export default function InquiryDetailModal({
  isOpen,
  inquiry,
  onClose,
  onStatusChange,
  onDelete,
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !inquiry) return null;

  const handleToggleRead = async () => {
    setIsUpdating(true);
    const nextStatus = inquiry.status === "read" ? "new" : "read";
    await onStatusChange(inquiry._id, nextStatus);
    setIsUpdating(false);
  };

  const formattedDate = new Date(inquiry.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(51,104,160,0.18)] border border-[rgba(51,104,160,0.16)] p-6 sm:p-7 z-10 animate-[rise_0.2s_ease-out] font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(51,104,160,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C8DFDB]/60 text-[#3368A0] flex items-center justify-center text-lg font-bold">
              <LuMail />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#18324A]">
                Inquiry Details
              </h3>
              <p className="text-xs text-[#60788A] flex items-center gap-1.5 mt-0.5">
                <LuCalendar className="text-xs" />
                <span>{formattedDate}</span>
              </p>
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

        {/* Sender Info */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F2EFE7]/80 border border-[rgba(51,104,160,0.12)] text-xs">
            <div className="flex items-center gap-2 text-[#18324A]">
              <LuUser className="text-[#3368A0] text-sm shrink-0" />
              <div>
                <span className="text-[0.68rem] text-[#60788A] block">Full Name</span>
                <span className="font-semibold">{inquiry.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#18324A]">
              <LuPhone className="text-[#3368A0] text-sm shrink-0" />
              <div>
                <span className="text-[0.68rem] text-[#60788A] block">Phone</span>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="font-semibold text-[#3368A0] hover:underline"
                >
                  {inquiry.phone}
                </a>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 text-[#18324A] pt-1 border-t border-[rgba(51,104,160,0.08)]">
              <LuMail className="text-[#3368A0] text-sm shrink-0" />
              <div>
                <span className="text-[0.68rem] text-[#60788A] block">Email</span>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="font-semibold text-[#3368A0] hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>
            </div>
          </div>

          {/* Message Subject & Body */}
          <div className="space-y-2">
            <span className="text-[0.72rem] font-bold text-[#18324A] uppercase tracking-wider block">
              Message / Request
            </span>
            <div className="p-4 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-xs text-[#18324A] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {inquiry.message || "No specific message provided. Customer requested a callback."}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(51,104,160,0.12)]">
          <button
            type="button"
            onClick={() => onDelete(inquiry._id)}
            className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LuTrash2 className="text-sm" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleToggleRead}
              className="px-4 py-2 rounded-xl bg-[#C8DFDB] text-[#3368A0] text-xs font-semibold hover:bg-[#b5d4ce] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <LuCircleCheck className="text-sm" />
              <span>
                {inquiry.status === "read" ? "Mark Unread" : "Mark as Read"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#3368A0] text-white text-xs font-semibold hover:bg-[#285781] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
