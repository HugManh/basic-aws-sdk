import http from 'http';
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
import app from './app';

// Start http server
const HTTP_PORT = normalizePort(process.env.PORT || 8000);
app.set('port', HTTP_PORT);
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, onListening);

// Start https server
// const HTTPS_PORT = normalizePort(process.env.HTTPS_PORT || 443);
// app.set('https_port', HTTPS_PORT);
// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'key')),
//     cert: fs.readFileSync(path.join(__dirname, 'crt')),
//     ca: fs.readFileSync(path.join(__dirname, 'ca')),
// };
// https.createServer(options, app).listen(HTTPS_PORT, onListening);

function onListening() {
  let addr = this.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.info('Web server listening on ' + bind);
}

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val;            // named pipe
  if (port >= 0) return port;             // port number
  return false;
}

const shutdown = () => {
  console.info('[shutdown]', new Date());
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err, err.stack);
});

process.on('unhandledRejection', (reason, p) => {
  console.warn('[unhandledRejection] ', p, reason, reason ? reason.stack : undefined);
});