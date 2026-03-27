import express from "express";

import {
    addRecipe,
    deleteRecipe,
    getAllRecipe,
    updateRecipe
} from "../controllers/recipe.controller"

const router = express.Router();

router.get("/", getAllRecipe);
router.post("/", addRecipe);
router.put("/id:", updateRecipe);
router.delete("/id:", deleteRecipe);

export default router;