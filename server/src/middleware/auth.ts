import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string
      userRole?: string
      accessToken?: string
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Skip auth for webhook routes (they use Stripe signature verification)
  if (req.path.startsWith('/api/webhooks')) {
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' })
    return
  }

  const token = authHeader.split(' ')[1]

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  // Fetch profile to get role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  req.userId = user.id
  req.userRole = profile?.role || 'landlord'
  req.accessToken = token

  next()
}
