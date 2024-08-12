import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import UserModel from './models/database/users.models'
dotenv.config()
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/v1/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)
        const existingUser = await UserModel.findOne({ googleId: profile.id })

        if (existingUser) {
          return done(null, existingUser)
        }

        const newUser = new UserModel({
          fullname: profile.displayName,
          displayName: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
          avatarUrl: profile.photos?.[0].value,
          role: 'User'
        })

        await newUser.save()
        done(null, newUser)
      } catch (err) {
        done(err, undefined)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, (user as any)._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id)
    done(null, user)
  } catch (err) {
    done(err, undefined)
  }
})

export default passport
