const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      'user.userID': req.user._id,
    }).populate('user.userID');
    res.render('orders', {
      isOrder: true,
      title: 'My Orders',
      orders: orders.map((order) => ({
        ...order._doc,
        price: order.courses.reduce((acc, curr) => (acc + curr.course.price * curr.count), 0),
      })),
    });
  } catch(err) {
    console.log('🚀 ~ file: orders.js ~ line 20 ~ router.get ~ err', err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseID');
    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: {...i.courseID._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userID: req.user._id,
      },
      courses,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch(err) {
    console.log('🚀 ~ file: orders.js ~ line 31 ~ router.post ~ err', err);
  }
});

module.exports = router;