// upload.js
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const path = require("path");

// Create S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET, // Your S3 bucket name
    acl: "private", // or "public-read" if you want
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // unique file name in S3
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `uploads/${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
});

module.exports = upload;
