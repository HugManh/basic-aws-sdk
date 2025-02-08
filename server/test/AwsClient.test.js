require("dotenv").config({ path: `.env.local` });
const fs = require('fs');
const path = require("path");
const mime = require('mime-types')
const AwsClient = require('./AwsClient.test')

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
};
console.log("config", config);
const client = new AwsClient(config);

// client.createBucket("dinodino")


const createAwsKey = (name) => {
    let now = new Date();
    return now.toLocaleDateString("zh-Hans-CN") + "/" + name
}

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

const fileInfo = processFile("C:\\Users\\Admin\\Pictures\\developer-HugManh.jpg", true);
const { metadata, buffer } = fileInfo;
const objectkey = createAwsKey(metadata.fileName)
client.put("dinodino", objectkey, buffer, metadata.mimetype)

client.getSignedUrl("getObject", "dinodino", objectkey).then((url) => { console.log(url) })
