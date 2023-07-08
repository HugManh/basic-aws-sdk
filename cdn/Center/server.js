const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const health_Check = require("./router/healthCheck");
const subHealth = require("./middleware/subhealth");
const pubHealth = require("./middleware/pubhealth");

const app = express();

subHealth();
pubHealth();
app.use(cors()); //chia se tai nguyen
app.use(cookieParser());

app.use("/apis", health_Check);
app.get("/", (req, res) => {
  res.json({
    message: "Center :)",
  });
});
const port = process.env.PORT || 2909;
const server = http.createServer(app);

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
