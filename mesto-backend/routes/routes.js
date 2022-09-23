const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');
const { regularLinkRegExp } = require('../constants/constants');
const NotFoundData = require('../errors/not-found-data');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularLinkRegExp),
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use(auth, (req, res, next) => {
  next(new NotFoundData('Такого запроса не существует'));
});

module.exports = router;
