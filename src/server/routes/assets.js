const routerAssets = require('express').Router();
const AssetsController = require('../controllers/assets.controller');

// Uploads an asset 
routerAssets
  .route('/:bucketName/:resource_type/upload')
  .post(AssetsController.uploadAssets);

// List asset
routerAssets
  .route('/:bucketName/:resource_type/list')
  .get(AssetsController.listAssets);

module.exports = routerAssets
