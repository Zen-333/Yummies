import { Response } from "express";
import {supabase} from '../lib/supabase'
import {AuthRequest} from '../middleware/auth.middleware'

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    if(!req.userId)
    {
        res.status(401).json({success: false, message: 'Unauthorized'});
        return;
    }

    const {error} = await supabase.auth.admin.deleteUser(req.userId);

    if(error)
    {
        res.status(500).json({success: false, message: error.message});
        return;
    }

    res.status(200).json({seccess: true, message: "Account deleted"});
}