const express = require("express");
const http = require("http");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

/* Routers */
const gets3 = require("./routers/getS3");
const health = require("./routers/health");
const subHealth = require("./middleware/subhealth");
const pubHealth = require("./middleware/pubhealth");
const { numberConnect } = require("./middleware/healthCheck");
const loadBalance = require("./middleware/loadbalance");

// const test = require("./routers/test");

const app = express();

app.use(cors()); //chia se tai nguyen
// app.use(express.static("client"));
app.use(cookieParser());
app.use(fileUpload());
app.use((req, res, next) => {
  loadBalance(req, res, next);
});

pubHealth();
subHealth();

app.use("/gets3", gets3);
app.use("/apis", health);
app.get("/", (req, res) => {
  res.json({
    message: "Server 2 :)",
  });
});

const port = process.env.PORT || 2000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
