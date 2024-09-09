const AwsController = require('../controllers/aws.controller');
const AwsRouter = require('./aws')
const CodeRouter = require('./code')

function useRoutes(app) {
    /**
 * Routers
 */
    app.use('/api', AwsRouter);
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
    app.get('/', (req, res) => {
        res.json({
            message: 'Hello Friend :)',
        });
    });
}

module.exports = { useRoutes }
