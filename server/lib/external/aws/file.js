const fs = require('fs');
const path = require("path");
const mime = require('mime-types')

// const defaultFilePath = path.join(__dirname, "../../dataLocal/ngan-pham-lil-ants-anim-test-v06.gif")
const defaultFilePath = path.join(__dirname, "../../dataLocal/16756502&22891-tttt.jpg")

// Process the file (metadata, buffer)
const processFile = (filePath, includeBuffer = false) => {
    const stats = fs.statSync(filePath);
    const metadata = {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        fileName: path.basename(filePath),
        mimetype: mime.lookup(filePath),
    };
    let buffer = null;
    if (includeBuffer) {
        buffer = fs.readFileSync(filePath);
    }
    return { metadata, buffer };
};

module.exports = { processFile, defaultFilePath }