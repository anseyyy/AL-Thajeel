"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import PropertyFilters from "./PropertyFilters";
import PropertyTable from "./PropertyTable";
import DeletePropertyDialog from "./DeletePropertyDialog";
import {
  LuPlus,
  LuRefreshCw,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

export default function AdminPropertiesList() {
  const { showSuccess, showError } = useToast();

  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch properties from backend
  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getProperties({
        page: currentPage,
        limit: 10,
        search,
        status,
        type,
        purpose,
      });

      if (res.success) {
        setProperties(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error("Fetch properties error:", err);
      showError(err.message || "Failed to load properties");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, search, status, type, purpose, showError]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setPurpose("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProperties();
  };

  // Status toggle handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.admin.updateProperty(id, { status: newStatus });
      if (res.success) {
        showSuccess(
          newStatus === "sold"
            ? "Property marked as sold."
            : "Property reactivated to active status."
        );
        fetchProperties();
      }
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  // Publish toggle handler
  const handlePublishToggle = async (id, newPublished) => {
    try {
      const res = await api.admin.updateProperty(id, { published: newPublished });
      if (res.success) {
        showSuccess(
          newPublished
            ? "Property published to public listings."
            : "Property unpublished."
        );
        fetchProperties();
      }
    } catch (err) {
      showError(err.message || "Failed to toggle published state");
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);

    try {
      const res = await api.admin.deleteProperty(propertyToDelete._id);
      if (res.success) {
        showSuccess("Property deleted successfully.");
        setPropertyToDelete(null);
        fetchProperties();
      }
    } catch (err) {
      showError(err.message || "Failed to delete property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Properties Portfolio">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 font-sans">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#18324A]">
            Properties Management
          </h2>
          <p className="text-xs text-[#60788A] mt-0.5 font-medium">
            Manage real estate listings, pricing, statuses, and digital assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] hover:bg-[#C8DFDB]/40 transition-colors cursor-pointer shadow-xs"
            title="Refresh list"
          >
            <LuRefreshCw
              className={`text-base ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>

          <Link
            href="/admin/dashboard/properties/add"
            className="px-5 py-2.5 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 no-underline cursor-pointer"
          >
            <LuPlus className="text-base" />
            <span>Add New Property</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <PropertyFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        type={type}
        setType={(val) => {
          setType(val);
          setCurrentPage(1);
        }}
        purpose={purpose}
        setPurpose={(val) => {
          setPurpose(val);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Properties Table & Cards */}
      <PropertyTable
        properties={properties}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onPublishToggle={handlePublishToggle}
        onDeleteClick={setPropertyToDelete}
      />

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[rgba(51,104,160,0.12)] font-sans text-xs text-[#60788A]">
          <div>
            Showing{" "}
            <span className="font-semibold text-[#18324A]">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#18324A]">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#18324A]">
              {pagination.total}
            </span>{" "}
            properties
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[rgba(51,104,160,0.16)] bg-white text-[#18324A] font-semibold hover:bg-[#C8DFDB]/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <LuChevronLeft className="text-sm" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1.5 font-semibold text-[#18324A]">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.pages, p + 1))
              }
              className="px-3 py-1.5 rounded-lg border border-[rgba(51,104,160,0.16)] bg-white text-[#18324A] font-semibold hover:bg-[#C8DFDB]/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <LuChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeletePropertyDialog
        isOpen={!!propertyToDelete}
        property={propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
}
