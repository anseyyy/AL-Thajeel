import express from "express";
import {
  createProperty,
  getAllAdminProperties,
  getAdminPropertyById,
  updateProperty,
  deleteProperty,
} from "../../controllers/property/propertyController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// All admin property routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// POST /api/admin/properties (Create property with optional image upload)
router.post("/", upload.array("images", 10), createProperty);

// GET /api/admin/properties (Get all properties with filtering, search, pagination)
router.get("/", getAllAdminProperties);

// GET /api/admin/properties/:id (Get single property by ID)
router.get("/:id", getAdminPropertyById);

// PUT /api/admin/properties/:id (Update property with optional new image uploads)
router.put("/:id", upload.array("images", 10), updateProperty);

// DELETE /api/admin/properties/:id (Delete property and associated Cloudinary images)
router.delete("/:id", deleteProperty);

export default router;
