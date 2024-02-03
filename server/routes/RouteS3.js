const routeS3 = require("express").Router();
const ctrlS3 = require("../controllers/ctrlS3");

routeS3
  .route("/:bucketname/:objectpath(*)?/:filename")
  .post(ctrlS3.generateUrlUpload)
  .get(ctrlS3.getData)

module.exports = routeS3
