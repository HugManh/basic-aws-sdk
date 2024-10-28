import dotenv from 'dotenv';
dotenv.config({ path: `.env.development` });

export default {
  development: {
    default: {
      s3Params: {
        endpoint: process.env.AWS_END_POINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: "v4"
      }
    },
  }
}
