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

function getObject(key) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error("❌ Error getting object:", err.message);
            return;
        }

        try {
            const content = data.Body.toString("utf-8");
            console.log("✅ File content:", content);
        } catch (error) {
            console.error("❌ Error parsing object:", error.message);
        }
    });
}

getObject(awsKey);