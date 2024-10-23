const path = require('path')

const DIR_LIB_AWS = path.join(__dirname, '../lib/aws')
const DIR_DATA = path.join(__dirname, '../data')
// const defaultFilePath = path.join(__dirname, "../../dataLocal/ngan-pham-lil-ants-anim-test-v06.gif")
const dataLocal = path.join(__dirname, "../dataLocal/16756502&22891-tttt.jpg")
// const dataLocal = path.join(__dirname, "../dataLocal/SampleJPGImage_30mbmb.jpg")
// const dataLocal = path.join(__dirname, "../dataLocal/Playlist-test.mp4")
const isProd = false
module.exports = {
    DIR_LIB_AWS,
    DIR_DATA,
    dataLocal,
    isProd
}