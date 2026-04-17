import express from 'express'
import cors from 'cors'
import { authMiddleware } from './middleware/auth.js'
import { adminMiddleware } from './middleware/admin.js'
import profileRoutes from './routes/profile.js'
import propertiesRoutes from './routes/properties.js'
import paymentsRoutes from './routes/payments.js'
import membershipsRoutes from './routes/memberships.js'
import dashboardRoutes from './routes/dashboard.js'
import stripeWebhookRoutes from './routes/webhooks/stripe.js'

const app = express()

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)

// Stripe webhooks need raw body — must come BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookRoutes)

// Parse JSON for all other routes
app.use(express.json())

// Auth middleware (skips webhook routes)
app.use('/api', authMiddleware)

// Routes
app.use('/api/profile', profileRoutes)
app.use('/api/properties', propertiesRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/memberships', membershipsRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Admin routes
// app.use('/api/admin/dashboard', adminMiddleware, adminDashboardRoutes)
// app.use('/api/admin/cases', adminMiddleware, adminCasesRoutes)
// app.use('/api/admin/users', adminMiddleware, adminUsersRoutes)
// app.use('/api/admin/financials', adminMiddleware, adminFinancialsRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
