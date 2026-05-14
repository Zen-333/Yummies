import {Request, Response, NextFunction} from 'express'
import {supabase} from '../lib/supabase'

export interface AuthRequest extends Request {
    userId?: string
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({success: false, message: 'no token provided'})
        return;
    }

    const token = authHeader.split(' ')[1]

    const {data: {user}, error} = await supabase.auth.getUser(token)

    if(error || !user){
        res.status(401).json({success: false, message: 'invalid token'})
        return
    }

    req.userId = user.id
    next()
}