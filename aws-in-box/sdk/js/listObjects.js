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
const ALLOWED_EXTENSIONS = [".jpg", ".webp", ".ts", ".png"];

const listObjects = async () => {
    try {
        const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();

        if (!data.Contents || data.Contents.length === 0) {
            console.log("🟡 No objects found in bucket.");
            return;
        }

        console.log("✅ List of objects:");
        data.Contents.forEach((item, index) => {
            const key = item.Key;
            if (ALLOWED_EXTENSIONS.some(ext => key.endsWith(ext))) {
                console.log(`${index}. ${key}`);
            }
        });
    } catch (err) {
        console.error("❌ Error listing objects:", err.message);
    }
};

listObjects();
