const multer = require("multer");
const util = require("util");
const maxSize = 2 * 1024 * 1024;
const fs = require("fs");
const path = require("path");
require("dotenv").config();
folder = process.env.image_folder;
var currentPath = path.join(process.cwd(), folder);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, currentPath);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: { fileSize: maxSize },
}).single("file");

let uploadNow = util.promisify(uploadFile);

module.exports = uploadNow;
