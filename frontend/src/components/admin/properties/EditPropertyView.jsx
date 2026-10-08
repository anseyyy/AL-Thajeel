"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import PropertyForm from "./PropertyForm";
import Link from "next/link";
import { LuArrowLeft, LuCircleAlert } from "react-icons/lu";

export default function EditPropertyView({ id }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProperty = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getPropertyById(id);
      if (res.success && res.data) {
        setProperty(res.data);
      } else {
        setErrorMessage("Property not found");
      }
    } catch (err) {
      console.error("Fetch property error:", err);
      setErrorMessage(err.message || "Failed to load property details");
      showError(err.message || "Failed to load property");
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id, fetchProperty]);

  const handleUpdateProperty = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await api.admin.updateProperty(id, formData);
      if (res.success) {
        showSuccess("Property updated successfully!");
        router.push("/admin/dashboard/properties");
      }
    } catch (err) {
      console.error("Update property error:", err);
      showError(err.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Edit Property">
      <div className="max-w-4xl mx-auto font-sans">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.10)] p-12 text-center space-y-4">
            <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#60788A]">Loading property details...</p>
          </div>
        ) : errorMessage || !property ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.10)] p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl border border-red-200">
              <LuCircleAlert />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#18324A]">
              {errorMessage || "Property not found"}
            </h3>
            <p className="text-xs text-[#60788A]">
              The requested property may have been removed or does not exist.
            </p>
            <Link
              href="/admin/dashboard/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white text-xs font-semibold no-underline transition-colors"
            >
              <LuArrowLeft className="text-sm" />
              <span>Back to Properties</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#18324A]">
                Edit: {property.title}
              </h2>
              <p className="text-xs text-[#60788A] mt-0.5">
                Update details, pricing, gallery photos, and visibility settings.
              </p>
            </div>

            <PropertyForm
              initialData={property}
              isEdit={true}
              onSubmit={handleUpdateProperty}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
