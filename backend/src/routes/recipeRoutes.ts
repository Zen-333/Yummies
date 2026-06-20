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
import { asyncHandler } from "../utils/asyncHandler"

const router = express.Router();

router.use(asyncHandler(requireAuth));

router.get("/", asyncHandler(getAllRecipe));
router.post("/", validateBody(createRecipeSchema), asyncHandler(addRecipe));
router.put("/:id", validateBody(updateRecipeSchema), asyncHandler(updateRecipe));
router.delete("/:id", asyncHandler(deleteRecipe));

export default router;