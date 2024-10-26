import { Router } from 'express';
const CodeController = require('../controllers/code.controller');
const router = new Router();

// Create a code file
router.post('/:language/create', CodeController.createCode);
// Show a code of file
router.get('/:language/show', CodeController.showCode);
// // Update a code in file
// router
//     .route('/:language/update')
//     .put(CodeController.createCode);
// Delete code file
router.delete('/:language/delete', CodeController.deleteFiles);


export default router;
