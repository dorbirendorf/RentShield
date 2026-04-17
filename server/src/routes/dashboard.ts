import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  const userId = req.userId!

  const [propertiesRes, membershipsRes, casesRes] = await Promise.all([
    supabaseAdmin
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'archived'),
    supabaseAdmin
      .from('memberships')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active'),
    supabaseAdmin
      .from('cases')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('status', 'in', '("resolved","withdrawn","denied")'),
  ])

  res.json({
    properties: propertiesRes.count || 0,
    activeMemberships: membershipsRes.count || 0,
    openCases: casesRes.count || 0,
  })
})

export default router
