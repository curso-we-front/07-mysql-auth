require('dotenv').config();
const express = require('express');
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/articles', articlesRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

module.exports = app;
