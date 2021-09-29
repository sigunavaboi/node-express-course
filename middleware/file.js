const multer = require('multer');
const ALLOWED_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'images');
  },
  filename(req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  },
});


const fileFilter = (req, file, callback) => {
  callback(null, ALLOWED_TYPES.includes(file.mimetype));
}

module.exports = multer({
  storage,
  fileFilter,
});
