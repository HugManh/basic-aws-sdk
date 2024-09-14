const { s3 } = require("../../../config")


// Get list buckets
s3.listBuckets((err, data) => {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log('List object:', data.Buckets);
    }
});
