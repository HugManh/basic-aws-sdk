const AWS = require("aws-sdk");

class AwsClient {
    constructor(config) {
        this.clientType = 'aws_s3';
        this.type = 'AWS';
        this._s3Params = config.s3Params;
        this._awsBucketName = config.bucketName;
        this._client = new AWS.S3(this._s3Params);
    }

    // _createAwsKey(requestObjectKey) {
    //     const now = new Date();
    //     return `${now.toLocaleDateString("zh-Hans-CN")}/${requestObjectKey}`;
    // }

    async objectHead(keyContext) {
        const awskey = keyContext.objectKey
        const params = {
            Bucket: keyContext.bucketName,
            Key: awskey
        };

        try {
            return await this._client.headObject(params).promise();
        } catch (err) {
            throw new Error(err);
        }
    }

    async getSignedUrl(operation, keyContext) {
        console.error("keyContext ", keyContext)
        const awskey = keyContext.objectKey
        const params = {
            Bucket: keyContext.bucketName,
            Key: awskey,
        }
        try {
            return this._client.getSignedUrlPromise(operation, params).then(val => val);
        } catch (err) {
            throw new Error(err);
        }
    }

    async get(objectGetInfo, range) {
        const { objectKey, bucketname } = objectGetInfo;
        const params = {
            Bucket: bucketname,
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
