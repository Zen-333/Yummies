import express from "express";

import {
    addRecipe,
    deleteRecipe,
    getAllRecipe
} from "../controllers/recipe.controller"

const router = express.Router();

router.get("/", getAllRecipe);
router.post("/", addRecipe);
router.delete("/", deleteRecipe);

export default router;