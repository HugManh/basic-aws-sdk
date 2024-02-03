const { s3Instance } = require("../../config/S3");

async function objectHead(bucketname, key) {
    console.log("[objectHead]: bucketname: ", bucketname, "key: ", key);
    return new Promise((resolve, reject) => {
        try {
            console.log("Load metadata from S3");
            s3Instance.headObject(
                {
                    Bucket: bucketname,
                    Key: key,
                },
                (err, res) => {
                    if (err) {
                        reject(err);
                    };
                    resolve(res);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    objectHead
}