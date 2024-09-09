const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('client'));
app.use(cookieParser());

routes.useRoutes(app)

/**
 * Create server
 */
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
