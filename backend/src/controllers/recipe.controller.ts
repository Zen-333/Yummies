import {Request, Response} from 'express';
import { Recipe } from '../types/recipe';

export const getAllRecipe = async (req: Request, res: Response) => {
    res.json({success: true, message: "GET ALL RECIPE"});
};

export const addRecipe = (req: Request, res: Response) => {
    const {name, notes, imagesURL, steps, ingredients} = req.body;

    if(name === "")
    {
        res.status(500);
        res.json({success: false, message: "PLEASE PROVIDE A NAME"});
        return;
    }
    
    res.json({success: true, message: "ADD A FEW RECIPE"});
};

export const updateRecipe = (req: Request, res: Response) => {
    res.json({success: true, message: "UPDATE RECIPE"});
};

export const deleteRecipe = (req: Request, res: Response) => {
    res.json({success: true, message: "DELETE RECIPE"});
};