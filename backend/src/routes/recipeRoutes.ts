import express from "express";

import {
    addRecipe,
    deleteRecipe,
    getAllRecipe,
    updateRecipe
} from "../controllers/recipe.controller"
import { requireAuth } from "../middleware/auth.middleware"
import { validateBody } from "../middleware/validate.middleware"
import { createRecipeSchema, updateRecipeSchema } from "../schemas/recipe.schema"

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllRecipe);
router.post("/", validateBody(createRecipeSchema), addRecipe);
router.put("/:id", validateBody(updateRecipeSchema), updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;