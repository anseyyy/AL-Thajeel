import express from "express";
import {
  createTestimonial,
  getAdminTestimonials,
  getAdminTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../../controllers/testimonial/testimonialController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Protect all admin testimonial routes with JWT auth & Admin check
router.use(authMiddleware, adminMiddleware);

router.route("/")
  .post(upload.single("image"), createTestimonial)
  .get(getAdminTestimonials);

router.route("/:id")
  .get(getAdminTestimonialById)
  .put(upload.single("image"), updateTestimonial)
  .delete(deleteTestimonial);

export default router;
