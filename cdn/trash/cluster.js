const express = require("express");
const http = require("http");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cluster = require("cluster");
const { cpus } = require("os");
const process = require("process");

const numCPUs = cpus().length;

/* Routers */
const gets3 = require("../servers/server1/routers/getS3");
const health = require("../servers/server1/routers/health");
const subHealth = require("../servers/server1/middleware/subhealth");
const pubHealth = require("../servers/server1/middleware/pubhealth");

// const test = require("./routers/test");

const app = express();

app.use(cors()); //chia se tai nguyen
// app.use(express.static("client"));
app.use(cookieParser());
app.use(fileUpload());
pubHealth();
subHealth();

app.use("/gets3", gets3);
app.use("/apis", health);
app.get("/", (req, res) => {
  res.json({
    message: "Server 1 :)",
  });
});

const port = process.env.PORT || 8000;
const server = http.createServer(app);

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  server.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });

  console.log(`Worker ${process.pid} started`);
}
