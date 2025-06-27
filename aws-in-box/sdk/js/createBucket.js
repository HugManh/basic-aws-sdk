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
async function createBucket(bucketName) {
    try {
        const params = {
            Bucket: bucketName,
        };

        const data = await s3.createBucket(params).promise();
        console.log(`✅ Bucket "${bucketName}" created successfully.`);
        console.log("📦 Response:", data);
    } catch (error) {
        console.error("❌ [Exception]", error.message);
    }
}

createBucket(BUCKET_NAME);