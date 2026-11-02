import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'

export async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401).json({ message: 'unauthorized' })
            return
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const userId = payload.id
        const user = await userModel.findById(userId)
        if (!user) {
            res.status(401).json({ message: 'user not found' })
            return

        }
        req.user = {
            "id": user._id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }



        next()
    } catch (error) {
        res.status(401).json({ 'message': error.message })

    }





}
export function checkAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can manage products.' })
    }
    next()
}