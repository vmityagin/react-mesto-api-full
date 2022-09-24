const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotCorrectData = require('../errors/not-correct-data');
const NotFoundData = require('../errors/not-found-data');
const NotValidData = require('../errors/not-valid-data');
const ServerError = require('../errors/server-error');
const NotUniqData = require('../errors/not-uniq-data');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id.toString() },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new NotValidData('Передан неверный логин или пароль'));
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundData('Пользователь не найден');
      } return res.send({ data: user });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.send({
          data: {
            name, about, avatar, email,
          },
        }))
        .catch((e) => {
          if (e.name === 'ValidationError') {
            next(new NotCorrectData('Некорректные данные'));
          } else if (e.code === 11000) {
            next(new NotUniqData('При регистрации указан email, который уже существует на сервере'));
          } else {
            next(new ServerError('Произошла ошибка'));
          }
        });
    })
    .catch(next);
};

module.exports.updateUserInformation = async (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: `${name}`, about: `${about}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new NotCorrectData('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: `${avatar}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new NotCorrectData('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.infoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundData('Пользователь не найден');
      } return res.send({ data: user });
    })
    .catch(next);
};
