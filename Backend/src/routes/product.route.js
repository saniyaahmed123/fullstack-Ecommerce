import express from 'express'
import { createProduct, getProducts, getProductById, getAdminProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { authenticateToken, checkAdmin } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'
const router = express.Router()
router.post('/create', authenticateToken, checkAdmin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'image', maxCount: 1 }]), createProduct)
router.get('/admin/all', authenticateToken, checkAdmin, getAdminProducts)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', authenticateToken, checkAdmin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'image', maxCount: 1 }]), updateProduct)
router.delete('/:id', authenticateToken, checkAdmin, deleteProduct)
export default router
