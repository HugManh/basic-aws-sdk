require("dotenv").config({ path: `.env.prod` })
const AWS = require("aws-sdk");

const config = {
    s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: "v4"
    },
    bucketName: process.env.AWS_BUCKET_NAME
}

const client = new AWS.S3(config.s3Params);

dataStoreVersionId = null
function headObject(key) {
    try {
        const params = {
            Bucket: config.bucketName,
            Key: key,
            VersionId: dataStoreVersionId,
        };
        client.headObject(params, function (err, data) {
            if (err) console.log(err, err.stack)
            else console.log(data);
        });
    } catch (error) {
        console.error("[Exception] " + error.message);
    }
}

headObject("fzWcDFq9nv6DKPm8/test.json")
