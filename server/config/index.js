require('dotenv').config(); // Chỉ load .env mặc định

const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
const SERVER_PORT = normalizePort(process.env.SERVER_PORT || 8080);


console.info('ENVIRONMENT =', ENVIRONMENT, `(.env)`);

// Kiểm tra hợp lệ
if (!['localhost', 'development', 'production'].includes(ENVIRONMENT)) {
    throw new Error('❌ ENVIRONMENT env invalid!');
}

const isProd = ENVIRONMENT === 'production';

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;            // named pipe
    if (port >= 0) return port;             // port number
    return false;
}

// Bạn có thể export các biến này nếu cần
module.exports = {
    ENVIRONMENT,
    SERVER_HOST,
    SERVER_PORT,
    isProd,
};
