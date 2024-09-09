const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { loadConfig } = require('./config');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('client'));
app.use(cookieParser());

routes.useRoutes(app)

const port = process.env.PORT || 8000;

// Load config và khởi động server
const startServer = () => {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(`Database host: ${config.db.host}`);
  });
};

const bootstrap = () => {
  loadConfig()
}

bootstrap()
// Khởi tạo server
startServer();