import mongoose from "mongoose";
import Contact from "../../models/Contact.js";

/**
 * Public: Submit a contact form / inquiry
 * POST /api/contact
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and phone number.",
      });
    }

    const newContact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message ? message.trim() : "",
      status: "new",
    });

    await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting Al Thajeel Real Estates. Our advisory team will reach out to you shortly.",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all contact submissions with pagination & filter
 * GET /api/admin/contacts
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Contact.countDocuments(query);
    const newCount = await Contact.countDocuments({ status: "new" });
    const readCount = await Contact.countDocuments({ status: "read" });

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      data: contacts,
      counts: {
        total: await Contact.countDocuments(),
        new: newCount,
        read: readCount,
      },
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
 * Admin: Get single contact submission by ID
 * GET /api/admin/contacts/:id
 */
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update contact status (e.g. read/new/replied) or notes
 * PATCH /api/admin/contacts/:id
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    if (status) contact.status = status;
    if (notes !== undefined) contact.notes = notes;

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a contact submission
 * DELETE /api/admin/contacts/:id
 */
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
