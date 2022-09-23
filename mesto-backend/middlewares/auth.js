require('dotenv').config();
const jwt = require('jsonwebtoken');
const NotValidData = require('../errors/not-valid-data');

const { JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotValidData('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, `${JWT_SECRET}`);
  } catch (e) {
    throw new NotValidData('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
