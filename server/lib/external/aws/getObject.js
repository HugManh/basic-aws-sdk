require("dotenv").config({ path: `.env.local` })
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
console.log(config)
const client = new AWS.S3(config.s3Params);

// Main
const awsKey = "test/fzWcDFqbvcbvc9nv6DKPm8/test.json"

const params = {
    Bucket: config.bucketName,
    Key: awsKey,
}

client.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);
});
