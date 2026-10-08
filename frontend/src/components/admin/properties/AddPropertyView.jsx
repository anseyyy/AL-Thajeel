"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import PropertyForm from "./PropertyForm";

export default function AddPropertyView() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProperty = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await api.admin.createProperty(formData);
      if (res.success) {
        showSuccess("Property created successfully!");
        router.push("/admin/dashboard/properties");
      }
    } catch (err) {
      console.error("Create property error:", err);
      showError(err.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add Property">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#18324A]">
            Register New Property
          </h2>
          <p className="text-xs text-[#60788A] font-sans mt-0.5">
            Fill in the details below to list a new villa, flat, kiosk, or warehouse.
          </p>
        </div>

        <PropertyForm
          onSubmit={handleCreateProperty}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
}
