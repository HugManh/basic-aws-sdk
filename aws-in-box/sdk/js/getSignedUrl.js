#!/usr/bin/env node

require("dotenv").config({ path: `.env.local` });
const AWS = require("aws-sdk");
const readline = require("readline");
// Process the file (metadata, buffer)
const processFile = (filePath, includeBuffer = false) => {
    console.log("=====", filePath)
    const stats = fs.statSync(filePath);
    const metadata = {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        fileName: path.basename(filePath),
        mimetype: mime.lookup(filePath),
    };
    let buffer = null;
    if (includeBuffer) {
        buffer = fs.readFileSync(filePath);
    }
    return { metadata, buffer };
};

// Configurations
const config = {
    s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: true,
        s3ForcePathStyle: true,
        signatureVersion: "v4",
    },
    bucketName: process.env.AWS_BUCKET_NAME
};
console.log("config", config);
const client = new AWS.S3(config.s3Params);

const createAwsKey = (name) => {
    let now = new Date();
    return now.toLocaleDateString("zh-Hans-CN") + "/" + name;
};

const getSignedUrlPromise = async (operation, params) => {
    try {
        console.log({ success: true, level: "info", message: operation, ...params, timestamp: new Date().toISOString() });
        const url = await client.getSignedUrlPromise(operation, params);
        return url;
    } catch (err) {
        throw new Error(err.message);
    }
};
// CLI Menu
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const menu = `
Choose an option:
1. getObject
2. putObject
3. Exit
Enter your choice: `;

const handleGetObject = async () => {
    rl.question("Enter the S3 key to retrieve: ", async (key) => {
        const params = {
            Bucket: config.bucketName,
            Key: key,
        };
        try {
            const url = await getSignedUrlPromise("getObject", params);
            console.log("Signed URL for getObject:", url);
        } catch (err) {
            console.error("Error getting signed URL:", err.message);
        } finally {
            displayMenu();
        }
    });
};

const handlePutObject = async () => {
    rl.question("Enter the local file path to upload: ", (localPath) => {
        rl.question("Enter the S3 key for the file: ", async (key) => {
            const fileInfo = processFile(localPath);
            const { metadata } = fileInfo;
            const params = {
                Bucket: config.bucketName,
                Key: key,
                ContentType: metadata.mimetype,
            };
            try {
                const url = await getSignedUrlPromise("putObject", params);
                console.log("Signed URL for putObject:", url);
            } catch (err) {
                console.error("Error creating signed URL:", err.message);
            } finally {
                displayMenu();
            }
        });
    });
};

const displayMenu = () => {
    rl.question(menu, (choice) => {
        switch (choice.trim()) {
            case "1":
                handleGetObject();
                break;
            case "2":
                handlePutObject();
                break;
            case "3":
                console.log("Exiting...");
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please select 1, 2, or 3.");
                displayMenu();
        }
    });
};

// Start the CLI
displayMenu();