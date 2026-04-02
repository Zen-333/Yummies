import {Request, Response} from 'express';
import { NewRecipe, Recipe } from '../types/recipe';

let RecipeData: Array<Recipe> = [];

export const getAllRecipe = async (req: Request, res: Response) => {

    res.status(200).json({success: true, message: "GET ALL RECIPIES", recipies: RecipeData});
};

export const addRecipe = (req: Request, res: Response) => {
    const {name, notes, imagesURL, steps, ingredients} = req.body as NewRecipe;

    if(!name || name.trim() === "")
    {
        res.status(400)
        .json({success: false, message: "PLEASE PROVIDE A RECIPE NAME"});
        return;
    }

    const userRecipe: Recipe = {
        _id: String(RecipeData.length + 1),
        name: name,
        notes: notes,
        imagesURL: imagesURL,
        steps: steps,
        ingredients: ingredients,
    }
    
    RecipeData.push(userRecipe);
    res.json({success: true, message: "RECIPE ADDED", recipies: RecipeData});
};

export const updateRecipe = (req: Request, res: Response) => {
    const {name, notes, imagesURL, steps, ingredients} = req.body as NewRecipe;
    const { id } = req.params;

    const index = RecipeData.findIndex(item => item._id === id);
    // findIndex returns -1 if not found

    if(index !== -1)
    {
        if(name !== undefined && name != RecipeData[index].name)  RecipeData[index].name = name;
        if(notes !== undefined && notes != RecipeData[index].notes)  RecipeData[index].notes = notes;
        if(ingredients !== undefined && ingredients != RecipeData[index].ingredients)  RecipeData[index].ingredients = ingredients;
        if(steps !== undefined && steps != RecipeData[index].steps)  RecipeData[index].steps = steps;
        if(imagesURL !== undefined && imagesURL != RecipeData[index].imagesURL)  RecipeData[index].imagesURL = imagesURL;

        res.status(200).json({success: true, message: "RECIPE UPDATED SUCCESSFULY"});
        return;
    }

    res.status(404).json({success: false, message: "COUDN'T UPDATE RECIPE"});
};

export const deleteRecipe = (req: Request, res: Response) => {

    const { id } = req.params;

    const index = RecipeData.findIndex(item => item._id === id);
    // findIndex returns -1 if not found

    if(index !== -1)
    {
        RecipeData.splice(index, 1)
        res.status(200).json({success: true, message: "RECIPE DELETED", id: id});
        return;
    }

    res.status(404).json({success: false, message: "INVALID RECIPE ID", id: id});

};