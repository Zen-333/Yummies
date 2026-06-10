import express from "express"
import {deleteAccount} from "./controllers/user.controller";
import {requireAuth} from "../middleware/auth.middleware"

const router = express.Router();
router.use(requireAuth);
router.delete("/account", deleteAccount);

export default router;