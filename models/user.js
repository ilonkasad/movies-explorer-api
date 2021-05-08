const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Александр',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (email) => validator.isEmail(email) },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: (password) => validator.isStrongPassword(password) },
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    });
  });
};
module.exports = mongoose.model('user', userSchema);
