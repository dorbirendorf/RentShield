import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

// GET /api/memberships
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('memberships')
    .select('*, properties(address_line1, unit_number, city, state, monthly_rent)')
    .eq('user_id', req.userId!)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

// GET /api/memberships/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('memberships')
    .select(`
      *,
      properties(address_line1, unit_number, city, state, zip_code, monthly_rent, tenant_name),
      payments(id, amount, status, paid_at, receipt_url)
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.userId!)
    .single()

  if (error) {
    res.status(404).json({ error: 'Membership not found' })
    return
  }
  res.json(data)
})

export default router
