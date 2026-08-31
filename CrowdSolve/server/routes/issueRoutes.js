import { Router } from "express";
import {
  addComment,
  createIssue,
  getIssues,
  getMyIssues,
  updateIssueStatus,
  upvoteIssue
} from "../controllers/issueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", protect, getIssues);
router.get("/mine", protect, getMyIssues);
router.post("/", protect, requireRole("citizen"), upload.single("media"), createIssue);
router.post("/:issueId/upvote", protect, upvoteIssue);
router.post("/:issueId/comments", protect, addComment);
router.patch("/:issueId/status", protect, requireRole("authority"), upload.single("resultMedia"), updateIssueStatus);

export default router;
