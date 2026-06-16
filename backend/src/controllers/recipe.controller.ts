import { Response} from 'express';
import { NewRecipe } from '../types/recipe';
import { supabase } from "../lib/supabase"
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

    res.status(200).json({success: true, message: "Get all recipes", recipes: data});
};

export const addRecipe = async (req: AuthRequest, res: Response) => {
    const {name, notes, images_url, steps, ingredients, time_hr, time_mi, cost, cover_image_url} = req.body;

    if(!name || name.trim() === "")
    {
        res.status(400)
        .json({success: false, message: "Please provide a recipe name"});
        return;
    }

    const {data, error} = await supabase
        .from('recipes')
        .insert([{name, notes, images_url, steps, ingredients, time_hr, time_mi, cost, cover_image_url, user_id: req.userId}])
        .select()
        .single();

        /* .select() forces Supabase to instantly fetch the newly created row and pass it back into our data variable */
       /*  .single(): Tells Supabase that we are only inserting one row, so please return data as a single, neat object {...} instead of a single-item array [{...}]. */

    if(error){
        console.error("Supabase error:", error);
        res.status(500).json({success: false, message: error.message});
        return;
    }

    res.status(201).json({success: true, message: "Recipe added", recipe: data});
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
    const {id} = req.params;
    const updates = req.body as Partial<NewRecipe>;
     /* A Partial type tells TypeScript: "This object can contain any combination of fields from a recipe, but none of them are strictly required." */

    const {data, error} = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

    if(error){
        res.status(404).json({success: false, message: "Couldn't update recipe"});
        return;
    }

    res.status(200).json({success: true, message: "Recipe updated successfully", recipe: data});
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {

    const { id } = req.params;

    const {error} = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('user_id',req.userId);

    if(error){
        res.status(404).json({success: false, message: "Invalid recipe ID", id});
        return;
    }

    res.status(200).json({success: true, message: "recipe deleted", id});
};