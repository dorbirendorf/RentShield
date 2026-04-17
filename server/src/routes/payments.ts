import { Router, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { stripe } from '../lib/stripe.js'

const router = Router()

// POST /api/payments/create-checkout
router.post('/create-checkout', async (req: Request, res: Response) => {
  const { propertyId } = req.body

  // Get property details
  const { data: property } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .eq('user_id', req.userId!)
    .single()

  if (!property) {
    res.status(404).json({ error: 'Property not found' })
    return
  }

  // Check if property already has active membership
  const { data: activeMembership } = await supabaseAdmin
    .from('memberships')
    .select('id')
    .eq('property_id', propertyId)
    .eq('status', 'active')
    .single()

  if (activeMembership) {
    res.status(400).json({ error: 'Property already has an active membership' })
    return
  }

  // Get or create Stripe customer
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', req.userId!)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile!.email,
      name: profile!.full_name,
      metadata: { userId: req.userId! },
    })
    customerId = customer.id

    await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', req.userId!)
  }

  // Create pending membership
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .insert({
      user_id: req.userId,
      property_id: propertyId,
      premium_amount: property.monthly_rent,
      status: 'pending',
    })
    .select()
    .single()

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(property.monthly_rent * 100),
          product_data: {
            name: `RentShield Annual Coverage`,
            description: `Coverage for ${property.address_line1}${property.unit_number ? `, Unit ${property.unit_number}` : ''}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: req.userId!,
      propertyId,
      membershipId: membership!.id,
    },
    success_url: `${process.env.FRONTEND_URL}/dashboard/memberships?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard/properties/${propertyId}`,
  })

  res.json({ checkoutUrl: session.url })
})

// GET /api/payments/history
router.get('/history', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*, memberships(property_id, properties(address_line1, unit_number))')
    .eq('user_id', req.userId!)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

export default router
