import { Response, NextFunction } from 'express'

export const asyncHandler = <Req>(
  handler: (req: Req, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Req, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}