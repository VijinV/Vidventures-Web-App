const multer = require('multer');
const path = require('path');

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/admin/assets/ProductImages");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

module.exports ={
  upload
}