import express from 'express'
import passport from 'passport'
import { registerUser, loginUser, googleCallback, logoutUser } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'
const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', authenticateToken, (req, res) => {
    res.status(200).json({ user: req.user })
})
router.post('/logout', logoutUser)
router.get('/google',passport.authenticate('google',
    {
        scope:['profile','email'],
         session: false
        
    }

))
router.get('/google/callback',passport.authenticate('google',{
    session:false,
    failureRedirect: 'http://localhost:5173/login',

}

)
,googleCallback

)
export default router