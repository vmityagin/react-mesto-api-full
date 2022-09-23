const Card = require('../models/card');
const NotCorrectData = require('../errors/not-correct-data');
const NotFoundData = require('../errors/not-found-data');
const ServerError = require('../errors/server-error');
const NotCredentialsData = require('../errors/not-credentials-data');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new NotCorrectData('Некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundData('Ошибка, такого id не существует'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new NotCredentialsData('Вы не можете удалить чужую карточку'));
      }
      return card.remove()
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        });
    })
    .catch(next);
};

module.exports.putLike = async (req, res, next) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundData('Передан несуществующий _id карточки');
      }
      return res.send({ data: card });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.deleteLike = async (req, res, next) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundData('Передан несуществующий _id карточки');
    })
    .catch((e) => {
      next(e);
    });
};
