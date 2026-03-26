import {Request, Response} from 'express';

export const getAllRecipe = async (req: Request, res: Response) => {
    res.json({success: true, message: "GET ALL RECIPE"});
};

export const deleteRecipe = (req: Request, res: Response) => {
    res.json({success: true, message: "DELETE RECIPE"});
};

export const addRecipe = (req: Request, res: Response) => {
    res.json({success: true, message: "ADD RECIPE"});
};
