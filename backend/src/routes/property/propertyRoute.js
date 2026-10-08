import express from "express";
import {
  getPublicProperties,
  getPublicPropertyBySlug,
} from "../../controllers/property/propertyController.js";

const router = express.Router();

// GET /api/properties (Public listing with filtering, pagination, search)
router.get("/", getPublicProperties);

// GET /api/properties/:slug (Public single property by slug)
router.get("/:slug", getPublicPropertyBySlug);

export default router;
