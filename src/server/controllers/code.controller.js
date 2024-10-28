const path = require('path')
const fs = require('fs');
const zlib = require('zlib');
const mime = require('mime-types');
const { isProd } = require('../config');

const DIR_LIB_AWS = path.join(__dirname, '../lib/external/aws')

const CodeController = {
    createCode: async (req, res) => {
        const { language } = req.params;
        const { code, filename } = req.body;

        if (language !== "js") {
            const lang = getProgrammingLanguageName(language)
            return res.status(400).json({ message: lang !== 'Unknown' ? `Dont support ${lang}` : `Unknown programming language symbol, #${language}#` });
        }

        // Kiểm tra nếu không có code hoặc filename
        if (!code || !filename) {
            return res.status(400).json({ message: 'Thiếu code hoặc filename' });
        }

        // Chuẩn hóa tên file
        const safeFilename = normalizeFilename(filename, language);

        // Đường dẫn đầy đủ đến file
        const filePath = path.join(DIR_LIB_AWS, safeFilename);

        if (fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: { message: 'File đã tồn tại' } });
        }

        // Tạo stream để ghi file
        const writeStream = fs.createWriteStream(filePath);

        // Ghi dữ liệu vào file
        writeStream.write(code, 'utf8');

        // Kết thúc stream
        writeStream.end();

        writeStream.on('finish', () => {
            return res.status(200).json({ message: `File được tạo thành công: ${safeFilename}` });
        });

        writeStream.on('error', (err) => {
            console.error('Lỗi khi ghi file:', err);
            return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });
        });
    },
    showCode: async (req, res) => {
        const { language } = req.params;
        const { filename } = req.body;

        if (!filename) {
            return res.status(400).json({ message: 'Thiếu filename' });
        }

        // Chuẩn hóa tên file
        const safeFilename = normalizeFilename(filename, language);

        // Đường dẫn đầy đủ đến file
        const filePath = path.join(DIR_LIB_AWS, safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: { message: 'File not found!', details: `File path ${filePath}` } });
        }
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        // Đặt header cho phản hồi, bao gồm Content-Type và Content-Encoding
        res.writeHead(200, {
            'Content-Type': contentType,
            // 'Content-Encoding': 'gzip' // Chỉ định rằng file được nén bằng gzip
        });

        // Tạo luồng đọc từ file
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        // Stream dữ liệu từ file, nén nó và gửi đến response
        readStream.pipe(res);

        // Xử lý lỗi khi đọc file
        readStream.on('error', (err) => {
            console.error('Lỗi khi đọc file:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Lỗi khi đọc file.');
        });

        // Khi luồng kết thúc
        readStream.on('end', () => {
            console.log('Đã gửi toàn bộ file.', contentType);
        });
    },
    deleteCode: async (req, res) => {
        const { language } = req.params
        const { all } = req.query

        if (all) {
            fs.readdir(DIR_LIB_AWS, async (err, files) => {
                if (err)
                    return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });

                if (files.length === 0) {
                    return res.status(200).json({ success: true, message: 'Không có file nào trong thư mục để xoá.' });
                }

                for (const file of files) {
                    fs.unlink(path.join(DIR_LIB_AWS, file), (err) => {
                        if (err)
                            return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } })
                    });
                }

                return res.status(200).json({ success: true, message: 'Đã xoá tất cả các file trong thư mục.' });
            });
        }

        const files = req.body;

        if (files.length <= 0) {
            return res.status(200).json({ success: true, message: 'Không có yêu cầu xoá file' });
        }

        for (const file of files) {
            console.log(file, language);
            // Chuẩn hóa tên file
            const safeFilename = normalizeFilename(file.filename, language);

            // Đường dẫn đầy đủ đến file
            const filePath = path.join(DIR_LIB_AWS, safeFilename);

            // Kiểm tra file có tồn tại hay không
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File không tồn tại
                    return res.status(200).json({ success: true, message: "Không có file nào bị xoá!" });
                } else {
                    // Xóa file
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            // Lỗi khi xoá file
                            return res.status(500).json({ success: true, message: "Có lỗi khi xoá file!" });
                        } else {
                            // File đã bị xoá thành công
                            return res.status(200).json({ success: true, message: "File đã được xoá thành công!" });
                        }
                    });
                }
            });
        }
    }
}

// Đối tượng ánh xạ ký hiệu ngôn ngữ lập trình đến tên ngôn ngữ
const programmingLanguageMap = {
    'js': 'JavaScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'rb': 'Ruby',
    'go': 'Go',
    'php': 'PHP',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'ts': 'TypeScript',
    // Thêm các ký hiệu ngôn ngữ lập trình khác nếu cần
};

/**
 * Hàm lấy tên ngôn ngữ lập trình dựa vào ký hiệu
 * @param {string} symbol - Ký hiệu ngôn ngữ lập trình (ví dụ: 'js', 'py', 'java')
 * @returns {string} - Tên ngôn ngữ lập trình tương ứng hoặc thông báo lỗi nếu không tìm thấy
 */
const getProgrammingLanguageName = (symbol) => {
    return programmingLanguageMap[symbol] || 'Unknown';
};

/**
 * Hàm để chuẩn hóa tên file, đảm bảo kết thúc bằng .js
 * @param {string} filename Tên file được cung cấp từ client
 * @returns {string} Tên file chuẩn với đuôi .js
 */
function normalizeFilename(filename, extension) {
    return `${filename}.${extension}`;
}

module.exports = CodeController;
