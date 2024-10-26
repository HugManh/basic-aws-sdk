require('dotenv').config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';

const app = express();

// Default headers
app.use((req, res, next) => {
  res.setHeader('X-Author', 'hugmahit@gmail.com');
  res.setHeader('X-Copyright', 'DINO');
  res.setHeader('X-XSS-Protection', 1);
  next();
});

app.disable('x-powered-by');

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build'), { maxAge: 7 * 24 * 3600 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const FAVICON_REGEX = /\/(favicon|(apple-)?touch-icon(-i(phone|pad))?(-\d{2,}x\d{2,})?(-precomposed)?)\.(jpe?g|png|ico|gif)$/i
  if (FAVICON_REGEX.test(req.url)) {
    res.statusCode = 204;
    return res.end();
  }
  const err = new Error('Not Found: ' + req.method + ' - ' + req.originalUrl);
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Render the error page
  if (err.status != 404) console.error('[ErrorHandler] err', err);
  res.status(err.status || 500).end(err.message);
});

app.use(routes)

export default app;
