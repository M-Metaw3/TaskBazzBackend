const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroller/errorController');
// const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/test');

const app = express();
const handleMulterErrors = require('./controllers/errorcontroller/multerErrors');
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

// 3) ROUTES
// app.use('/api/v1/tours', ()=>{
//   console.log('Tour router')});
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(handleMulterErrors);
app.use(globalErrorHandler);
module.exports = app;