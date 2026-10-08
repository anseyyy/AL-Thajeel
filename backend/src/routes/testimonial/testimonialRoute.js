import express from "express";
import {
  getPublicTestimonials,
  getPublicTestimonialById,
} from "../../controllers/testimonial/testimonialController.js";

const router = express.Router();

// Public routes
router.get("/", getPublicTestimonials);
router.get("/:id", getPublicTestimonialById);

export default router;
