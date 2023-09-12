const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  signatureVersion: "v4", //signature does not match
  endpoint: process.env.END_POINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sslEnabled: false,
  s3ForcePathStyle: true,
});

const s3Instance = new AWS.S3();

module.exports = { s3Instance };
