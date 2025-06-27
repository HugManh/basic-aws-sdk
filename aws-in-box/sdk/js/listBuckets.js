require("dotenv").config();
const AWS = require("aws-sdk");

// Validate required environment variables
const requiredEnv = ["AWS_END_POINT", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
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

const listBuckets = async () => {
    try {
        const data = await s3.listBuckets().promise();

        if (!data.Buckets?.length) {
            console.log("🟡 No buckets found.");
            return;
        }

        console.log("✅ List of buckets:");
        data.Buckets.forEach((bucket, idx) => {
            console.log(`${idx + 1}. ${bucket.Name}`);
        });
    } catch (err) {
        console.error("❌ Error listing buckets:", err.message);
    }
};


listBuckets();
