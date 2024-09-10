const AwsController = require('../controllers/assets.controller');
const AssetRouter = require('./assets')
const CodeRouter = require('./code')

function useRoutes(app) {
    /**
 * Routers
 */
    app.use('/api', AssetRouter);
    app.use('/code', CodeRouter)
    app.use((err, req, res, next) => {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).send('File too large');
        }
        if (err.message === 'Unexpected end of form') {
            return res.status(400).send('Upload did not complete properly. Please try again.');
        }
        res.status(500).send('Server error');
    });

    app.get('/:bucketName/:objectPath(*)?/:fileName', AwsController.getResource);
}

module.exports = { useRoutes }
