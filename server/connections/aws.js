import { aws as awsConfig } from "../config"
import AwsClient from "../services/AWSClient"

console.log("aws configuration", awsConfig.default)
const awsClient = new AwsClient(awsConfig.default)

export default awsClient