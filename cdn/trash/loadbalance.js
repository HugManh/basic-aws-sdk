const { default: axios } = require("axios");

const servers = [
  "http://localhost:8000",
  "http://localhost:3000",
  "http://localhost:2000",
];
let current = 0;

const loadBalance = async (req, res) => {
  // Destructure following properties from request object
  const { method, url, headers, body } = req;
  // console.log({ method: method, url: url, headers: headers, body: body });

  const server = servers[current];
  // console.log(server);

  current === servers.length - 1 ? (current = 0) : current++;
  // console.log(current);
  const url_server = `${server}${url}`;
  console.log(url_server);
  try {
    const response = await axios({
      url: url_server,
      method: method,
      headers: headers,
      data: body,
    });
    // Send back the response data
    res.send([response.data]);
  } catch (err) {
    // Send back the error message
    res.status(500).send({ status: "Server error!", Message: err.message });
  }
};
module.exports = loadBalance;
