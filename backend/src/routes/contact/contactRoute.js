import { Router } from "express";
import { submitContact } from "../../controllers/contact/contactController.js";

const router = Router();

// Public: Submit contact inquiry
router.post("/", submitContact);

export default router;
