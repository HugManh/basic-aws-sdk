const routers3 = require('express').Router();
const AwsController = require('../controllers/s3.controler');
const { uploadMemory } = require('../middleware');

// Uploads an asset 
routers3
  .post('/:bucketName/:resource_type/upload',AwsController.uploadResource);
// routers3
//   .route('/:bucketName/:objectPath(*)?/:filename')
//   .get(AwsController.getResource)

module.exports = routers3
