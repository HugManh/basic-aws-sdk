const { s3 } = require("../../../config")

function deleteBucket(bucketName) {
    try {
        const params = {
            Bucket: bucketName,
        };

        s3.deleteBucket(params, function (err, data) {
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

deleteBucket("dinotest")