import http from 'http';
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
import app from './app';
import { SERVER_HOST, SERVER_PORT } from './config';

// Start http server
app.set('port', SERVER_PORT);
const httpServer = http.createServer(app);
httpServer.listen(SERVER_PORT, SERVER_HOST, () => onListening(httpServer));

// Start https server
// const HTTPS_PORT = normalizePort(process.env.HTTPS_PORT || 443);
// app.set('https_port', HTTPS_PORT);
// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'key')),
//     cert: fs.readFileSync(path.join(__dirname, 'crt')),
//     ca: fs.readFileSync(path.join(__dirname, 'ca')),
// };
// https.createServer(options, app).listen(HTTPS_PORT, onListening);

function onListening(server) {
    const addr = server.address();
    if (!addr) {
        console.warn("⚠️ server.address() is null.");
        return;
    }

    const bind = typeof addr === 'string' ? 'pipe ' + addr : addr.address + ':' + addr.port;
    console.info('✅ Web server listening on ' + bind);
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
