const RouteS3 = require("express").Router();
const S3Ctrl = require("../controllers/S3Ctrl");

RouteS3
  .route("/:bucketname/:filename")
  .post(S3Ctrl.generateUrl)
// RouteS3.get("/:key", S3Ctrl.getData)

module.exports = RouteS3
