import passport from 'passport';
import express from 'express';

const router = express.Router(); // Make sure you have this!

router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.send("Successfully logged in with Google! Check your terminal for the console.log.");
  }
);

export default router;