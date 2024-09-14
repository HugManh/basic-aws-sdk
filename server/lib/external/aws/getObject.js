require("dotenv").config();
const AWS = require("aws-sdk");
const { processFile, defaultFilePath } = require('./file');

const config = {
    s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: false,
        s3ForcePathStyle: true,
        // signatureVersion: "v4"
    },
    bucketName: process.env.AWS_BUCKET_NAME
}

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
    const fileInfo = processFile(defaultFilePath);
    const { metadata } = fileInfo;
    const awsKey = createAwsKey(metadata.fileName)
    console.log(config.s3Params);
    const params1 = {
        Bucket: config.bucketName,
        Key: awsKey,
    }
    const data = await client.getObject(params1).promise()
    const params2 = {
        Bucket: config.bucketName,
        Key: awsKey,
    }
    const data2 = await client.getObject(params2).promise()
    console.log(data)
    console.log(data2)
    // const params = {
    //     Bucket: config.bucketName,
    //     Key: awsKey,
    //     Expires: 60 * 60,
    // };
    // const url = await getSignedUrlPromise('getObject', params);
    // let result = {
    //     url,
    //     bucket: params.Bucket,
    //     key: params.Key
    // }
    // console.log({ success: true, level: "info", message: 'URL get object', ...result, timestamp: new Date().toISOString() })
    return
};

main().catch((err) => {
    console.error({ success: false, level: "error", message: err.message, timestamp: new Date().toISOString() });
    process.exit(1);
});
