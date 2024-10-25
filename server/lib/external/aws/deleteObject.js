
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

const key = "fzWcDFq9nv6DKPm8/test.json"
const params = {
    Bucket: config.bucketName,
    Key: key,
    VersionId: "CSHES8vxZtrQu9fxLXeJ-yLJnAy9.z8",
};

// Delete the file to S3
client.deleteObject(params, (err, data) => {
    if (err) {
        console.error('Delete Object:', err);
    } else {
        console.log('Delete successful:', data);
    }
});
