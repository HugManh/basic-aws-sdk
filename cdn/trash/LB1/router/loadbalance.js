const { default: axios } = require("axios");
const check_server = require("./check");

let current = 0;
let min = 1;
let a = 0;
let b = 0;
const loadBalance = async (req, res) => {
  // request
  const { method, url, headers, body } = req;
  //   console.log({ method: method, url: url, headers: headers, body: body });

  /**
   * healthcheck all server -> server healthy
   * return: [
   *  {server1, ....},
   *  {server2, .... }
   * ]
   */
  const servers = await check_server();

  // load balance
  // ROUND ROBIN
  // const end_p = await RoundRobin(servers);
  // LEAST CONNECTION
  const end_p = await LeastConnection(servers);
  console.log(`http://${end_p}${url}`);
  // console.log("🎉");

  // res.json(`http://${end_p}${url}`);

  //   response
  try {
    const response = await axios({
      url: `http://${end_p}${url}`,
      method: method,
      headers: headers,
      data: body,
    });
    // Send back the response data
    res.send(response.data);
  } catch (err) {
    // Send back the error message
    res.status(500).send({ status: "Server error!", Message: err.message });
  }
};

/**
 * ROUND ROBIN
 * Gửi request theo thứ tự
 * drawback: 1 server có thứ tự cao được đẩy nhiều request quá => server đó ngưng hoạt động.
 */
const RoundRobin = async (_servers) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("🎐");

      // infor servers healthy
      let endpoint = [];
      for (const infor of _servers) {
        endpoint.push(infor.endpoint);
      }

      // console.log(endpoint);
      // console.log(current);
      current === endpoint.length - 1 ? (current = 0) : current++;

      const server = endpoint[current];
      resolve(server);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * LEAST CONNECTION
 * gửi yêu cầu đến server có số lượng kết nối hoạt động ít nhất,
 * sử dụng Round Robin khi các server có số kết nối hoạt động ít nhất bằng nhau
 * khi 1 server thêm vào các kết nối sẽ đẩy hết vào,
 */
const LeastConnection = async (_servers) => {
  /**
   * infor servers healthy
   * get the number connect to server
   * get server has the lowest number of connect
   */

  return new Promise((resolve, reject) => {
    try {
      // console.log(_servers);
      let endpoint;

      for (const server of _servers) {
        // console.log(server);
        if (server.countConn < min) {
          endpoint = server.endpoint;
        }
      }
      // console.log(a, b);
      resolve(endpoint);
    } catch (error) {
      reject(error);
    }
  });
};

const LeastTime = async () => {
  /**
   * infor servers healthy
   *
   */
};

module.exports = loadBalance;
