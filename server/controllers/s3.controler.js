const fs = require('fs-extra');
const { client } = require('../config');
const { uploadMem, uploadDisk } = require('../middleware');
const { MulterError } = require('multer');
require("dotenv").config();
const isProd = false

const AwsController = {
    uploadResource: (req, res) => {
        uploadDisk(req, res, err => {
            if (err) {
                return res.status(404).json({ success: false, error: { code: err.code, message: err.message, stack: !isProd ? err.stack : null } });
            } else if (!req.file?.buffer) {
                return res.status(400).json({ success: false, error: { message: 'File data not found' } });
            }
            const { originalname, size } = req.file;
            const value = { originalname, size };
            res.status(200).json({ success: true, data: !isProd ? value : null });
        })
    },

    // getResource: async (req, res) => {
    //     try {
    //         const { bucketname, objectpath, filename } = req.params;
    //         let objectKey = objectpath ? objectpath + "/" + filename : filename
    //         const objectGetInfo = {
    //             bucketname,
    //             objectKey
    //         }

    //         const data = await client.get(objectGetInfo);
    //         res.end(data.Body);

    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // },
    // listKeys: async (req, res) => {
    //     try {
    //         const { bucketname } = req.params;
    //         const params = {
    //             Bucket: bucketname
    //         };

    //         s3Instance.listObjectsV2(params, (err, data) => {
    //             const list = data.Contents.filter(it => {
    //                 return (it.Key.endsWith(".png") || it.Key.endsWith(".jpg"))
    //             })
    //             res.status(200).json({ "message": "Response from S3 server successfully", "data": list });
    //         })
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // },
    // getData: async (req, res) => {
    //     try {
    //         const { bucketname, objectpath, filename } = req.params;
    //         let key = filename
    //         if (objectpath) {
    //             key = objectpath + "/" + filename;
    //         }
    //         const range = req.headers.range;

    //         // Get metadata
    //         const meta_data = await objectHead(bucketname, key);
    //         console.log('meta_data:', meta_data);
    //         const contentLength = meta_data.ContentLength;
    //         const contentType = meta_data.ContentType;
    //         const size = contentLength / 10 ** 6;
    //         console.log('contentLength: %d contentType: %s', contentLength, contentType)
    //         // Check size data && range header
    //         if (!range && size < 2) {
    //             console.log('here1')
    //             // size < 50MB
    //             // Check data in cache ? data cache : data S3
    //             const cacheData = myCache.get(key);
    //             if (cacheData) {
    //                 const data = JSON.parse(cacheData);
    //                 const buffer = Buffer.from(data.Body);

    //                 res.setHeader("Control-Cache", "public, max-age:3000");
    //                 res.setHeader("X-Cache", "HIT");
    //                 res.writeHead(200, meta_data);
    //                 res.end(buffer);
    //             } else {
    //                 const params = {
    //                     Bucket: bucketname,
    //                     Key: key,
    //                 };
    //                 s3Instance.getObject(params, (err, data) => {
    //                     if (err) {
    //                         console.log(err);
    //                         res.status(500).json({ message: err });
    //                     } else {
    //                         myCache.set(key, JSON.stringify(data));
    //                         res.setHeader("X-Cache", "MISS");
    //                         res.writeHead(200, meta_data);
    //                         res.end(data.Body);
    //                     }
    //                 });
    //             }
    //         } else {
    //             // size > 50MB
    //             if (range) {
    //                 // const CHUNK_SIZE = 10 ** 6; //1MB
    //                 const start = Number(range.replace(/\D/g, ""));
    //                 // const end = Math.min(start + CHUNK_SIZE, contentLength - 1);
    //                 const end = contentLength - 1;
    //                 const length = end - start + 1;
    //                 console.log("Range: %d-%d Length: %d", start, end, length);
    //                 if (done) {
    //                     console.log("-----> in cache");
    //                     const headers = {
    //                         "Content-Range": `bytes ${start}-${end}/${contentLength}`,
    //                         "Accept-Ranges": "bytes",
    //                         "Content-Length": length,
    //                         "Content-Type": contentType,
    //                     };

    //                     res.setHeader("X-Cache", "HIT");
    //                     res.writeHead(206, headers);

    //                     fs.createReadStream('./trash/output.mp4', { start: start, end: end }).pipe(res);
    //                 } else {
    //                     console.log("-----> not cache");
    //                     //headers options
    //                     const headers = {
    //                         "Content-Range": `bytes ${start}-${end}/${contentLength}`,
    //                         "Accept-Ranges": "bytes",
    //                         "Content-Length": length,
    //                         "Content-Type": contentType,
    //                     };

    //                     const range_p = range + end; //bytes=start-end
    //                     console.log("range_p:", range_p);
    //                     const key_range = key + "/" + range_p;
    //                     const params = {
    //                         Bucket: bucketname,
    //                         Key: key,
    //                         Range: range_p.toString(),
    //                     };

    //                     // let cached = cacheStream.get(key_range);
    //                     // if (cached) {
    //                     //     res.setHeader("X-Cache", "HIT");
    //                     //     res.writeHead(206, headers);
    //                     //     cached.pipe(res);
    //                     // } else {
    //                     res.setHeader("X-Cache", "MISS");
    //                     res.writeHead(206, headers);

    //                     let readStream = s3Instance.getObject(params).createReadStream();
    //                     // readStream.pipe(cacheStream.set(key_range)).pipe(res);
    //                     readStream.pipe(res);
    //                     // }
    //                 }
    //             } else {
    //                 //headers options
    //                 const headers = {
    //                     "Accept-Ranges": "bytes",
    //                     "Content-Length": contentLength,
    //                     "Content-Type": contentType,
    //                 };
    //                 (done) ? res.setHeader("X-Cache", "HIT") : res.setHeader("X-Cache", "MISS");
    //                 res.writeHead(200, headers);
    //                 res.end()
    //                 if (!done) {
    //                     const params = {
    //                         Bucket: bucketname,
    //                         Key: key,
    //                     };
    //                     let readerStream = s3Instance.getObject(params).createReadStream();
    //                     let writerStream = fs.createWriteStream('./trash/output.mp4');
    //                     // readerStream.setEncoding('UTF8');
    //                     // Sự kiện khi đọc data
    //                     readerStream.on('data', function (chunk) {
    //                         // data += chunk;
    //                         writerStream.write(chunk)
    //                     });
    //                     //Khi kết thúc đọc data và in ra nội dung đã đọc
    //                     readerStream.on('end', function () {
    //                         console.log("--------------> write done!")
    //                         done = true
    //                     });
    //                     //Khi xảy ra lỗi in ra lỗi
    //                     readerStream.on('error', function (err) {
    //                         console.log(err.stack);
    //                     });
    //                 }
    //             }
    //         }
    //     } catch (err) {
    //         if (err.code) {
    //             res.status(err.code).json({ message: err.message });
    //         }
    //         res.status(500).json({ message: err.message });
    //     }
    // }
}

module.exports = AwsController;
