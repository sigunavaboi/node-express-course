module.exports = {
  MONGO_URI: 'mongodb+srv://sigunawa:dF47jlgqQdVEjwWg@cluster0.98w5t.mongodb.net/shop',
  DEFAULT_PORT: 3000,
  SECRET_SESSION: 'some secret session',
};

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys.prod');
} else {
  module.exports = require('./keys.dev');
}