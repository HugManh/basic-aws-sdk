const fs = require('fs-extra');
const { client } = require('../config');
const { uploadMem } = require('../middleware');
const path = require('path');
const sharp = require('sharp');
const { isProd, DIR_DATA } = require('../config/contants');

const AssetsController = {
    uploadAssets: async (req, res) => {
        const { bucketName, resource_type } = req.params;
        switch (resource_type) {
            case 'image':
                uploadMem(req, res, async (err) => {
                    if (err) {
                        return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });
                    } else if (!req.file?.buffer) { // node >=14
                        // else if (!req.file || !req.file.buffer) {
                        return res.status(400).json({ success: false, error: { message: 'File data not found' } });
                    }

                    const { mimetype, originalname, buffer } = req.file;
                    const objectKey = client.createAwsKey(originalname)
                    const keyContext = { bucketName, objectKey, mimetype };
                    const presignedUrl = await client.getSignedUrl('putObject', keyContext)

                    const image = sharp(buffer); // path to the stored image
                    const metadata = await image.metadata()
                    const response = await fetch(presignedUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': mimetype, // Match the Content-Type to what you expect
                        },
                        body: buffer,
                    });

                    if (response.ok) {
                        const { format, width, height, size } = metadata
                        const url = `http://localhost:8333/${bucketName}/${objectKey}`

                        const safeFilename = `assets.json`
                        const db = path.join(DIR_DATA, safeFilename)
                        // Object mới cần thêm vào mảng JSON
                        const newObject = {
                            url,
                            id: response.headers.get('x-amz-request-id'),
                            name: originalname,
                            bucketName,
                            mimetype,
                            resource_type,
                            format, width, height, size,
                            timestamp: new Date().toISOString()
                        };
                        const message = await appendObjectToJSONFile(db, newObject);
                        const value = { bucketName, objectKey, mimetype, format, width, height, size, originalname, resource_type, url }
                        return res.status(200).json({ success: true, data: !isProd ? value : null })
                    }

                    return res.status(response.status).json({
                        success: false, error: {
                            message: `File upload failed`
                        }
                    })
                })
                break
            case 'video':
                break
            default:
                break
        }
    },

    getResource: async (req, res) => {
        try {
            const { bucketName, objectPath, fileName } = req.params;
            console.log(req.params)
            let objectKey = objectPath ? objectPath + "/" + fileName : fileName
            console.log(objectKey)
            const objectGetInfo = {
                bucketName,
                objectKey
            }

            const data = await client.getObject(objectGetInfo);
            res.end(data.Body);
        } catch (err) {
            res.status(400).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : 'File data not found' } });
        }
    },

    listAssets: async (req, res) => {
        try {
            const { bucketName, resource_type } = req.params;
            const safeFilename = `assets.json`
            const db = path.join(DIR_DATA, safeFilename)
            const data = await readJSONFile(db)
            // Kiểm tra nếu dữ liệu là mảng
            if (!Array.isArray(data)) {
                return res.status(404).json({ success: false, error: { message: 'Dữ liệu JSON không phải là mảng' } });
            }
            const filteredData = data.filter((it) => it.resource_type === resource_type)
            return res.status(200).json({ success: true, data: !isProd ? filteredData : null })
        } catch (err) {
            return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });
        }
    },
}

// Hàm xử lý đọc, ghi file JSON lớn
const appendObjectToJSONFile = (filePath, newObject) => {
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
const readJSONFile = (filePath) => {
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



module.exports = AssetsController;
