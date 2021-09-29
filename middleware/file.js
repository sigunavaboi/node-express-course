const multer = require('multer');
const ALLOWED_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const storage = multer.diskStorage({
  destination(req, file, callback) {
    console.log(req, file);
    callback(null, 'images');
  },
  filename(req, file, callback) {
    callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});


const fileFilter = (req, file, callback) => {
  callback(null, ALLOWED_TYPES.includes(file.mimetype));
}

module.exports = multer({
  storage,
  fileFilter,
});
