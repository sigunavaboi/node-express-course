const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('User with this email already exists');
        }
      } catch(err) {
        console.log('🚀 ~ file: validators.js ~ line 12 ~ body ~ err', err);
      }
    })
    .normalizeEmail(),
  body('password', 'Password should be at least 6 symbols')
    .isLength({ min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords should be equal');
      }
      return true;
    })
    .trim(),
  body('name', 'Name value should be at least 3 symbols')
    .isLength({ min: 3})
    .trim(),
];

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject('This user does not exists');
        }
      } catch {}
    }),
  body('password', 'Password should be at least 6 symbols')
    .isLength({ min: 6, max: 56})
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return Promise.reject('This user does not exists');
        }
        const passMatch = await bcrypt.compare(value, user.password);
        if (!passMatch) {
          return Promise.reject('Wrong password');
        }
      } catch {}
    }),
];

exports.courseValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Minimal title length is 3 symbols')
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Enter valid price'),
  body('image')
    .isURL()
    .withMessage('Enter a valid URL'),
];
