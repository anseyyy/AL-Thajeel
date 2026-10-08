import mongoose from "mongoose";
import Testimonial from "../../models/Testimonial.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

/**
 * Get all published testimonials (Public)
 * GET /api/testimonials
 */
export const getPublicTestimonials = async (req, res, next) => {
  try {
    const { featured, limit = 6 } = req.query;

    const query = {
      isPublished: true,
    };

    if (featured === "true") {
      query.isFeatured = true;
    }

    const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 6));

    const testimonials = await Testimonial.find(query)
      .select("-createdBy -__v")
      .sort({ isFeatured: -1, date: -1 })
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single published testimonial by ID (Public)
 * GET /api/testimonials/:id
 */
export const getPublicTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findOne({
      _id: id,
      isPublished: true,
    }).select("-createdBy -__v");

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

/**
 * Create a new testimonial (Admin)
 * POST /api/admin/testimonials
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const {
      name,
      role = "",
      message,
      rating = 5,
      date,
      isFeatured = false,
      isPublished = true,
    } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide both the person's name and testimonial message",
      });
    }

    let imageObj = { url: "", publicId: "" };

    // Upload image to Cloudinary if file supplied
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "al-thajeel/testimonials"
      );
      imageObj = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    } else if (req.body.imageUrl) {
      imageObj.url = req.body.imageUrl;
    }

    const newTestimonial = await Testimonial.create({
      name: name.trim(),
      role: role.trim(),
      message: message.trim(),
      rating: Number(rating) || 5,
      date: date ? new Date(date) : new Date(),
      image: imageObj,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isPublished: isPublished === "true" || isPublished === true,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all testimonials with pagination & filter (Admin)
 * GET /api/admin/testimonials
 */
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      featured,
      published,
    } = req.query;

    const query = {};

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    if (published !== undefined) {
      query.isPublished = published === "true";
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { role: searchRegex },
        { message: searchRegex },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Testimonial.countDocuments(query);
    const testimonials = await Testimonial.find(query)
      .populate("createdBy", "name email")
      .sort({ isFeatured: -1, date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      data: testimonials,
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
 * Get single testimonial by ID for admin (Admin)
 * GET /api/admin/testimonials/:id
 */
export const getAdminTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a testimonial (Admin)
 * PUT /api/admin/testimonials/:id
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const {
      name,
      role,
      message,
      rating,
      date,
      isFeatured,
      isPublished,
      removeImage,
    } = req.body;

    if (name !== undefined) testimonial.name = name.trim();
    if (role !== undefined) testimonial.role = role.trim();
    if (message !== undefined) testimonial.message = message.trim();
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (date !== undefined) testimonial.date = new Date(date);
    if (isFeatured !== undefined) {
      testimonial.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (isPublished !== undefined) {
      testimonial.isPublished = isPublished === "true" || isPublished === true;
    }

    // Handle image replacement / upload
    if (req.file) {
      // Delete old Cloudinary image if it exists
      if (testimonial.image?.publicId) {
        await deleteFromCloudinary(testimonial.image.publicId);
      }

      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "al-thajeel/testimonials"
      );
      testimonial.image = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    } else if (removeImage === "true" || removeImage === true) {
      if (testimonial.image?.publicId) {
        await deleteFromCloudinary(testimonial.image.publicId);
      }
      testimonial.image = { url: "", publicId: "" };
    }

    await testimonial.save();

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a testimonial and its Cloudinary image (Admin)
 * DELETE /api/admin/testimonials/:id
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Delete associated image from Cloudinary
    if (testimonial.image?.publicId) {
      await deleteFromCloudinary(testimonial.image.publicId);
    }

    await Testimonial.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
