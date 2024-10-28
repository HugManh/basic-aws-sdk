// Hàm xử lý đọc, ghi file JSON lớn
export const appendObjectToJSONFile = (filePath, newObject) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        let jsonData = ''; // Biến để lưu trữ dữ liệu đọc từ stream

        // Xử lý khi có chunk dữ liệu
        readStream.on('data', (chunk) => {
            jsonData += chunk; // Lưu trữ chunk dữ liệu
        });

        // Xử lý khi đọc xong toàn bộ file
        readStream.on('end', () => {
            try {
                // Parse dữ liệu JSON thành mảng
                let parsedData = JSON.parse(jsonData);

                // Kiểm tra nếu dữ liệu là mảng
                if (Array.isArray(parsedData)) {
                    // Thêm object mới vào mảng
                    parsedData.push(newObject);
                } else {
                    return reject(new Error('Dữ liệu JSON không phải là mảng'));
                }

                // Ghi lại mảng JSON đã cập nhật vào file
                const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
                writeStream.write(JSON.stringify(parsedData, null, 2), 'utf8');

                // Kết thúc stream ghi
                writeStream.end();

                writeStream.on('finish', () => {
                    resolve('Ghi thành công vào file!');
                });

                writeStream.on('error', (err) => {
                    reject('Lỗi khi ghi file: ' + err);
                });
            } catch (err) {
                reject('Lỗi khi parse JSON: ' + err);
            }
        });

        // Xử lý khi có lỗi trong quá trình đọc
        readStream.on('error', (err) => {
            reject('Lỗi khi đọc file: ' + err);
        });
    });
};


// Hàm xử lý đọc, ghi file JSON lớn
export const readJSONFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        let jsonData = ''; // Biến để lưu trữ dữ liệu đọc từ stream

        // Xử lý khi có chunk dữ liệu
        readStream.on('data', (chunk) => {
            jsonData += chunk; // Lưu trữ chunk dữ liệu
        });

        // Xử lý khi đọc xong toàn bộ file
        readStream.on('end', () => {
            try {
                // Parse dữ liệu JSON thành mảng
                let parsedData = JSON.parse(jsonData);
                resolve(parsedData)
            } catch (err) {
                reject('Lỗi khi parse JSON: ' + err);
            }
        });

        // Xử lý khi có lỗi trong quá trình đọc
        readStream.on('error', (err) => {
            reject('Lỗi khi đọc file: ' + err);
        });
    });
};
