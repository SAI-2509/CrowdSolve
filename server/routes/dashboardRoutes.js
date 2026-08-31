import { Router } from "express";
import { getAuthorityDashboard, getPublicOverview } from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/public-overview", getPublicOverview);
router.get("/authority", protect, requireRole("authority"), getAuthorityDashboard);

export default router;
