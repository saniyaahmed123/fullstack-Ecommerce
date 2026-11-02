import { addToCart, getCart, updateCartItem, removeCartItem } from '../controllers/cart.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

import express from 'express'
const router = express.Router()
router.post('/add', authenticateToken, addToCart)
router.get('/', authenticateToken, getCart)
router.put('/:productId', authenticateToken, updateCartItem)
router.delete('/:productId', authenticateToken, removeCartItem)
export default router