"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import DashboardStats from "./DashboardStats";
import PropertyTable from "../properties/PropertyTable";
import DeletePropertyDialog from "../properties/DeletePropertyDialog";
import {
  LuArrowRight,
  LuRefreshCw,
} from "react-icons/lu";

export default function AdminDashboard() {
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delete modal state
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      const allRes = await api.admin.getProperties({ limit: 100 });

      if (allRes.success) {
        const allProps = allRes.data || [];

        const total = allRes.pagination?.total || allProps.length;
        const active = allProps.filter((p) => p.status === "active").length;
        const sold = allProps.filter((p) => p.status === "sold").length;

        setStats({ total, active, sold });
        setRecentProperties(allProps.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  // Quick status change (Sold / Reactivate)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.admin.updateProperty(id, { status: newStatus });
      if (res.success) {
        showSuccess(
          newStatus === "sold"
            ? "Property marked as sold."
            : "Property reactivated to active status."
        );
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || "Failed to update property status");
    }
  };

  // Quick publish toggle
  const handlePublishToggle = async (id, newPublished) => {
    try {
      const res = await api.admin.updateProperty(id, { published: newPublished });
      if (res.success) {
        showSuccess(
          newPublished
            ? "Property published to website."
            : "Property unpublished from website."
        );
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || "Failed to update publish state");
    }
  };

  // Delete property
  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);

    try {
      const res = await api.admin.deleteProperty(propertyToDelete._id);
      if (res.success) {
        showSuccess("Property deleted successfully.");
        setPropertyToDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || "Failed to delete property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#18324A]">
            Executive Overview
          </h2>
          <p className="text-xs text-[#60788A] font-sans mt-0.5 font-medium">
            Real estate portfolio performance, active listings, and deal summaries
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] hover:bg-[#C8DFDB]/40 transition-colors cursor-pointer shadow-xs"
            title="Refresh statistics"
          >
            <LuRefreshCw
              className={`text-base ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <DashboardStats stats={stats} isLoading={isLoading} />

      {/* Recent Properties Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#18324A]">
              Recent Listings
            </h3>
            <p className="text-xs text-[#60788A] font-sans font-medium">
              Latest additions to the portfolio
            </p>
          </div>

          <Link
            href="/admin/dashboard/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3368A0] hover:text-[#285781] transition-colors font-sans no-underline"
          >
            <span>View All Properties</span>
            <LuArrowRight className="text-sm" />
          </Link>
        </div>

        <PropertyTable
          properties={recentProperties}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onPublishToggle={handlePublishToggle}
          onDeleteClick={setPropertyToDelete}
        />
      </div>

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
