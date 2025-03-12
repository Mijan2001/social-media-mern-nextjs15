const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouters');
const postRouter = require('./routes/postRouter');
const AppError = require('./utils/appError');

const app = express();

// uploads static files=============
app.use('/', express.static('uploads'));

app.use(cookieParser());

// sets security HTTP headers
app.use(helmet());

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true
    })
);

app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));

app.use(mongoSanitize());

// Routes for users============
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

// Routes for post================

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
