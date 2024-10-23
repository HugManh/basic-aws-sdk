require("dotenv").config({ path: `.env.dev` })
const AWS = require("aws-sdk");
const { processFile, } = require('./file');
const { dataLocal } = require("../../../config/contants");

const config = {
    s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: true,
        s3ForcePathStyle: true,
        signatureVersion: "v4",
        region: 'test'
    },
    bucketName: process.env.AWS_BUCKET_NAME
}
console.log("config", config)

const client = new AWS.S3(config.s3Params);

const createAwsKey = (name) => {
    let now = new Date();
    return now.toLocaleDateString("zh-Hans-CN") + "/" + name
}

const getSignedUrlPromise = async (operation, params) => {
    try {
        console.log({ success: true, level: "info", message: 'getSignedUrlPromise', ...params, timestamp: new Date().toISOString() })
        const url = await client.getSignedUrlPromise(operation, params)
        return url
    } catch (err) {
        throw new Error(err.message)
    }
}

// Main function
const main = async () => {
    const fileInfo = processFile(dataLocal);
    const { metadata } = fileInfo;
    const awsKey = createAwsKey(metadata.fileName)
    const params = {
        Bucket: config.bucketName,
        Key: awsKey,
        Expires: 60 * 60,
        ContentType: metadata.mimetype,
    };
    const url = await getSignedUrlPromise('putObject', params);
    console.log({ success: true, level: "info", message: 'URL put object', url, timestamp: new Date().toISOString() })
    return
};

main().catch((err) => {
    console.error({ success: false, level: "error", message: err.message, timestamp: new Date().toISOString() });
    process.exit(1);
});
