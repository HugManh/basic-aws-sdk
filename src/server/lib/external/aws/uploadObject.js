
const fs = require("fs-extra");
const path = require("path");
const { s3 } = require("../../../config");
const { createS3Key, metadata } = require("../../utils/aws");

/* Contants */
/* Has support versioning in AWS S3? */
const _supportsVersioning = false
const bucketName = process.env.BUCKET_NAME || "encoder";

async function uploadObject(dirFile) {
    try {
        const fileName = path.basename(dirFile)
        const objectKey = createS3Key(fileName)
        const { contentType } = metadata(dirFile)
        const buff = fs.readFileSync(dirFile);

        // Define the parameters for the upload
        // If ContentType empty, then octet-stream is default type
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Body: buff,
            ContentType: contentType,
            // ACL: 'public-read',
        };

        // Upload the file to S3
        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Upload data: ', err);
                return
            }
            console.log('Upload data: ', data);
            return
        });
    } catch (error) {
        console.error("[Exception] " + error.message);
    }
}

module.exports = { uploadObject }
