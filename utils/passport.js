const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CLIENT_REDIRECT_URI 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
   
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new User({name:profile.displayName, googleId: profile.id, email: profile.emails[0].value });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
));

// passport.use(new FacebookStrategy({
//     clientID: keys.facebookAppID,
//     clientSecret: keys.facebookAppSecret,
//     callbackURL: '/auth/facebook/callback'
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const existingUser = await User.findOne({ facebookId: profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       const newUser = new User({ facebookId: profile.id, email: profile.emails[0].value });
//       await newUser.save();
//       done(null, newUser);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// ));
