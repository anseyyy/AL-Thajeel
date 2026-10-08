import mongoose from "mongoose";
import Property, { slugifyText } from "../../models/Property.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";

// Helper to safely parse JSON strings or return original value
const parseJsonField = (val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

/**
 * Create a new property (Admin)
 * POST /api/admin/properties
 */
export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      purpose,
      status = "active",
      price,
      priceLabel,
      currency = "AED",
      bedrooms,
      bathrooms,
      area,
      areaUnit = "sq.ft",
      location,
      features,
      isFeatured,
      published,
    } = req.body;

    if (!title || !description || !propertyType || !purpose || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, description, propertyType, purpose, and price",
      });
    }

    const willBeFeatured = isFeatured === "true" || isFeatured === true;
    if (willBeFeatured) {
      const featuredCount = await Property.countDocuments({ isFeatured: true });
      if (featuredCount >= 3) {
        return res.status(400).json({
          success: false,
          message: "Already 3 properties featured! You can only feature up to 3 properties at a time. Please remove one first.",
        });
      }
    }

    // Process image uploads if provided in request
    let uploadedImages = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "al-thajeel/properties")
      );
      uploadedImages = await Promise.all(uploadPromises);
    } else if (req.body.images) {
      const parsed = parseJsonField(req.body.images);
      uploadedImages = Array.isArray(parsed) ? parsed : [parsed];
    }

    // Determine cover image
    let coverImageObj = null;
    if (req.body.coverImage) {
      coverImageObj = parseJsonField(req.body.coverImage);
    } else if (uploadedImages.length > 0) {
      coverImageObj = uploadedImages[0];
    }

    // Parse location and features if needed
    const parsedLocation = parseJsonField(location) || {};
    let parsedFeatures = parseJsonField(features) || [];
    if (typeof parsedFeatures === "string") {
      parsedFeatures = parsedFeatures.split(",").map((f) => f.trim()).filter(Boolean);
    }

    // Status logic
    const propertyStatus = status || "active";
    let isPublished = published !== undefined ? Boolean(published === "true" || published === true) : true;
    let soldAtDate = null;

    if (propertyStatus === "sold") {
      soldAtDate = new Date();
      // Default to unpublished when marked as sold unless explicitly set
      if (published === undefined) {
        isPublished = false;
      }
    }

    const newProperty = new Property({
      title: title.trim(),
      description: description.trim(),
      propertyType,
      purpose,
      status: propertyStatus,
      price: Number(price),
      priceLabel: priceLabel ? priceLabel.trim() : undefined,
      currency: currency || "AED",
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      area: area ? Number(area) : 0,
      areaUnit: areaUnit || "sq.ft",
      location: {
        emirate: parsedLocation.emirate || "",
        city: parsedLocation.city || "",
        community: parsedLocation.community || "",
        address: parsedLocation.address || "",
      },
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      images: uploadedImages,
      coverImage: coverImageObj,
      isFeatured: isFeatured === "true" || isFeatured === true,
      published: isPublished,
      soldAt: soldAtDate,
      createdBy: req.user?._id,
    });

    await newProperty.save();

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all properties for admin with filtering & pagination (Admin)
 * GET /api/admin/properties
 */
export const getAllAdminProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      purpose,
      search,
      emirate,
      featured,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (type) {
      query.propertyType = type;
    }

    if (purpose) {
      query.purpose = purpose;
    }

    if (emirate) {
      query["location.emirate"] = new RegExp(emirate, "i");
    }

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.community": searchRegex },
        { "location.city": searchRegex },
        { "location.emirate": searchRegex },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate("createdBy", "name email")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: totalPages || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single property by ID for admin (Admin)
 * GET /api/admin/properties/:id
 */
export const getAdminPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id).populate("createdBy", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a property (Admin)
 * PUT /api/admin/properties/:id
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const {
      title,
      description,
      propertyType,
      purpose,
      status,
      price,
      priceLabel,
      currency,
      bedrooms,
      bathrooms,
      area,
      areaUnit,
      location,
      features,
      isFeatured,
      published,
      removeImageIds,
      coverImage,
    } = req.body;

    // Handle title & slug update
    if (title && title.trim() !== property.title) {
      property.title = title.trim();
      const baseSlug = slugifyText(property.title);
      let generatedSlug = baseSlug;
      let count = 1;

      while (true) {
        const existing = await Property.findOne({
          slug: generatedSlug,
          _id: { $ne: property._id },
        });

        if (!existing) {
          property.slug = generatedSlug;
          break;
        }

        generatedSlug = `${baseSlug}-${count}`;
        count++;
      }
    }

    if (description) property.description = description.trim();
    if (propertyType) property.propertyType = propertyType;
    if (purpose) property.purpose = purpose;
    if (price !== undefined) property.price = Number(price);
    if (priceLabel !== undefined) property.priceLabel = priceLabel;
    if (currency) property.currency = currency;
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (area !== undefined) property.area = Number(area);
    if (areaUnit) property.areaUnit = areaUnit;

    if (location) {
      const parsedLoc = parseJsonField(location);
      property.location = {
        emirate: parsedLoc.emirate !== undefined ? parsedLoc.emirate : property.location?.emirate,
        city: parsedLoc.city !== undefined ? parsedLoc.city : property.location?.city,
        community: parsedLoc.community !== undefined ? parsedLoc.community : property.location?.community,
        address: parsedLoc.address !== undefined ? parsedLoc.address : property.location?.address,
      };
    }

    if (features !== undefined) {
      let parsedFeat = parseJsonField(features);
      if (typeof parsedFeat === "string") {
        parsedFeat = parsedFeat.split(",").map((f) => f.trim()).filter(Boolean);
      }
      property.features = Array.isArray(parsedFeat) ? parsedFeat : [];
    }

    if (isFeatured !== undefined) {
      property.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    // Status change logic
    if (status && status !== property.status) {
      if (status === "sold") {
        property.status = "sold";
        property.soldAt = new Date();
        // Default published to false when marked sold, unless explicitly set
        if (published === undefined) {
          property.published = false;
        }
      } else if (status === "active") {
        // Reactivating sold property
        property.status = "active";
        property.soldAt = null;
        if (published === undefined) {
          property.published = true;
        }
      } else {
        property.status = status;
      }
    }

    if (published !== undefined) {
      property.published = published === "true" || published === true;
    }

    if (isFeatured !== undefined) {
      const willBeFeatured = isFeatured === "true" || isFeatured === true;
      if (willBeFeatured && !property.isFeatured) {
        const featuredCount = await Property.countDocuments({
          isFeatured: true,
          _id: { $ne: property._id },
        });
        if (featuredCount >= 3) {
          return res.status(400).json({
            success: false,
            message:
              "Already 3 properties featured! You can only feature up to 3 properties at a time. Please remove one first.",
          });
        }
      }
      property.isFeatured = willBeFeatured;
    }

    // If reordered existingImages passed, respect the new ordering
    if (req.body.existingImages) {
      const parsedExisting = parseJsonField(req.body.existingImages);
      if (Array.isArray(parsedExisting)) {
        property.images = parsedExisting;
      }
    }

    // Delete requested images from Cloudinary
    if (removeImageIds) {
      const idsToDelete = Array.isArray(removeImageIds)
        ? removeImageIds
        : parseJsonField(removeImageIds);

      if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
        for (const pid of idsToDelete) {
          await deleteFromCloudinary(pid);
        }
        property.images = property.images.filter(
          (img) => !idsToDelete.includes(img.publicId)
        );
      }
    }

    // Upload and append new images if provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "al-thajeel/properties")
      );
      const newImages = await Promise.all(uploadPromises);
      property.images = [...property.images, ...newImages];
    }

    // Assign sequential order index
    property.images = property.images.map((img, index) => ({
      url: img.url,
      publicId: img.publicId || "",
      order: index,
    }));

    // Update cover image if requested or ensure fallback
    if (coverImage) {
      property.coverImage = parseJsonField(coverImage);
    } else if (
      (!property.coverImage || !property.coverImage.url) &&
      property.images.length > 0
    ) {
      property.coverImage = property.images[0];
    } else if (property.images.length === 0) {
      property.coverImage = undefined;
    }

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a property and its Cloudinary assets (Admin)
 * DELETE /api/admin/properties/:id
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Delete all associated images from Cloudinary
    if (property.images && property.images.length > 0) {
      for (const img of property.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
    }

    // Delete cover image if it has unique publicId
    if (
      property.coverImage &&
      property.coverImage.publicId &&
      !property.images.some((img) => img.publicId === property.coverImage.publicId)
    ) {
      await deleteFromCloudinary(property.coverImage.publicId);
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

/**
 * Get all active and published properties (Public)
 * GET /api/properties
 */
export const getPublicProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      purpose,
      emirate,
      featured,
      search,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
    } = req.query;

    // Strict public visibility requirements: status = active, published = true
    const query = {
      status: "active",
      published: true,
    };

    if (type) {
      query.propertyType = type;
    }

    if (purpose) {
      query.purpose = purpose;
    }

    if (emirate) {
      query["location.emirate"] = new RegExp(`^${emirate.trim()}$`, "i");
    }

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      query.bathrooms = Number(bathrooms);
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.community": searchRegex },
        { "location.city": searchRegex },
        { "location.emirate": searchRegex },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 12));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .select("-createdBy -__v")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: totalPages || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single active and published property by slug (Public)
 * GET /api/properties/:slug
 */
export const getPublicPropertyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Property slug is required",
      });
    }

    const property = await Property.findOne({
      slug: slug.toLowerCase(),
      status: "active",
      published: true,
    }).select("-createdBy -__v");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};
