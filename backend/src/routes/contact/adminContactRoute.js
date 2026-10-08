import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../../controllers/contact/contactController.js";

const router = Router();

// Protect all admin contact routes
router.use(authMiddleware);

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.patch("/:id", updateContactStatus);
router.delete("/:id", deleteContact);

export default router;
