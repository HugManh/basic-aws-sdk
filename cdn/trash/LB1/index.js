const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const loadBalance = require("./router/loadbalance");

require("dotenv").config();

const app = express();

app.use(cors()); //chia se tai nguyen
app.use(cookieParser());
app.use((req, res) => {
  loadBalance(req, res);
});

const port = process.env.PORT || 9000;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});

// setInterval(() => {
//   server.getConnections(function (error, count) {
//     console.log("The number connect: ", count);
//   });
// }, 1000);
