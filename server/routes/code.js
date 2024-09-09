const routerCode = require('express').Router();
const CodeController = require('../controllers/code.controller');

// Create a code file
routerCode
    .route('/:language/create')
    .post(CodeController.createCode);
// Show a code of file
routerCode
    .route('/:language/show')
    .get(CodeController.showCode);
// // Update a code in file
// routerCode
//     .route('/:language/update')
//     .put(CodeController.createCode);
// Delete code file
routerCode
    .route('/:language/delete')
    .delete(CodeController.deleteFiles);

module.exports = routerCode
