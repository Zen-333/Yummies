import {Request, Response} from 'express';
import { NewRecipe, Recipe } from '../types/recipe';
import {supabase} from "../lib/supabase"
import { AuthRequest } from '../middleware/auth.middleware'

export const getAllRecipe = async (req: AuthRequest, res: Response) => {

    const {data, error} = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', req.userId)
        .order('created_at', {ascending: false});

    if(error){
        res.status(500).json({success: false, message: error.message});
        return;
    }

    res.status(200).json({success: true, message: "GET ALL RECIPES", recipies: data});
};

export const addRecipe = async (req: AuthRequest, res: Response) => {
    const {name, notes, images_url, steps, ingredients, time_hr, time_mi, cost} = req.body; //as NewRecipe;

    if(!name || name.trim() === "")
    {
        res.status(400)
        .json({success: false, message: "PLEASE PROVIDE A RECIPE NAME"});
        return;
    }

    const {data, error} = await supabase
        .from('recipes')
        .insert([{name, notes, images_url, steps, ingredients, time_hr, time_mi, cost, user_id: req.userId}])
        .select()
        .single();

    if(error){
        console.error("SUPABASE ERROR:", error);
        res.status(500).json({success: false, message: error.message});
        return;
    }

    res.status(201).json({success: true, message: "RECIPE ADDED", recipe: data});
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
    const {id} = req.params;
    const updates = req.body as Partial<NewRecipe>;

    const {data, error} = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

    if(error){
        res.status(404).json({success: false, message: "COULDN'T UPDATE RECIPE"});
        return;
    }

    res.status(200).json({success: true, message: "RECIPE UPDATED SUCCESSFULLY", recipe: data});
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {

    const { id } = req.params;

    const {error} = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('user_id',req.userId);

    if(error){
        res.status(404).json({success: false, message: "INVALID RECIPE ID", id});
        return;
    }

    res.status(200).json({success: true, message: "RECIPE DELETED", id});
};