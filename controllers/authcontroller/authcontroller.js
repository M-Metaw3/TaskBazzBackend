const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
// const keys = require('../config/keys');

async function registerWithGoogle(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

async function registerWithFacebook(req, res, next) {
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
}

async function googleCallback(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/register' })(req, res, next);
}

async function facebookCallback(req, res, next) {
  passport.authenticate('facebook', { failureRedirect: '/register' })(req, res, next);
}

// async function generateJWT(req, res) {
//   const token = jwt.sign({ userId: req.user._id }, keys.jwtSecret, { expiresIn: '1h' });
//   res.json({ token });
// }

module.exports = { registerWithGoogle, registerWithFacebook, googleCallback, facebookCallback };
