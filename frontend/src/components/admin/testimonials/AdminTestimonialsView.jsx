"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminLayout from "../layout/AdminLayout";
import {
  LuPlus,
  LuSearch,
  LuStar,
  LuPencil,
  LuTrash2,
  LuRefreshCw,
  LuQuote,
  LuX,
  LuUser,
} from "react-icons/lu";

export default function AdminTestimonialsView() {
  const { showSuccess, showError } = useToast();

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (Removed company & socialUrl)
  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
    date: new Date().toISOString().split("T")[0],
    isFeatured: false,
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Delete modal
  const [deletingItem, setDeletingItem] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await api.admin.getTestimonials({ limit: 100 });
      if (res.success) {
        setTestimonials(res.data || []);
      }
    } catch (err) {
      console.error("Fetch testimonials error:", err);
      showError(err.message || "Failed to load testimonials");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTestimonials();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: "",
      role: "",
      message: "",
      rating: 5,
      date: new Date().toISOString().split("T")[0],
      isFeatured: false,
      isPublished: true,
    });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      role: item.role || "",
      message: item.message || "",
      rating: item.rating || 5,
      date: item.date
        ? new Date(item.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      isFeatured: Boolean(item.isFeatured),
      isPublished: item.isPublished !== false,
    });
    setImageFile(null);
    setImagePreview(item.image?.url || "");
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      showError("Please provide both name and testimonial message");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("message", form.message);
      formData.append("rating", form.rating);
      formData.append("date", form.date);
      formData.append("isFeatured", form.isFeatured);
      formData.append("isPublished", form.isPublished);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingItem) {
        const res = await api.admin.updateTestimonial(editingItem._id, formData);
        if (res.success) {
          showSuccess("Testimonial updated successfully");
          setShowModal(false);
          fetchTestimonials();
        }
      } else {
        const res = await api.admin.createTestimonial(formData);
        if (res.success) {
          showSuccess("Testimonial created successfully");
          setShowModal(false);
          fetchTestimonials();
        }
      }
    } catch (err) {
      console.error("Save testimonial error:", err);
      showError(err.message || "Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (item) => {
    const nextFeatured = !item.isFeatured;
    try {
      const res = await api.admin.updateTestimonial(item._id, {
        isFeatured: nextFeatured,
      });
      if (res.success) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t._id === item._id ? { ...t, isFeatured: nextFeatured } : t
          )
        );
        showSuccess(
          nextFeatured ? `Featured "${item.name}"` : `Unfeatured "${item.name}"`
        );
      }
    } catch (err) {
      showError(err.message || "Failed to update featured status");
    }
  };

  const handleTogglePublish = async (item) => {
    const nextPublished = !item.isPublished;
    try {
      const res = await api.admin.updateTestimonial(item._id, {
        isPublished: nextPublished,
      });
      if (res.success) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t._id === item._id ? { ...t, isPublished: nextPublished } : t
          )
        );
        showSuccess(
          nextPublished ? `Published "${item.name}"` : `Unpublished "${item.name}"`
        );
      }
    } catch (err) {
      showError(err.message || "Failed to update published status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      const res = await api.admin.deleteTestimonial(deletingItem._id);
      if (res.success) {
        showSuccess("Testimonial deleted successfully");
        setDeletingItem(null);
        fetchTestimonials();
      }
    } catch (err) {
      showError(err.message || "Failed to delete testimonial");
    }
  };

  // Filtered testimonials
  const filteredTestimonials = testimonials.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "featured") return matchesSearch && item.isFeatured;
    if (filterType === "published") return matchesSearch && item.isPublished;
    if (filterType === "draft") return matchesSearch && !item.isPublished;
    return matchesSearch;
  });

  return (
    <AdminLayout title="Testimonials & Reviews">
      <div className="space-y-6 font-sans">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-xs">
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#60788A]" />
            <input
              type="text"
              placeholder="Search by name, role, review..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] placeholder:text-[#60788A] focus:outline-none focus:border-[#66A3BF] focus:ring-2 focus:ring-[#66A3BF]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterType === "all"
                    ? "bg-[#3368A0] text-white"
                    : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
                }`}
              >
                All ({testimonials.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("featured")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterType === "featured"
                    ? "bg-[#3368A0] text-white"
                    : "bg-white text-[#18324A] border border-[rgba(51,104,160,0.16)] hover:bg-[#C8DFDB]/30"
                }`}
              >
                Featured
              </button>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white border border-[rgba(51,104,160,0.16)] text-[#3368A0] hover:bg-[#C8DFDB]/40 transition-colors cursor-pointer shadow-xs"
              title="Refresh listings"
            >
              <LuRefreshCw className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3368A0] text-white text-xs font-bold hover:bg-[#285781] transition-all shadow-sm cursor-pointer shrink-0"
            >
              <LuPlus className="text-sm" />
              <span>Add Review</span>
            </button>
          </div>
        </div>

        {/* Testimonials Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] p-12 text-center space-y-4 shadow-sm">
            <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#60788A]">Loading client testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] p-12 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#C8DFDB]/40 text-[#3368A0] flex items-center justify-center mx-auto text-xl">
              <LuQuote />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18324A]">No testimonials found</h3>
            <p className="text-xs text-[#60788A] max-w-sm mx-auto">
              {searchQuery
                ? "No reviews matched your search criteria."
                : "Click 'Add Review' to create your first client testimonial."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[rgba(51,104,160,0.16)] shadow-[0_10px_30px_rgba(51,104,160,0.06)] overflow-hidden font-sans">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#C8DFDB] border-b border-[rgba(51,104,160,0.20)] text-[#18324A] text-[0.78rem] uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Role / Title</th>
                    <th className="py-3.5 px-4">Review Message</th>
                    <th className="py-3.5 px-4 text-center">Rating</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(51,104,160,0.10)] text-xs text-[#18324A]">
                  {filteredTestimonials.map((item, idx) => {
                    const formattedDate = item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "";

                    return (
                      <tr key={item._id} className="hover:bg-[#F2EFE7]/50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-[#60788A]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {item.image?.url ? (
                              <img
                                src={item.image.url}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-[rgba(51,104,160,0.2)]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#C8DFDB]/50 flex items-center justify-center text-[#3368A0] shrink-0 border border-[rgba(51,104,160,0.2)]">
                                <LuUser className="text-base" />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#18324A]">
                                {item.name}
                              </div>
                              <span className="text-[0.7rem] text-[#60788A]">{formattedDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#60788A]">
                          <div className="font-medium text-[#18324A]">{item.role || "—"}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="line-clamp-2 italic text-[#18324A]/90 m-0">
                            "{item.message}"
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <LuStar
                                key={s}
                                className={`text-xs ${
                                  s <= (item.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300 fill-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              item.isFeatured
                                ? "bg-amber-100 text-amber-700 border border-amber-300"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                            title={item.isFeatured ? "Featured on homepage" : "Set as featured"}
                          >
                            <LuStar className={`text-sm ${item.isFeatured ? "fill-amber-500" : ""}`} />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(item)}
                            className={`px-2.5 py-1 rounded-lg text-[0.72rem] font-bold transition-all cursor-pointer ${
                              item.isPublished
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-[#18324A] bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Edit Review"
                            >
                              <LuPencil className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingItem(item)}
                              className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                              title="Delete Review"
                            >
                              <LuTrash2 className="text-xs" />
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
        )}

        {/* Add / Edit Testimonial Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-[rgba(51,104,160,0.2)] shadow-2xl overflow-hidden animate-[rise_0.2s_ease-out]">
              <div className="flex items-center justify-between p-5 bg-[#C8DFDB] border-b border-[rgba(51,104,160,0.2)]">
                <div className="flex items-center gap-2 text-[#3368A0]">
                  <LuQuote className="text-lg" />
                  <h3 className="font-serif font-bold text-base text-[#18324A]">
                    {editingItem ? "Edit Testimonial" : "Add Client Testimonial"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-[#18324A] hover:bg-white/40 transition-colors cursor-pointer"
                >
                  <LuX className="text-base" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
                {/* Image Upload Area */}
                <div>
                  <label className="block font-bold text-[#18324A] mb-1.5">Client Avatar / Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#C8DFDB]/40 border border-[rgba(51,104,160,0.2)] overflow-hidden flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <LuUser className="text-2xl text-[#3368A0]" />
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <div className="border border-dashed border-[#66A3BF] rounded-xl p-2.5 text-center bg-[#F2EFE7]/50 hover:bg-[#C8DFDB]/30 transition-colors">
                        <span className="font-semibold text-[#3368A0]">Click to choose image file</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#18324A] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ahmed Al Mansoori"
                      className="w-full px-3 py-2 bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] focus:outline-none focus:border-[#3368A0]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#18324A] mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Property Investor"
                      className="w-full px-3 py-2 bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] focus:outline-none focus:border-[#3368A0]"
                    />
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#18324A] mb-1">Star Rating (1 - 5)</label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] focus:outline-none focus:border-[#3368A0]"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                      <option value={2}>★★☆☆☆ (2 Stars)</option>
                      <option value={1}>★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#18324A] mb-1">Review Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] focus:outline-none focus:border-[#3368A0]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-bold text-[#18324A] mb-1">Testimonial Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Enter the client's review or testimonial text..."
                    className="w-full px-3 py-2 bg-white border border-[rgba(51,104,160,0.2)] rounded-xl text-[#18324A] focus:outline-none focus:border-[#3368A0] leading-relaxed resize-y"
                  />
                </div>

                {/* Switches */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#3368A0]"
                    />
                    <span className="font-semibold text-[#18324A]">Featured Review</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-[#3368A0]"
                    />
                    <span className="font-semibold text-[#18324A]">Published</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[rgba(51,104,160,0.16)]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-[rgba(51,104,160,0.2)] bg-white text-[#18324A] font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#3368A0] text-white font-bold hover:bg-[#285781] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[rgba(51,104,160,0.2)] shadow-2xl text-center font-sans animate-[rise_0.2s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
                <LuTrash2 />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#18324A]">
                  Delete Testimonial?
                </h3>
                <p className="text-xs text-[#60788A] mt-1">
                  Are you sure you want to delete the testimonial from <strong className="text-[#18324A]">{deletingItem.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#18324A] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
