const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMeProfile,
  updateProfile,
} = require('../controllers/users');

router.get('/users/me', getMeProfile);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required()
          .messages({
            'string.min': 'Имя должно содержать больше 2 символов',
            'string.max': 'Имя должно содержать менее 30 символов',
            'string.empty': 'Не указано имя пользователя',
          }),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
          .message(
            'некорректный email',
          ),
      })
      .unknown(true),
  }),
  updateProfile,
);

module.exports = router;
