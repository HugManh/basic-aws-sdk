// routes/api.js
import express from 'express';
import assets from './assets'
import coder from './code'

const apiRouter = express.Router();

apiRouter.use('/assets', assets);
apiRouter.use('/code', coder);
export default apiRouter;
