import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import dotenv from 'dotenv'

import authRoute from './routes/auth.routes.js'
import authRoutes from './routes/OAuth.routes.js'
import productRoute from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'

import './config/passport.js'

dotenv.config()

const app = express()
   app.set('trust proxy', 1)

// CORS MUST come before routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use('/api/auth', authRoute)
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRouter)

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message })
})

export default app