"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import InquiryDetailModal from "./InquiryDetailModal";
import {
  LuMail,
  LuSearch,
  LuRefreshCw,
  LuTrash2,
  LuEye,
  LuPhone,
  LuCalendar,
  LuCircleCheck,
  LuInbox,
} from "react-icons/lu";

export default function InquiriesListView() {
  const { showSuccess, showError } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [counts, setCounts] = useState({ total: 0, new: 0, read: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Active viewing inquiry
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await api.admin.getContacts({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
        limit: 100,
      });

      if (res.success) {
        setInquiries(res.data || []);
        if (res.counts) {
          setCounts(res.counts);
        }
      }
    } catch (err) {
      console.error("Fetch inquiries error:", err);
      showError(err.message || "Failed to load inquiries");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter, searchQuery, showError]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchInquiries();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.admin.updateContactStatus(id, { status: newStatus });
      if (res.success) {
        showSuccess(
          newStatus === "read"
            ? "Inquiry marked as read."
            : "Inquiry marked as new/unread."
        );
        // Update local list
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
        // Refresh counts
        const newC = newStatus === "read" ? counts.new - 1 : counts.new + 1;
        setCounts((c) => ({
          ...c,
          new: Math.max(0, newC),
          read: newStatus === "read" ? c.read + 1 : Math.max(0, c.read - 1),
        }));
      }
    } catch (err) {
      console.error("Status update error:", err);
      showError(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer inquiry?")) return;

    try {
      const res = await api.admin.deleteContact(id);
      if (res.success) {
        showSuccess("Inquiry deleted successfully.");
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      console.error("Delete inquiry error:", err);
      showError(err.message || "Failed to delete inquiry");
    }
  };

  return (
    <AdminLayout title="Inquiries & Leads">
      <div className="space-y-6 font-sans">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-xs">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60788A]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] placeholder:text-[#60788A] focus:outline-none focus:border-[#66A3BF] focus:ring-2 focus:ring-[#66A3BF]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("new")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "new"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              New Leads ({counts.new})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("read")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "read"
                  ? "bg-[#3368A0] text-white"
                  : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
              }`}
            >
              Read ({counts.read})
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] hover:bg-[#C8DFDB]/40 transition-colors cursor-pointer ml-1 shadow-xs"
              title="Refresh submissions"
            >
              <LuRefreshCw className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#60788A]">Loading customer inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C8DFDB]/40 text-[#3368A0] flex items-center justify-center mx-auto text-xl">
                <LuInbox />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#18324A]">
                No contact submissions found
              </h3>
              <p className="text-xs text-[#60788A] max-w-sm mx-auto">
                {searchQuery
                  ? "No submissions matched your search terms."
                  : "Customer inquiries submitted through the website will appear here in real-time."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#C8DFDB] text-[#3368A0] text-[0.72rem] font-bold uppercase tracking-wider border-b border-[rgba(51,104,160,0.16)]">
                    <th className="py-3.5 px-4 font-bold text-center w-12">#</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold">Customer Name</th>
                    <th className="py-3.5 px-4 font-bold">Contact Info</th>
                    <th className="py-3.5 px-4 font-bold">Message Preview</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(51,104,160,0.1)] text-xs text-[#18324A]">
                  {inquiries.map((item, index) => {
                    const isNew = item.status === "new";
                    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr
                        key={item._id}
                        className={`hover:bg-[#C8DFDB]/20 transition-colors ${
                          isNew ? "bg-[#C8DFDB]/10 font-medium" : "bg-white"
                        }`}
                      >
                        {/* Serial Number */}
                        <td className="py-3.5 px-4 text-center font-bold text-[#60788A]">
                          {index + 1}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {isNew ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.68rem] font-bold bg-[#3368A0] text-white shadow-xs">
                              New
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.68rem] font-medium bg-[#E8E8E4] text-[#60788A]">
                              Read
                            </span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#18324A]">
                            {item.name}
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[#3368A0] font-medium">
                            <LuPhone className="text-xs shrink-0" />
                            <a href={`tel:${item.phone}`} className="hover:underline">
                              {item.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#60788A]">
                            <LuMail className="text-xs shrink-0" />
                            <a href={`mailto:${item.email}`} className="hover:underline">
                              {item.email}
                            </a>
                          </div>
                        </td>

                        {/* Message Preview */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-[#60788A] line-clamp-1">
                            {item.message || "General callback inquiry."}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[#60788A] whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedInquiry(item)}
                              className="p-1.5 rounded-lg bg-[#F2EFE7] hover:bg-[#C8DFDB] text-[#3368A0] transition-colors cursor-pointer"
                              title="View Full Details"
                            >
                              <LuEye className="text-base" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  item._id,
                                  isNew ? "read" : "new"
                                )
                              }
                              className="p-1.5 rounded-lg bg-[#F2EFE7] hover:bg-[#C8DFDB] text-[#3368A0] transition-colors cursor-pointer"
                              title={isNew ? "Mark as Read" : "Mark as New"}
                            >
                              <LuCircleCheck className="text-base" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Delete Submission"
                            >
                              <LuTrash2 className="text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal View */}
        <InquiryDetailModal
          isOpen={!!selectedInquiry}
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
