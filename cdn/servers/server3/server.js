const express = require("express");
const http = require("http");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const gets3 = require("./routers/getS3");
const health = require("./routers/health");
const subHealth = require("./middleware/subhealth");
const pubHealth = require("./middleware/pubhealth");
const { numberConnect } = require("./middleware/healthCheck");

// const test = require("./routers/test");

const app = express();

app.use(cors()); //chia se tai nguyen
// app.use(express.static("client"));
app.use(cookieParser());
app.use(fileUpload());

/**
 * Health check
 */
pubHealth();
subHealth();

/**
 * Routers */
app.use("/gets3", gets3);
app.use("/apis", health);
app.get("/", (req, res) => {
  res.json({
    message: "Server 3 :)",
  });
});

/**
 * Create server */
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
