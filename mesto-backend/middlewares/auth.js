const jwt = require('jsonwebtoken');
const NotValidData = require('../errors/not-valid-data');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotValidData('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (e) {
    throw new NotValidData('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
