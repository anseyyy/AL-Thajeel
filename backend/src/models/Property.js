import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    propertyType: {
      type: String,
      enum: {
        values: [
          "villa",
          "flat",
          "kiosk",
          "warehouse",
          "house",
          "apartment",
          "office",
          "shop",
          "labour",
        ],
        message: "{VALUE} is not a valid property type",
      },
      required: [true, "Property type is required"],
    },
    purpose: {
      type: String,
      enum: {
        values: ["sale", "rent"],
        message: "{VALUE} is not a valid purpose",
      },
      required: [true, "Purpose is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "sold", "inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    priceLabel: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "AED",
      trim: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    area: {
      type: Number,
      default: 0,
      min: 0,
    },
    areaUnit: {
      type: String,
      default: "sq.ft",
      trim: true,
    },
    location: {
      emirate: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      community: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    coverImage: {
      url: { type: String },
      publicId: { type: String, default: "" },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    soldAt: {
      type: Date,
      default: null,
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

/**
 * Generate a clean URL-friendly slug from string
 * @param {string} text 
 * @returns {string}
 */
export const slugifyText = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, "");   // Remove leading/trailing -
};

// Pre-save hook to ensure unique slug and cover image fallback
propertySchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugifyText(this.title || "property");
    let generatedSlug = baseSlug;
    let count = 1;

    // Check for existing slug collision
    while (true) {
      const existing = await mongoose.models.Property.findOne({
        slug: generatedSlug,
        _id: { $ne: this._id },
      });

      if (!existing) {
        this.slug = generatedSlug;
        break;
      }

      generatedSlug = `${baseSlug}-${count}`;
      count++;
    }
  }

  // Set default coverImage if images exist and coverImage is missing
  if ((!this.coverImage || !this.coverImage.url) && this.images && this.images.length > 0) {
    this.coverImage = {
      url: this.images[0].url,
      publicId: this.images[0].publicId,
    };
  }

  next();
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
