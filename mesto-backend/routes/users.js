const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUser,
  updateUserInformation,
  updateUserAvatar,
  infoAboutUser,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', infoAboutUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInformation);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateUserAvatar);

module.exports = router;
