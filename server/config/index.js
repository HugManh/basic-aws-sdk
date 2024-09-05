require("dotenv").config();
const { parseConfig } = require('./s3')

const client = parseConfig()

module.exports = {
    client
}
