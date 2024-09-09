const fs = require('fs-extra');
const { client } = require('../config');
const { uploadMem } = require('../middleware');
const path = require('path');
const sharp = require('sharp');
const { isProd } = require('../config/contants');

const AwsController = {
    uploadResource: async (req, res) => {
        const { bucketName, resource_type } = req.params;
        switch (resource_type) {
            case 'image':
                uploadMem(req, res, async (err) => {
                    if (err) {
                        return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });
                    } else if (!req.file?.buffer) {
                        return res.status(400).json({ success: false, error: { message: 'File data not found' } });
                    }

                    const { mimetype, originalname, buffer } = req.file;
                    const objectKey = client.createAwsKey(originalname)
                    const keyContext = { bucketName, objectKey, mimetype };
                    const presignedUrl = await client.getSignedUrl('putObject', keyContext)
                    console.log(presignedUrl)
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
                        const value = { bucketName, objectKey, mimetype, format, width, height, size, originalname, resource_type, url, }
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

            const data = await client.get(objectGetInfo);
            res.end(data.Body);
        } catch (err) {
            res.status(400).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : 'File data not found' } });
        }
    },
}

module.exports = AwsController;
