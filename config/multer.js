const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/admin/assets/ProductImages');
  },
  filename: function (req, file, cb) {
    if (!file) {
      return cb(new Error('File is missing.'));
    }
    if (!file.originalname) {
      return cb(new Error('File has no original name.'));
    }
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single('image');

module.exports = {
  upload,
};
