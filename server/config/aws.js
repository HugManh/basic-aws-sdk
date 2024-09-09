const AwsClient = require("../services/AWSClient");
require("dotenv").config();

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
  }

  console.log(clientConfig)

  clients['aws'] = new AwsClient(clientConfig)
  return clients['aws']
}

module.exports = { parseConfig };
