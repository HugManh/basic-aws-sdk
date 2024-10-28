import { aws as awsConfig } from "../config"
import AwsClient from "../services/AWSClient"

const awsClient = new AwsClient(awsConfig.default)

export default awsClient