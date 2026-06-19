import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: result.error.flatten().fieldErrors,
      })
      return
    }

    req.body = result.data
    next()
  }
}