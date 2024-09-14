const { s3 } = require("../../../config")

function createBucket(bucketName) {
    try {
        const params = {
            Bucket: bucketName,
        };

        s3.createBucket(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Location);
            }
        });
    } catch (error) {
        console.error("[Exception] " + error.message);
    }
}

createBucket("dinotest1")