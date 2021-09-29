const { Router } = require('express');
const { validationResult } = require('express-validator');  
const User = require('../models/user');
const { registerValidators, loginValidators } = require('../utils/validators');

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Sign in',
    isLogin: true,
    error: req.flash('error'),
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }
    const { email } = req.body;
    const candidate = await User.findOne({ email });
    req.session.user = candidate;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }
    const hashPass = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPass,
      cart: {
        items: [],
      },
    });
    await user.save();
    res.redirect('/auth/login#login');
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 33 ~ router.post ~ error', error);
  }
});

module.exports = router