const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "images/avatars");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowFileTypes = /(jpg|jpeg|png|gif)/;

  const extname = allowFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      "Error: File upload only supports the following filetypes - " +
        allowFileTypes
    );
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

module.exports = uploadAvatar;
