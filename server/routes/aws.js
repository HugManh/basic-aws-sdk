const routerAws = require('express').Router();
const AwsController = require('../controllers/aws.controller');

// Uploads an asset 
routerAws
  .route('/:bucketName/:resource_type/upload')
  .post(AwsController.uploadResource);

module.exports = routerAws
