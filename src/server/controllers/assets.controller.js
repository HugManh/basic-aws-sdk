const fs = require('fs-extra');
const { isProd } = require('../config');
const { uploadMem } = require('../middleware');
const path = require('path');
const sharp = require('sharp');
const { awsClient } = require('../connections');
import { appendObjectToJSONFile, readJSONFile } from '../utils'

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
                    const objectKey = awsClient.createAwsKey(originalname)
                    const keyContext = { bucketName, objectKey, mimetype };
                    const presignedUrl = await awsClient.getSignedUrl('putObject', keyContext)

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
            let objectKey = objectPath ? objectPath + "/" + fileName : fileName
            console.log({ bucketName, objectPath, fileName, objectKey })
            const objectGetInfo = {
                bucketName,
                objectKey
            }

            const data = await awsClient.getObject(objectGetInfo);
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



module.exports = AssetsController;
