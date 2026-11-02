import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'

function setAuthCookie(res, user) {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
}

export async function registerUser(req, res) {
    const { username, email, password } = req.body
    if (!username?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: 'username, email and password are required' })
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'password must be at least 8 characters' })
    }
    const AlreadyExist = await userModel.findOne({ email: email.trim().toLowerCase() })
    if (AlreadyExist) {
        return res.status(409).json({ message: 'user already exists' })
    }

    const hashedPassword = await bycrypt.hash(password, 10)
    const user = await userModel.create({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword
    })
    setAuthCookie(res, user)
    res.status(201).json({ message: 'successfully registered!', user: publicUser(user) })
}
export async function loginUser(req, res) {
    const { email, password } = req.body
    if (!email?.trim() || !password) {
        return res.status(400).json({ message: 'email and password are required' })
    }
    const user = await userModel.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    const isMatch = await bycrypt.compare(password, user.password)

    if (isMatch) {
        setAuthCookie(res, user)
        res.status(200).json({ message: 'You have successfully logged in!', user: publicUser(user) })
    }
    else {
        return res.status(401).json({ message: 'Invalid credentials' })

    }
}

export function googleCallback(req, res) {
    const user = req.user
    setAuthCookie(res, user)
    res.redirect(process.env.FRONTEND_URL)
}

export function logoutUser(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
    res.status(200).json({ message: 'Successfully logged out' })
}