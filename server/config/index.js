const fs = require("fs");
const { parseConfig } = require('./aws');
const { DIR_LIB_AWS } = require('./contants');

let client;

function checkDirectory() {
    try {
        // Tạo thư mục nếu chưa tồn tại
        fs.mkdir(DIR_LIB_AWS, { recursive: true }, (err, result) => {
            if (err)
                throw new Error(`Có lỗi khi tạo thư mục: ${err.message}`);
            console.log('Thư mục đã tồn tại hoặc vừa được tạo thành công.', result);
        });
    } catch (err) {
        throw new Error(`Có lỗi khi tạo thư mục: ${err.message}`);
    }
}

function loadConfig() {
    try {
        client = parseConfig()

        checkDirectory()
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    loadConfig,
    client
}
