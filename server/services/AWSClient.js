const AWS = require("aws-sdk");

class AwsClient {
    constructor(config) {
        this.clientType = 'aws_s3';
        this.type = 'AWS';
        this._s3Params = config.s3Params;
        this._client = new AWS.S3(this._s3Params);
    }

    createAwsKey(requestObjectKey) {
        const now = new Date();
        return `${now.toLocaleDateString("zh-Hans-CN")}/${requestObjectKey}`;
    }

    async getSignedUrl(operation, objectGetInfo) {
        console.error("objectGetInfo ", objectGetInfo)
        const { objectKey, bucketName, mimetype } = objectGetInfo;
        try {
            const awskey = objectKey
            const params = {
                Bucket: bucketName,
                Key: awskey,
                ContentType: mimetype
            }
            return await this._client.getSignedUrlPromise(operation, params);
        } catch (err) {
            throw new Error(err);
        }
    }

    async getObject(objectGetInfo, range) {
        const { objectKey, bucketName } = objectGetInfo;
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Range: range ? `bytes=${range[0]}-${range[1]}` : null,
        };

        try {
            return await this._client.getObject(params).promise();
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = AwsClient;
