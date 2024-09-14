const { s3 } = require("../../../config")

const bucketName = "bizflydev"

function headObject(key) {
    try {
        const params = {
            Bucket: bucketName,
            Key: key
        };
        s3.headObject(params, function (err, data) {
            if (err) console.log(err, err.stack)
            else console.log(data);
        });
    } catch (error) {
        console.error("[Exception] " + error.message);
    }
}

headObject("2024/8/16/SampleJPGImage_30mbmb.jpg")