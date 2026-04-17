import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { validate } from '../middleware/validate.js'
import { z } from 'zod'

const router = Router()

const createPropertySchema = z.object({
  address_line1: z.string().min(1),
  address_line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().default('MA'),
  zip_code: z.string().min(5),
  unit_number: z.string().optional(),
  property_type: z.enum([
    'single_family',
    'multi_family',
    'condo',
    'apartment',
  ]),
  monthly_rent: z.number().positive(),
  tenant_name: z.string().optional(),
  tenant_email: z.string().email().optional(),
  lease_start_date: z.string().optional(),
  lease_end_date: z.string().optional(),
  security_deposit: z.number().optional(),
  last_month_deposit: z.number().optional(),
})

const updatePropertySchema = createPropertySchema.partial()

// GET /api/properties
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, memberships(id, status, coverage_end_date)')
    .eq('user_id', req.userId!)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

// GET /api/properties/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, memberships(id, status, coverage_start_date, coverage_end_date, premium_amount)')
    .eq('id', req.params.id)
    .eq('user_id', req.userId!)
    .single()

  if (error) {
    res.status(404).json({ error: 'Property not found' })
    return
  }
  res.json(data)
})

// POST /api/properties
router.post(
  '/',
  validate(createPropertySchema),
  async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert({ ...req.body, user_id: req.userId })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(201).json(data)
  }
)

// PATCH /api/properties/:id
router.patch(
  '/:id',
  validate(updatePropertySchema),
  async (req: Request, res: Response) => {
    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('properties')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId!)
      .single()

    if (!existing) {
      res.status(404).json({ error: 'Property not found' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.json(data)
  }
)

// DELETE /api/properties/:id (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .update({ status: 'archived' })
    .eq('id', req.params.id)
    .eq('user_id', req.userId!)
    .select()
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Property not found' })
    return
  }
  res.json({ message: 'Property archived' })
})

export default router
