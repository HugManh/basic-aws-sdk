const { s3Instance } = require("../config/S3");
require("dotenv").config();
/* Cache */
// const { redisServer } = require("../connect/redis");
// const NodeCache = require("node-cache");
// const myCache = new NodeCache({ stdTTL: 3000 }); // time: seconds

const S3Ctrl = {
    generateUrl: async (req, res) => {
        try {
            console.log("Params Request: ", req.params);
            const { bucketname, filename } = req.params;
            const params = {
                Bucket: bucketname,
                // ACL: "public-read",
                Key: filename,
            };
            var url = await s3Instance.getSignedUrlPromise("putObject", params);
            console.log("[SignedUrl] url: ", url);
            res.status(200).json({ "message": "Response from S3 server successfully", "data": url });
        } catch (error) {
            res.status(500).json({ "message": error.message });
        }
    },
    getData: async (req, res) => {
        try {
            console.log(req.params);
            const { bucketname, objectkey, filename } = req.params;
            let key = filename
            if (objectkey) {
                key = objectkey + "/" + filename;
            }
            const params = {
                Bucket: bucketname,
                Key: key,
            };
            const meta_data = await getMeta(bucketname, key);
            s3Instance.getObject(params, (err, data) => {
                if (err) {
                    res.status(500).json({ message: err });
                } else {
                    // console.log(data);
                    res.setHeader("X-Cache", "MISS");
                    res.writeHead(200, meta_data);
                    res.end(data.Body);
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listKeys: async (req, res) => {
        try {
            const { bucketname } = req.params;
            const params = {
                Bucket: bucketname
            };

            s3Instance.listObjectsV2(params, (err, data) => {
                const list = data.Contents.filter(it => {
                    return (it.Key.endsWith(".png") || it.Key.endsWith(".jpg"))
                })
                res.status(200).json({ "message": "Response from S3 server successfully", "data": list });
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // getData: async (req, res) => {
    //     try {
    //         const key = req.params.key;
    //         const range = req.headers.range;

    //         // Get metadata
    //         const meta_data = await getMeta(key);
    //         const contentLength = meta_data.ContentLength;
    //         const contentType = meta_data.ContentType;
    //         const size = contentLength / 10 ** 6;

    //         // Check size data && range header
    //         if (!range || size < 50) {
    //             // size < 50MB
    //             // Check data in cache ? data cache : data S3
    //             const data_c = myCache.get(key);
    //             if (data_c) {
    //                 const data = JSON.parse(data_c);
    //                 const buffer = Buffer.from(data.Body);

    //                 res.setHeader("Control-Cache", "public, max-age:3000");
    //                 res.setHeader("X-Cache", "HIT");
    //                 res.writeHead(200, meta_data);
    //                 res.end(buffer);
    //             } else {
    //                 const params = {
    //                     Bucket: process.env.BUCKET_NAME,
    //                     Key: key,
    //                 };
    //                 s3.getObject(params, (err, data) => {
    //                     // console.log(data);
    //                     myCache.set(key, JSON.stringify(data));
    //                     res.setHeader("X-Cache", "MISS");
    //                     res.writeHead(200, meta_data);
    //                     res.end(data.Body);
    //                 });
    //             }
    //         } else {
    //             // size > 50MB
    //             const CHUNK_SIZE = 10 ** 6; //1MB
    //             const start = Number(range.replace(/\D/g, ""));
    //             // console.log("Start: ", start);
    //             const end = Math.min(start + CHUNK_SIZE, contentLength - 1);
    //             // console.log("End: ", end);
    //             const length = end - start + 1;

    //             //headers options
    //             const headers = {
    //                 "Content-Range": `bytes ${start}-${end}/${contentLength}`,
    //                 "Accept-Ranges": "bytes",
    //                 "Content-Length": length,
    //                 "Content-Type": contentType,
    //             };

    //             const range_p = range + end; //bytes=start-end
    //             const key_range = key + "/" + range_p;
    //             const params = {
    //                 Bucket: process.env.BUCKET_NAME,
    //                 Key: key,
    //                 Range: range_p,
    //             };

    //             let cached = cacheStream.get(key_range);
    //             if (cached) {
    //                 res.setHeader("X-Cache", "HIT");
    //                 res.writeHead(206, headers);
    //                 cached.pipe(res);
    //             } else {
    //                 res.setHeader("X-Cache", "MISS");
    //                 res.writeHead(206, headers);

    //                 let readStream = s3.getObject(params).createReadStream();
    //                 readStream.pipe(cacheStream.set(key_range)).pipe(res);
    //             }
    //         }
    //     } catch (error) {
    //         res.status(500).json({ Error: error.message });
    //     }
    // }
}

/* Get metadata */
var getMeta = async (bucketname, key) => {
    console.log("bucketname: ", bucketname, "key: ", key);
    return new Promise((resolve, reject) => {
        try {
            // redisServer.get(key, (err, data) => {
            //   if (data) {
            //     // console.log("Load metadata from cache");
            //     const metaData = JSON.parse(data);
            //     resolve(metaData);
            //   } else {
            // console.log("Load metadata from S3");
            s3Instance.headObject(
                {
                    Bucket: bucketname,
                    Key: key,
                },
                (err, res) => {
                    console.log("---", res);
                    if (err) reject(err);
                    delete res.Metadata
                    // redisServer.setex(key, 3000, metaData); //time: seconds
                    resolve(res);
                }
            );
            //   }
            // });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = S3Ctrl;
