const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes');
const AwsController = require('./controllers/s3.controler');
const path = require('path');

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

app.get('/:bucketName/:objectPath(*)?/:fileName', AwsController.getResource);
/**
 * Hàm để chuẩn hóa tên file, đảm bảo kết thúc bằng .js
 * @param {string} filename Tên file được cung cấp từ client
 * @returns {string} Tên file chuẩn với đuôi .js
 */
function normalizeFilename(filename) {
  return filename.endsWith('.js') ? filename : `${filename}.js`;
}

/**
 * API POST để nhận code và tạo file .js bằng streams
 */
app.post('/save-code', (req, res) => {
  const { code, filename } = req.body;

  // Kiểm tra nếu không có code hoặc filename
  if (!code || !filename) {
    return res.status(400).json({ message: 'Thiếu code hoặc filename' });
  }

  // Chuẩn hóa tên file
  const safeFilename = normalizeFilename(filename);

  // Đường dẫn đầy đủ đến file
  const filePath = path.join(__dirname, 'uploads', safeFilename);

  // Tạo stream để ghi file
  const writeStream = fs.createWriteStream(filePath);

  // Ghi dữ liệu vào file
  writeStream.write(code, 'utf8');

  // Kết thúc stream
  writeStream.end();

  writeStream.on('finish', () => {
    res.status(200).json({ message: `File được tạo thành công: ${safeFilename}` });
  });

  writeStream.on('error', (err) => {
    console.error('Lỗi khi ghi file:', err);
    res.status(500).json({ message: 'Lỗi khi ghi file' });
  });
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
