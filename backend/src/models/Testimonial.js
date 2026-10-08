import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the reviewer's name"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Please provide the testimonial message"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
testimonialSchema.index({ isPublished: 1, isFeatured: -1, date: -1 });

const Testimonial =
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
