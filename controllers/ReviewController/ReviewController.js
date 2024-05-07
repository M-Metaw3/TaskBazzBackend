const jwt = require('jsonwebtoken');
const Review = require('../../models/reviewModel');
const AppError = require('../../utils/appError');
require('../../utils/passport');
const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');




// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.service) req.body.service = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);