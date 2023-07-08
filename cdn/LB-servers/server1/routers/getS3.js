const gets3 = require("express").Router();
const { s3 } = require("../config/S3");
require("dotenv").config();
const { redisServer } = require("../connect/redis");

/* Stream cache */
const LRUMap = require("lru-cache");
const Cache = require("@hqjs/stream-buffer-cache")(LRUMap);

const options = {
  maxAge: 1000 * 60 * 60, //ms
};

const cacheStream = new Cache(options);

/* Node Cache */
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 3000 }); //time: seconds

/** get url can put image to s3
 * return url s3 (putObject)
 */
gets3.get("/geturl/:key", async (req, res) => {
  try {
    // console.log("Param: key = ", req.params.key);
    const key = req.params.key;
    // console.log(key);
    const params = {
      Bucket: process.env.BUCKET_NAME,
      ACL: "public-read",
      Key: key,
    };
    var url = await s3.getSignedUrlPromise("putObject", params);
    // console.log("Url put object: ", url);
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

/** down object - redis(save headers) node-cache(save data)
 * input: key
 * return: data
 */
gets3.get("/down/:key", async (req, res) => {
  try {
    const key = req.params.key;
    // console.log("Key: ", key);
    const range = req.headers.range;

    //get metadata
    const meta_data = await getMeta(key);
    const contentLength = meta_data.ContentLength;
    const contentType = meta_data.ContentType;
    const size = contentLength / 10 ** 6;

    // check size, range
    if (!range || size < 50) {
      //size < 50MB
      // Check data in cache ? data cache : data S3
      const data_c = myCache.get(key);
      if (data_c) {
        //get data from cache
        // console.log("Load data from cache");
        const data = JSON.parse(data_c);
        //   console.log(data.Body); // ['string', 'Buffer']
        const buffer = Buffer.from(data.Body);

        res.setHeader("Control-Cache", "public, max-age:3000");
        res.setHeader("X-Cache", "HIT");
        res.writeHead(200, meta_data);

        res.end(buffer);
      } else {
        //get data from S3
        // console.log("Load data from S3");
        res.setHeader("X-Cache", "MISS");
        res.writeHead(200, meta_data);
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        };
        s3.getObject(params, (err, data) => {
          // console.log(data);
          myCache.set(key, JSON.stringify(data));
          res.end(data.Body);
        });
      }
    } else {
      // > 50MB
      const CHUNK_SIZE = 10 ** 6; //1MB
      const start = Number(range.replace(/\D/g, ""));
      // console.log("Start: ", start);
      const end = Math.min(start + CHUNK_SIZE, contentLength - 1);
      // console.log("End: ", end);
      const length = end - start + 1;

      //headers options
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": length,
        "Content-Type": contentType,
      };

      const range_p = range + end; //bytes=start-end
      const key_range = key + "/" + range_p;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Range: range_p,
      };

      let cached = cacheStream.get(key_range);
      if (cached) {
        // console.log("CACHE: ", key_range, "\n");
        res.setHeader("X-Cache", "HIT");
        res.writeHead(206, headers);
        cached.pipe(res);
      } else {
        // console.log("SERVER: ", key_range, "\n");
        res.setHeader("X-Cache", "MISS");
        res.writeHead(206, headers);

        let readStream = s3.getObject(params).createReadStream();

        readStream.pipe(cacheStream.set(key_range)).pipe(res);
      }
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

//function get metadata
var getMeta = async (key) => {
  // console.log("Key:", key);
  return new Promise((resolve, reject) => {
    try {
      redisServer.get(key, (err, data) => {
        if (data) {
          // console.log("Load metadata from cache");
          const metaData = JSON.parse(data);
          resolve(metaData);
        } else {
          // console.log("Load metadata from S3");
          s3.headObject(
            {
              Bucket: "devceph2",
              Key: key,
            },
            (err, res) => {
              const metaData = JSON.stringify(res);
              redisServer.setex(key, 3000, metaData); //time: seconds
              resolve(metaData);
            }
          );
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = gets3;
