require("dotenv").config();
const AWS = require("aws-sdk");

// Validate required environment variables
const requiredEnv = ["AWS_END_POINT", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_BUCKET_NAME"];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

const s3 = new AWS.S3({
    endpoint: process.env.AWS_END_POINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Main logic
let dataStoreVersionId = null;
const awsKey = "test/fzWcDFqbvcbvc9nv6DKPm8/test.json";


async function headObject(key) {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        if (dataStoreVersionId) {
            params.VersionId = dataStoreVersionId;
        }

        const data = await s3.headObject(params).promise();
        console.log("✅ Object metadata:", data);
    } catch (error) {
        console.error("❌ [Exception]", error.message);
    }
}

headObject(awsKey);
