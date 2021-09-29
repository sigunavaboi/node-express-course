const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseID');
  const courses = user.cart.items;
  const price = courses.reduce((acc, curr) => (acc + curr.courseID.price * curr.count), 0);
  res.status(200).json({ courses, price });
});

router.get('/', auth, async (req, res) => {
  const user = await req.user.populate('cart.items.courseID');
  const { cart } = user;
  res.render('cart', {
    isCart: true,
    title: 'Cart',
    courses: cart.items,
    price: cart.items.reduce((acc, curr) => (acc + curr.courseID.price * curr.count), 0),
  });
})

module.exports = router;