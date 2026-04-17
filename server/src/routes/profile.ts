import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'

const router = Router()

const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
})

// GET /api/profile
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.userId!)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

// PATCH /api/profile
router.patch(
  '/',
  validate(updateProfileSchema),
  async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(req.body)
      .eq('id', req.userId!)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.json(data)
  }
)

export default router
