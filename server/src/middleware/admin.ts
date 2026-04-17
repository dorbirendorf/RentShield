import { Request, Response, NextFunction } from 'express'

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.userRole !== 'admin') {
    res.status(403).json({ error: 'Admin access required' })
    return
  }
  next()
}
