const passport = require('passport');
const uservalidation = require('../../validations/Uservalidation/uservalidation');
const joifunctions = require('../../validations/mainjoivalidations');



const crypto = require('crypto');
// const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
require('../../utils/passport');
const catchAsync = require('../../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};




const createSendToken = (user, statusCode, res) => {
  console.log(user)
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const signup = catchAsync(async (req, res, next) => {





  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});




async function registerWithGoogle(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

async function registerWithFacebook(req, res, next) {
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
}

async function googleCallback(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
}

async function facebookCallback(req, res, next) {
  passport.authenticate('facebook', { failureRedirect: '/register' })(req, res, next);
}

async function generateJWT(req, res) {
  console.log(`Method: ${req.method}, API: ${req.originalUrl}`);
  createSendToken(req.user, 201, res);
  return;
}

module.exports = { registerWithGoogle, registerWithFacebook, googleCallback, generateJWT,signup,facebookCallback };