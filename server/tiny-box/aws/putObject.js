// require("dotenv").config();
// const AWS = require("aws-sdk");
// const { processFile, defaultFilePath } = require('./file');

// const config = {
//     s3Params: {
//         endpoint: process.env.AWS_END_POINT,
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         sslEnabled: false,
//         s3ForcePathStyle: true,
//         // signatureVersion: "v4"
//     },
//     bucketName: process.env.AWS_BUCKET_NAME
// }

// const client = new AWS.S3(config.s3Params);

// const createAwsKey = (name) => {
//     let now = new Date();
//     return now.toLocaleDateString("zh-Hans-CN") + "/" + name
// }

// const getSignedUrlPromise = async (operation, params) => {
//     try {
//         console.log('processing aws...');
//         console.log('params ', params);
//         const url = await client.getSignedUrlPromise(operation, params)
//         return url
//     } catch (err) {
//         throw new Error(err.message)
//     }
// }

// // const putObject = async (params) => {

// //     // Define the parameters for the upload
// //     // If ContentType empty, then octet-stream is default type
// //     const params = {
// //         Bucket: config.bucketName,
// //         Key: awsKey,
// //         Body: buffer,
// //     };

// //     const data = await putObject(params)
// //     console.log(params.Bucket + '/' + params.Key, data);

// //     // Upload the file to S3
// //     return client.putObject(params, (err, data) => {
// //         if (err) {
// //             console.error('Upload data: ', err);
// //             throw new Error(err.message)
// //         }
// //         return data;
// //     });
// // }


// // Main function
// const main = async () => {
//     const hasType = false;
//     const fileInfo = processFile(defaultFilePath, true);
//     const { metadata, buffer } = fileInfo;
//     const awsKey = createAwsKey(metadata.fileName)
//     console.log(config.s3Params);

//     const params = {
//         Bucket: config.bucketName,
//         Key: awsKey,
//         // Expires: 60 * 5,
//         ContentType: hasType ? metadata.mimetype : '',
//     };
//     const url = await getSignedUrlPromise('putObject', params);
//     console.log(url);

//     // Upload assets by signed url
//     const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': hasType ? metadata.mimetype : '', // Match the Content-Type to what you expect
//         },
//         body: buffer,
//     });

//     let result = {
//         url,
//         bucket: params.Bucket,
//         key: params.Key
//     }
//     if (response.ok) {
//         result = {
//             ...result,
//             id: response.headers.get('x-amz-request-id'),
//         };
//         console.log({ success: true, level: "info", message: 'Put object success', ...result, timestamp: new Date().toISOString() })
//         return
//     }
//     console.error({ success: false, level: "error", message: `File put failed`, ...result, timestamp: new Date().toISOString() });
// };

// main().catch((err) => {
//     console.error('Error:', err.message);
//     process.exit(1);
// });



require("dotenv").config();
const AWS = require("aws-sdk");
const { processFile } = require('./file');

const config = {
    s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: "v4",
    },
    bucketName: process.env.AWS_BUCKET_NAME
}
console.log(config)
const client = new AWS.S3(config.s3Params);

const fileInfo = processFile("D:\\localdata\\Videos\\shorts\\mixkit-pet-owner-playing-with-a-cute-cat-1779-medium.mp4", true);
const { metadata, buffer } = fileInfo;
const createAwsKey = (name) => {
    let now = new Date();
    return now.toLocaleDateString("zh-Hans-CN") + "/" + name
}
const awsKey = createAwsKey(metadata.fileName)
console.log(awsKey)

// const awsKey = "test/fzWcDFqbvcbvc9nv6DKPm8/test.json"
// const buffer = "oke man"
// metadata.mimetype = "application/json"

// Define key and buffer
const aws_key = "1111111111111111/test.json"
const buffers = ""

const uploadParams = {
    Bucket: config.bucketName,
    Key: aws_key,
    Body: buffers,
    // SSECustomerAlgorithm: 'AES256',
    // SSECustomerKey: Buffer.from('your-customer-key', 'base64'),
    // SSECustomerKeyMD5: crypto.createHash('md5').update('your-customer-key').digest('base64'),
    // ContentType: metadata.mimetype,
};

client.putObject(uploadParams, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Successfully uploaded data with SSE-C:', data);
});
