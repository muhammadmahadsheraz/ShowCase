import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  getActiveSessions,
  getPastSessions,
  getSessionById,
  joinSessionById,
  endSessionById,
} from "../controllers/sessionController.js";

const router = express.Router();

// Routes
router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getPastSessions);
router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSessionById);
router.post("/:id/end", protectRoute, endSessionById);

export default router;
