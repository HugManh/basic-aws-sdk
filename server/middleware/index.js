const multer = require('multer');
const path = require('path');

// Cấu hình diskStorage
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu trữ trong thư mục theo ngày
        const now = new Date();
        const folder = `uploads/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        cb(null, folder); // Thư mục được tạo dựa trên ngày
    },
    filename: (req, file, cb) => {
        // Đặt tên file với ID người dùng (nếu có) và thời gian
        const userId = req.user ? req.user.id : 'anonymous'; // Giả sử có thông tin user
        cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Cấu hình memoryStorage
const memoryStorage = multer.memoryStorage();

// Khởi tạo Multer với diskStorage
const _uploadDisk = multer({
    storage: diskStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file (10 MB)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

// Khởi tạo Multer với memoryStorage
const _uploadMemory = multer({
    storage: memoryStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn kích thước file (50 MB)
    // fileFilter: (req, file, cb) => {
    //     const filetypes = /jpeg|jpg|png|gif/;
    //     const mimetype = filetypes.test(file.mimetype);
    //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //     if (mimetype && extname) {
    //         return cb(null, true);
    //     } else {
    //         cb(new Error('Only images are allowed!'));
    //     }
    // }
});

const uploadMem = _uploadMemory.single('file')
const uploadDisk = _uploadDisk.single('hello')

// Export các cấu hình Multer
module.exports = {
    uploadDisk,
    uploadMem
};
