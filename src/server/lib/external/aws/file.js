const fs = require('fs');
const path = require("path");
const mime = require('mime-types')

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

module.exports = { processFile }