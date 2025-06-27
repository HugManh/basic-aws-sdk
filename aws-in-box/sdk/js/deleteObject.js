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
const awsKey = "test/fzWcDFqbvcbvc9nv6DKPm8/test.json";
const versionId = "CSHES8vxZtrQu9fxLXeJ-yLJnAy9.z8"; // or null if not needed

async function deleteObject(key, versionId = null) {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        if (versionId) {
            params.VersionId = versionId;
        }

        const data = await s3.deleteObject(params).promise();
        console.log(`✅ Object deleted: ${key} ${versionId ? `(version: ${versionId})` : ""}`);
        console.log("📦 Response:", data);
    } catch (error) {
        console.error("❌ [Exception]", error.message);
    }
}

deleteObject(awsKey, versionId);
