const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

/**
 *  List route
 */
const RouteS3 = require("./routes/RouteS3");

const app = express();

app.use(cors()); //chia se tai nguyen
// app.use(express.static("client"));
app.use(cookieParser());
app.use(fileUpload());

/**
 * Routers
 */
app.use("/s3", RouteS3);
app.get("/", (req, res) => {
  res.json({
    message: "Server 3 :)",
  });
});

/**
 * Create server
 */
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
