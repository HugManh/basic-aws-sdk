const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());
// app.use(express.static('client'));
app.use(cookieParser());

/**
 * Routers
 */
app.use('/api', routes.AwsRouter);
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).send('File too large');
  }
  if (err.message === 'Unexpected end of form') {
    return res.status(400).send('Upload did not complete properly. Please try again.');
  }
  res.status(500).send('Server error');
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello Friend :)',
  });
});

/**
 * Create server
 */
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
