const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/routes');
const { errorsCheck } = require('./middlewares/errors');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const app = express();
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);

app.use(errors());

app.use(errorsCheck);

module.exports = app;
