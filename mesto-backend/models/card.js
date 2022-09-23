const mongoose = require('mongoose');
const validator = require('validator');

const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Неверная ссылка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', CardSchema);
