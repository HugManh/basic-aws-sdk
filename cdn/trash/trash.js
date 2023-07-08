/** down image - no cache
 * input: key - name image
 * return: string image
 */
test.get("/down", async (req, res) => {
  try {
    console.log(req.query["name"]);
    const name = req.query["name"];
    const params = {
      Bucket: "devceph2",
      Key: name,
    };
    s3.getObject(params, (err, data) => {
      if (err) console.error(err);
      // console.log(name);
      // console.log(data);
      fs.writeFileSync(path.join(__dirname, "../img", key), data.Body);
      data.Body =
        "data:image/jpeg;base64," +
        Buffer.from(data.Body, "binary").toString("base64");
      console.log("Image Downloaded.");
      res.status(200).json({
        success: true,
        meta_data: "from server",
        data: data,
      });
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

/** upload image to s3
 * input: file
 * return: url put object
 */
test.post("/upload", async (req, res) => {
  try {
    // console.log("Object: ", req.files);
    const file = req.files;
    if (!file) {
      res.status(400).json({ message: "No file !!" });
    }
    // fs.writeFileSync(path.join(__dirname, file.files.name), file.files.data);
    console.log(file.file.name);
    // put data with url
    const params = {
      Bucket: "devceph2",
      Key: `upload_files/img/${file.file.name}`,
      ACL: "public-read",
      Body: file.file.data,
    };
    var url = await s3.getSignedUrlPromise("putObject", params);
    // console.log(url);
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

/** get list url image
 * return: list url get object
 */
test.get("/url", async (req, res) => {
  try {
    var params = {
      Bucket: "devceph2",
      Prefix: "",
    };

    // Call S3 to obtain a list of the objects in the bucket
    const list = await s3.listObjects(params).promise();
    // console.log(list.Contents);
    const listContent = list.Contents;

    // const list_url = await listContent.map((img) => {
    //   //   console.log(img.Key);
    //   const key = img.Key;
    //   const params = {
    //     Bucket: "devceph2",
    //     Key: key,
    //   };

    //   const url = s3.getSignedUrl("getObject", params).split("?")[0];
    //   return { Url: url, Key: key };

    //   // console.log(url_img);
    // });
    // console.log("List image:", list_url);

    res.status(200).json(listContent);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

/** down image - nocache
   * input: key
   * return: 
          object{
            success: true/false,
            meta_data: "from server/from cache",
            data: object,
          }
  */

var getMeta = (key, callback) => {
  console.log("Key:", key);
  client.get(key, (err, data) => {
    if (data) {
      console.log("load from cache");
      const metaData = JSON.parse(data);
      // console.log(metaData);
      // return callback({ Message: "load from cache", Metadata: metaData });
      return callback(metaData);
    } else {
      console.log("load from S3");
      s3.headObject(
        {
          Bucket: "devceph2",
          Key: key,
        },
        (err, response) => {
          const acceptRanges = response.AcceptRanges;
          const lastModified = response.LastModified;
          const contentLength = response.ContentLength;
          const eTag = response.ETag;
          const contentType = response.ContentType;

          const metaData = {
            AcceptRanges: acceptRanges,
            LastModified: lastModified,
            ContentLength: contentLength,
            ETag: eTag,
            ContentType: contentType,
          };
          const str = JSON.stringify(metaData);
          client.setex(key, 3000, str); //time: seconds
          // console.log(metaData);
          // return callback({ Message: "load from S3", Metadata: metaData });
          return callback(metaData);
        }
      );
    }
  });
};
