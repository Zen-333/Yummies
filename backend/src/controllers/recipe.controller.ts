import {Request, Response} from 'express';
import { NewRecipe, Recipe } from '../types/recipe';

let RecipeData: Array<Recipe> = [];

export const getAllRecipe = async (req: Request, res: Response) => {

    if(RecipeData.length <= 0) 
    {
        res.status(400).json({success: false, message: "NO RECIPIES FOUND"});
        return;
    }

    res.json({success: true, message: "GET ALL RECIPIES", recipies: RecipeData});
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

    if(RecipeData.some(item => item._id === id))
    {
        const index = RecipeData.findIndex(item => item._id === id);

        if(name && name != RecipeData[index].name)  RecipeData[index].name = name;
        if(notes && notes != RecipeData[index].notes)  RecipeData[index].notes = notes;
        if(ingredients && ingredients != RecipeData[index].ingredients)  RecipeData[index].ingredients = ingredients;
        if(steps && steps != RecipeData[index].steps)  RecipeData[index].steps = steps;
        if(imagesURL && imagesURL != RecipeData[index].imagesURL)  RecipeData[index].imagesURL = imagesURL;

        res.status(200).json({success: true, message: "RECIPE UPDATED SUCCESSFULY"});
        return;
    }

    res.status(400).json({success: false, message: "COUDN'T UPDATE RECIPE"});
};

export const deleteRecipe = (req: Request, res: Response) => {

    const { id } = req.params;

    if(RecipeData.some(item => item._id === id))
    {
        RecipeData = RecipeData.filter(function(item) {return item._id != id});
        res.status(200).json({success: true, message: "RECIPE DELETED", id: id});
        return;
    }

    res.status(406).json({success: false, message: "INVALID RECIPE ID", id: id});

};