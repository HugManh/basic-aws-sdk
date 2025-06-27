const AWS = require("aws-sdk");

class AwsClient {
    constructor(config) {
        this.clientType = 'aws_s3';
        this.type = 'AWS';
        this._s3Params = config.s3Params;
        this._client = new AWS.S3(this._s3Params);
    }

    _createAwsKey(requestObjectKey) {
        const now = new Date();
        return `${now.toLocaleDateString("zh-Hans-CN")}/${requestObjectKey}`;
    }

    createBucket(bucketName) {
        const params = {
            Bucket: bucketName,
        };

        return this._client.createBucket(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Location);
            }
        });
    }

    put(bucketName, objectkey, stream, contentType) {
        const awsKey = this._createAwsKey(objectkey)

        const putCb = function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log('Successfully uploaded data with SSE-C:', data);

        };

        const params = {
            Bucket: bucketName,
            Key: awsKey,
        };

        if (contentType !== undefined) {
            params.ContentType = contentType;
        }
        if (!stream) {
            return this._client.putObject(params, putCb);
        }

        params.Body = stream;
        return this._client.upload(params, putCb);
    }

    async getSignedUrl(operation, objectGetInfo) {
        const { objectKey, bucketName, mimetype } = objectGetInfo;
        const awskey = objectKey
        const params = {
            Bucket: bucketName,
            Key: awskey,
            ContentType: mimetype
        }
        return await this._client.getSignedUrlPromise(operation, params);
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
