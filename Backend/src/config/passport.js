import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userModel from '../models/user.model.js'
async function verify(accessToken, refreshToken, profile, done){
      try {
        const email = profile.emails?.[0]?.value
        if(!email){
           return done(new Error('google didnot prvide an email'))
        }
        let user = await userModel.findOne({googleId:profile.id})
        if(!user){
            user = await userModel.findOne({email})
            if(user){
                user.googleId = profile.id
                await user.save()
            }else{
                user = await userModel.create({
                    username : profile.displayName,
                    email,
                    googleId: profile.id
                })
            }
            
        }
        return done(null,user)
      } catch (error) {
        return done(error)
      }


}

passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
},verify))
