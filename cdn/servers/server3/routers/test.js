const test = require("express").Router();
const { s3 } = require("../config/S3.js");
const fs = require("fs");
const path = require("path");
const redis = require("redis");

// You can pass any class that implements Map interface
const LRUMap = require("lru-cache");
const Cache = require("@hqjs/stream-buffer-cache")(LRUMap);

// LRU cache options
const options = {
  // length: 10 ** 6,
  max: 500,
  maxAge: 1000 * 60 * 60 * 60, //ms
};

// Pass your Map class option to Cache constructor
const cacheStream = new Cache(options);

/** create cache */
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 30000 }); //time: seconds

const client = redis.createClient();

client.on("error", (err) => {
  console.error(err);
});

test.get("/down/:key", async (req, res) => {
  try {
    const key = req.params.key;
    console.log(key);
    const range = req.headers.range;
    console.log("\n", range);

    //get metadata
    const meta_data = await getMeta(key);
    // console.log("meta", meta_data);
    //
    const contentLength = meta_data.ContentLength;
    console.log(contentLength);
    const contentType = meta_data.ContentType;
    console.log(contentType);

    const CHUNK_SIZE = 10 ** 6; //1MB
    const start = Number(range.replace(/\D/g, ""));

    console.log("Start: ", start);
    const end = Math.min(start + CHUNK_SIZE, contentLength - 1);

    console.log("End: ", end);
    const length = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${contentLength}`,
      "Accept-Ranges": "bytes",
      "Content-Length": length,
      "Content-Type": contentType,
    };

    const range_p = range + end;
    const params = {
      Bucket: "devceph2",
      Key: key,
      Range: range_p,
    };

    let cached = myCache.get(range_p);
    if (cached) {
      console.log("\nCACHE: ", range_p);
      res.setHeader("X-Cache", "HIT");
      res.writeHead(206, headers);
      res.write(cached);
      res.end();
    } else {
      console.log("\nSERVER: ", range_p);

      res.writeHead(206, headers);

      let readStream = s3.getObject(params).createReadStream();
      const bufs = [];
      readStream
        .on("data", (chunk) => {
          bufs.push(chunk);
        })
        .on("end", () => {
          let buf = Buffer.concat(bufs);
          myCache.set(range_p, buf, 3000);
          res.write(buf);
          res.end();
        });
      readStream.pipe(cacheStream.set(range_p)).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

//function get metadata (cb)
var getMeta = async (key) => {
  // console.log("Key:", key);
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, data) => {
        if (data) {
          // console.log("load from cache");
          const metaData = JSON.parse(data);
          resolve(metaData);
        } else {
          console.log("load from S3");
          s3.headObject(
            {
              Bucket: "devceph2",
              Key: key,
            },
            (err, res) => {
              const metaData = JSON.stringify(res);
              client.setex(key, 3000, metaData); //time: seconds
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

module.exports = test;
