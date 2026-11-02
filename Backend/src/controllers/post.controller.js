import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
export async function createPost(req, res) {
    const token = req.cookies.token
    try {
        if (!token) {
            res.status(401).json({ message: 'unAuthorized !' })
            return

        }
        const usersToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: usersToken.id })
        if (user) {
            res.status(200).json({ email: user.email, name: user.username, message: 'post created' })
        }
        else {
            res.status(401).json({ message: 'invalid token !' })
        }

    } catch (error) {
        res.status(401).json({ message: error.message })
    }

}

