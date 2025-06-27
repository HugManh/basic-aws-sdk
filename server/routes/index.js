import express from 'express';
import v1 from './v1';
const routes = express.Router();

routes.use('/api', v1);
routes.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send('File too large');
    }
    if (err.message === 'Unexpected end of form') {
        return res.status(400).send('Upload did not complete properly. Please try again.');
    }
    res.status(500).send('Server error');
});

export default routes;
