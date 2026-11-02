import mongoose from "mongoose"
import productModel from "../models/product.model.js"
import userModel from "../models/user.model.js"

export async function addToCart(req, res) {
    try {

        const { productId } = req.body
        const quantity = Number(req.body.quantity) || 1
        const isValid = mongoose.Types.ObjectId.isValid(productId)
        if (!isValid) {
            res.status(401).json({ message: 'enter valid product id' })
            return
        }
        if (quantity < 1) {
            res.status(401).json({ message: 'add atleast one product to cart' })
            return
        }
        const product = await productModel.findById(productId)
        if (!product) {
            res.status(404).json({ message: 'product not found' })
            return
        }
        const stock = typeof product.stock === 'number' ? product.stock : 0
        if (quantity > stock) {
            return res.status(400).json({ message: `Only ${stock} item${stock === 1 ? '' : 's'} available in stock` })
        }
        const user = await userModel.findById(req.user.id)
        if (!user) {
            res.status(404).json({ message: 'unauthorized ' })
            return
        }
        const cartItem = user.cart.find((item) => item.productId.toString() === productId)
        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity
            if (newQuantity > stock) {
                return res.status(400).json({ message: `Only ${stock} item${stock === 1 ? '' : 's'} available in stock` })
            }
            cartItem.quantity = newQuantity
        }
        else {
            user.cart.push({ productId, quantity })
        }
        await user.save()

        res.status(201).json({ message: 'add to cart', cart: user.cart })


    } catch (error) {
        res.status(500).json({ message: 'failed to add to cart', error: error.message })
    }
}
export async function getCart(req, res) {
    try {
        const usersCart = await userModel.findById(req.user.id).select('cart').populate('cart.productId', 'productName desc image price stock')
        if (!usersCart) {
            return res.status(404).json({ message: 'user not found' })
        }
        const cart = usersCart.cart.filter(item => item.productId !== null)
        if (cart.length === 0) {
            return res.status(200).json({ message: 'cart is empty', cart: [] })
        }
        res.status(200).json({ cart })

    } catch (error) {
        res.status(500).json({ message: 'failed to get cart', error: error.message })
    }
}

export async function updateCartItem(req, res) {
    try {
        const { quantity } = req.body
        const parsedQuantity = Number(quantity)
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: 'quantity must be a positive whole number' })
        }

        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const item = user.cart.find(entry => entry.productId.toString() === req.params.productId)
        if (!item) {
            return res.status(404).json({ message: 'cart item not found' })
        }

        const product = await productModel.findById(req.params.productId)
        const stock = typeof product?.stock === 'number' ? product.stock : 0
        if (parsedQuantity > stock) {
            return res.status(400).json({ message: `Only ${stock} item${stock === 1 ? '' : 's'} available in stock` })
        }

        item.quantity = parsedQuantity
        await user.save()
        return res.status(200).json({ message: 'cart updated', cart: user.cart })
    } catch (error) {
        return res.status(500).json({ message: 'failed to update cart', error: error.message })
    }
}

export async function removeCartItem(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const originalLength = user.cart.length
        user.cart = user.cart.filter(entry => entry.productId.toString() !== req.params.productId)
        if (user.cart.length === originalLength) {
            return res.status(404).json({ message: 'cart item not found' })
        }

        await user.save()
        return res.status(200).json({ message: 'item removed from cart', cart: user.cart })
    } catch (error) {
        return res.status(500).json({ message: 'failed to remove cart item', error: error.message })
    }
}