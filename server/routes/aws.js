const routerAws = require('express').Router();
const AwsController = require('../controllers/s3.controller');

// Uploads an asset 
routerAws
  .route('/:bucketName/:resource_type/upload')
  .post(AwsController.uploadResource);

module.exports = routerAws
