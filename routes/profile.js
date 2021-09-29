const { Router } = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new Router();

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
    }
    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }
    Object.assign(user, toChange);
    await user.save();
    res.redirect('/profile');
  } catch(err) {
    console.log('🚀 ~ file: profile.js ~ line 29 ~ router.post ~ err', err);
  }
});

module.exports = router;