const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const router = new Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add new Course',
    isAdd: true,
  });
})

router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        ...req.body,
      }
    })
  }

  const { title, price, image } = req.body;
  const course = new Course({
    title,
    price,
    image,
    userID: req.user,
  });
  try {
    await course.save();
    res.redirect('/courses');
  } catch(e) {
    console.log('🚀 ~ file: add.js ~ line 23 ~ router.post ~ e', e);
  }
});

module.exports = router;