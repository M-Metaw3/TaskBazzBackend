const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '777231596450-vdvu1nb3216le7pvejgkujnekprobinu.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile)
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new User({ googleId: profile.id, email: profile.emails[0].value });
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
