const { Router } = require('express');
const Course = require('../models/course');
const router = new Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add new Course',
    isAdd: true,
  });
})

router.post('/', async (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.imageUrl);
  await course.save();
  res.redirect('/courses');
});

module.exports = router;