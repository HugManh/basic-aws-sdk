const prompt = require('prompt-sync')({ sigint: true });
const { s3 } = require("../../../config")


// Define the parameters for the upload
// If ContentType empty, then octet-stream is default type
const bucketName = process.env.AWS_BUCKET_NAME || "dino-bucket";
const params = {
    Bucket: bucketName
};

const endpoint = "http://x3-cdn-dev.sohatv.vn/dREDTeTMJv01SNMC/bizflydev"

s3.getSignedUrlPromise
// Get list the file from storage
s3.listObjectsV2(params, (err, data) => {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log('List object:');
        data.Contents.forEach((val, idx, arr) => {
            if (val.Key.endsWith(".jpg") || val.Key.endsWith(".webp") || val.Key.endsWith(".ts") || val.Key.endsWith(".png")) {
                // console.log(idx + '. ' + val.Key)
                console.log(endpoint + '/' + val.Key)
            }
        })
    }
});
