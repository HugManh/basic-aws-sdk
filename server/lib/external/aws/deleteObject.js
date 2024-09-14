
const prompt = require('prompt-sync')({ sigint: true });
const s3 = require("../../s3/config")

const objectKey = prompt('What is your key?: ');
console.log(`Hey there ${objectKey}`);

// Define the parameters for the upload
// If ContentType empty, then octet-stream is default type
const bucketName = process.env.BUCKET_NAME || "dino-bucket";
const params = {
    Bucket: bucketName,
    Key: objectKey,
};

// Delete the file to S3
s3.deleteObject(params, (err, data) => {
    if (err) {
        console.error('Delete Object:', err);
    } else {
        console.log('Delete successful:', data);
    }
});
