import express from "express"
import {deleteAccount} from "../controllers/user.controller";
import {requireAuth} from "../middleware/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"

const router = express.Router();
router.use(asyncHandler(requireAuth));
router.delete("/account", asyncHandler(deleteAccount));

export default router;