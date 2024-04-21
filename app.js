const express = require('express');
const morgan = require('morgan');
require('./utils/passport');
const passport = require('passport');
const session = require('express-session');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroller/errorController');
// const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/test');
const role_and_permissions = require('./routes/RoleAndPermisionsroute');
const CategoryRoute = require('./routes/CategoryRoute');



const app = express();
const handleMulterErrors = require('./controllers/errorcontroller/multerErrors');
const { googleCallback, generateJWT } = require('./controllers/authcontroller/authcontroller');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime)
  next();
});
app.use(session({
  secret: 'your_secret_key', // Replace with a secret key for session encryption
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// 3) ROUTES
// app.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/dashboard', // Redirect on successful authentication
//   failureRedirect: '/login' // Redirect on failure
// }));


app.get('/auth/google/callback', googleCallback, generateJWT);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/category', CategoryRoute);

app.use('/api/v1/role',  role_and_permissions);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(handleMulterErrors);
app.use(globalErrorHandler);
module.exports = app;