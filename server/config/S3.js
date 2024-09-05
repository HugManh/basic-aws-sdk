const AwsClient = require("../services/AWSClient");


function parseConfig(config) {
  const clients = {}
  const clientConfig = {
    s3Params: {
      endpoint: process.env.AWS_END_POINT,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sslEnabled: false,
      s3ForcePathStyle: true,
      // signatureVersion: "v4"
    },
    bucketName: 'yyyyyyy'
  }

  clients['aws'] = new AwsClient(clientConfig)
  return clients['aws']
}

module.exports = { parseConfig };
