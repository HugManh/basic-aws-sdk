const AwsController = require('../controllers/assets.controller');
const AssetRouter = require('./assets')
const CodeRouter = require('./code')
const router = new Router();

router.use('/api', AssetRouter);
router.use('/code', CodeRouter)
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send('File too large');
    }
    if (err.message === 'Unexpected end of form') {
        return res.status(400).send('Upload did not complete properly. Please try again.');
    }
    res.status(500).send('Server error');
});

router.get('/:bucketName/:objectPath(*)?/:fileName', AwsController.getResource);

export default router;
