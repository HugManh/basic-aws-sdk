const AWS = require('aws-sdk');

class AwsClient {
    constructor(config) {
        this.clientType = 'aws_s3';
        this.type = 'AWS';
        this._s3Params = config.s3Params;
        this._client = new AWS.S3(this._s3Params);
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

    /**
     * 
     * @param {*} operation getObject | putObject
     * @param {*} bucketName 
     * @param {*} objectkey 
     * @returns singed url
     */
    async getSignedUrl(operation, bucketName, objectkey) {
        const params = {
            Bucket: bucketName,
            Key: objectkey,
        };

        if (contentType !== undefined) {
            params.ContentType = contentType;
        }

        return await client.getSignedUrlPromise(operation, params);
    }


    _createAwsKey(objectkey) {
        return objectkey
    }
}

module.exports = AwsClient;
