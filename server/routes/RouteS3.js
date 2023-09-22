const RouteS3 = require("express").Router();
const S3Ctrl = require("../controllers/S3Ctrl");

RouteS3
  .route("/:bucketname/:filename")
  .post(S3Ctrl.generateUrl)
RouteS3
  .route("/:bucketname/:objectkey(*)?/:filename")
  .get(S3Ctrl.getData)
RouteS3
  .route("/:bucketname")
  .get(S3Ctrl.listKeys)

module.exports = RouteS3
