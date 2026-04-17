import { Router, Request, Response } from 'express'
import { stripe } from '../../lib/stripe.js'
import { supabaseAdmin } from '../../lib/supabase.js'
import Stripe from 'stripe'

const router = Router()

// POST /api/webhooks/stripe
// Note: this route must receive the raw body for signature verification
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).json({ error: `Webhook Error: ${err.message}` })
    return
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, propertyId, membershipId } = session.metadata!

      // Activate membership
      const today = new Date()
      const endDate = new Date(today)
      endDate.setFullYear(endDate.getFullYear() + 1)

      await supabaseAdmin
        .from('memberships')
        .update({
          status: 'active',
          coverage_start_date: today.toISOString().split('T')[0],
          coverage_end_date: endDate.toISOString().split('T')[0],
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', membershipId)

      // Record payment
      await supabaseAdmin.from('payments').insert({
        user_id: userId,
        membership_id: membershipId,
        amount: (session.amount_total || 0) / 100,
        payment_type: 'premium',
        status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        receipt_url: null,
        description: `Annual coverage premium`,
        paid_at: new Date().toISOString(),
      })

      // Create notification
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        type: 'payment_received',
        title: 'Membership Activated',
        message: 'Your RentShield coverage is now active for 1 year.',
        link: `/dashboard/memberships`,
      })

      console.log(`Membership ${membershipId} activated for user ${userId}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

export default router
