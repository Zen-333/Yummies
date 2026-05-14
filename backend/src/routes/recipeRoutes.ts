import express from "express";

import {
    addRecipe,
    deleteRecipe,
    getAllRecipe,
    updateRecipe
} from "../controllers/recipe.controller"
import { requireAuth } from "../middleware/auth.middleware"

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllRecipe);
router.post("/", addRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;