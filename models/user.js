const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseID: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  }
});

userSchema.methods.addToCart = function(course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(c => {
    return c.courseID.toString() ===  course._id.toString();
  });
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      courseID: course._id,
      count: 1,
    });
  }
  this.cart = {
    items,
  };
  return this.save();
};

userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items];
  const idx = items.findIndex(c => c.courseID.toString() ===  id.toString());
  if (items[idx].count === 1) {
    items = items.filter(c => c.courseID.toString() !== id.toString());
  } else {
    items[idx].count = items[idx].count - 1;
  }
  this.cart = {
    items,
  };
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  this.save();
}

module.exports = model('User', userSchema);