import { Router } from "express";
import { authCallBack, getMe } from "../controllers/authController";
import { protectRoute } from "../middleware/auth";
const router = Router();

router.get("/me", protectRoute, getMe)
router.post("callback", authCallBack)



export default router;