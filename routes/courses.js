const { Router } = require('express');
const { validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Course = require('../models/course')
const { courseValidators } = require('../utils/validators');
const router = new Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('userID', 'email name')
      .select('price title image');
    res.render('courses', {
      title: 'All Courses',
      isCourses: true,
      courses,
      userID: req?.user?._id?.toString(),
    });
  } catch (error) {
    console.log('🚀 ~ file: courses.js ~ line 51 ~ router.get ~ error', error);
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    if (course.userID.toString() !== req.user._id.toString()) {
      return res.redirect('/courses');
    }
    res.render('course-edit', {
      title: `Edit ${course.title}`,
      course
    });
  } catch (error) {
    console.log('🚀 ~ file: courses.js ~ line 56 ~ router.get ~ error', error);
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Course ${course.title}`,
    course,
  });
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  try {
    const { id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).redirect(`/course/${id}/edit?allow=true`);
    }
    const course = await Course.findById(id);
    if (course.userID.toString() !== req.user._id.toString()) {
      return res.redirect('/courses');
    }
    delete req.body.id;
    Object.assign(course, req.body);
    course.save();
    res.redirect('/courses');
  } catch (error) {
    console.log('🚀 ~ file: courses.js ~ line 63 ~ router.post ~ error', error);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userID: req.user._id,
    });
    res.redirect('/courses');
  } catch(e) {
    console.log('🚀 ~ file: courses.js ~ line 48 ~ router.post ~ e', e);
  }
});

module.exports = router;