import { getStreamToken } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import express from "express";
const router = express.Router();
router.get('/token',protectRoute,getStreamToken);
export default router;