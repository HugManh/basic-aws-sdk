const { createAwsKey } = require(".");
const { processFile } = require("./file");
const { getSignedUrlPromise } = require("./getSignedUrl");

module.exports = {
    processFile,
    createAwsKey,
    getSignedUrlPromise
}