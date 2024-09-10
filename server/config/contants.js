const path = require('path')

const DIR_LIB_AWS = path.join(__dirname, '../lib/aws')
const DIR_DATA = path.join(__dirname, '../data')
const isProd = false
module.exports = {
    DIR_LIB_AWS,
    DIR_DATA,
    isProd
}