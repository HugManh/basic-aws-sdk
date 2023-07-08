const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");

// Application servers
const servers = ["http://localhost:3001", "http://localhost:3002"];

// Track the current application server to send request
let current = 0;

// Receive new request
// Forward to application server
const handler = async (req, res) => {
  const { method, url, headers, body } = req;
  console.log({ method: method, url: url, headers: headers, body: body });

  // Select the current server to forward the request
  const server = servers[current];
  console.log(server);

  // Update track to select next server
  current === servers.length - 1 ? (current = 0) : current++;

  try {
    // Requesting to underlying application server
    const response = await axios({
      url: `${server}${url}`,
      method: method,
      headers: headers,
      data: body,
    });
    // Send back the response data
    // from application server to client
    res.send(response.data);
  } catch (err) {
    // Send back the error message
    res.status(500).send("Server error!");
  }
};

// Serve favicon.ico image
app.get("/favicon.ico", (req, res) =>
  res.send("C:/Project/s3/trash/favicon.ico")
);

// When receive new request
// Pass it to handler method
app.use((req, res) => {
  handler(req, res);
});

// Listen on PORT 8080
app.listen(8080, (err) => {
  err
    ? console.log("Failed to listen on PORT 8080")
    : console.log("Load Balancer Server " + "listening on PORT 8080");
});
