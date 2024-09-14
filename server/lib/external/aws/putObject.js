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
        console.log('processing aws...');
        console.log('params ', params);
        const url = await client.getSignedUrlPromise(operation, params)
        return url
    } catch (err) {
        throw new Error(err.message)
    }
}

// const putObject = async (params) => {

//     // Define the parameters for the upload
//     // If ContentType empty, then octet-stream is default type
//     const params = {
//         Bucket: config.bucketName,
//         Key: awsKey,
//         Body: buffer,
//     };

//     const data = await putObject(params)
//     console.log(params.Bucket + '/' + params.Key, data);

//     // Upload the file to S3
//     return client.putObject(params, (err, data) => {
//         if (err) {
//             console.error('Upload data: ', err);
//             throw new Error(err.message)
//         }
//         return data;
//     });
// }


// Main function
const main = async () => {
    const hasType = false;
    const fileInfo = processFile(defaultFilePath, true);
    const { metadata, buffer } = fileInfo;
    const awsKey = createAwsKey(metadata.fileName)
    console.log(config.s3Params);

    const params = {
        Bucket: config.bucketName,
        Key: awsKey,
        // Expires: 60 * 5,
        ContentType: hasType ? metadata.mimetype : '',
    };
    const url = await getSignedUrlPromise('putObject', params);
    console.log(url);

    // Upload assets by signed url
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': hasType ? metadata.mimetype : '', // Match the Content-Type to what you expect
        },
        body: buffer,
    });

    let result = {
        url,
        bucket: params.Bucket,
        key: params.Key
    }
    if (response.ok) {
        result = {
            ...result,
            id: response.headers.get('x-amz-request-id'),
        };
        console.log({ success: true, level: "info", message: 'Put object success', ...result, timestamp: new Date().toISOString() })
        return
    }
    console.error({ success: false, level: "error", message: `File put failed`, ...result, timestamp: new Date().toISOString() });
};

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
