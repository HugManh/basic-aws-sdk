# s3-aws
Use S3 Storage in project by aws-sdk
- Nodejs
- Amazon S3 - Cloud Object Storage

redis
redis-cli flushall
https://phoenixnap.com/kb/clear-redis-cache
https://redis.com/blog/redis-on-windows-10/

app.use(fileUpload());
win + .
Task:

- Create server
- Lưu data vào cache(memcached(<=MB), redis())

- down object save cache (use node-cache)

- return url: put image from url to s3

-header (setHeader & writeHead)

- File config params
- Check metadata => save redis
- Lenght >50MB stream no cache
- <50 save cache
- Write file on local save infor data

- check headers (redis)
  -> get data
  -> <50?(check cache(cache:setCache?getCache)):(file?(writeFile):(readFile))
  -> res data

- tach check metadata
- get Metadata on redis -> data?get redis: get server
- file large -> range
- res range -> client

- save cache theo range
  check key -> req.params in array -> res range file
  -> set [
  range,
  range,
  range,
  ]

- ARMY%20OF%20THIEVES != ARMY OF THIEVES (encode)

* callback -> async/await

- streaming-cache slow

(create model
model headers,metadata)

return value metadata (not callback)

docker pull memcached
docker run -d --name <CONTAINER_NAME> -p 127.0.0.1:6379:6379 redis

healthcheck thông tin server lưu vào redis[
healthcheckInfo: {
service: "cdn",
core: 16,
totalmem: 16824,
iplan: "1.1.1.1",
ipwan: "2.2.2.2",
cdnType: "cdn",
endpoint: "cdn-c4.sohatv.vn",
deviceIps: "1.1.1.1,2.2.2.2",
interfaceId: "eth1",
interfacebandwidth: -1,
loadaverage: 0.02,
freemem: 8156,
bandwidth: 0
}
1s get 1 lần
]

docker volume rm $(docker volume ls -q)

- tao 1 con server center

- pub sub redis -> gửi data cho nhau

Center viết 1 api để trả toàn bộ thông tin health check các bên gửi lên

Trả theo array tất cả health check từng con gửi lên

<!-- loadbalance -> healthcheck -> loadbalance -> server

loadbalancing
thực hiện health check tất cả server (cả healthy và unhealthy), chỉ gửi request lên server healthy, nếu unhealthy nó sẽ dừng gửi request
cho đến khi server healthy trở lại. -->

<!-- check server healthy || unhealthy
-> Healthy -> (
loadbalance:
1.Round Robin: lựa chọn tuần tự các server
2.Weighted Round Robin: lựa chọn server dựa trên giá trị trọng số Weight – mặc định giá trị là 1.
3.Dynamic Round Robin (DRR): trọng số dựa trên sự kiểm tra server một cách liên tục
4.Least Connections: chọn máy chủ các kết nối ít nhất - thuật toán động, vì nó phải đếm số kết nối đang hoạt động của server.
5.IP Hash: Với các thuật toán mã nguồn, load balancer sẽ chọn máy chủ để sử dụng dựa trên một hash của IP nguồn của yêu cầu,
chẳng hạn như địa chỉ IP của người truy cập. Đảm bảo rằng một người dùng cụ thể sẽ luôn kết nối với cùng một máy chủ
6.Fastest - The Least Response Time Method: thời gian đáp ứng - thường được dùng khi các server ở các vị trí địa lý
) -> server -->

loadbalancing
phân phối request đến các server cùng chịu tải
lấy thông tin health check tất cả server (cả healthy và unhealthy), chỉ gửi request lên server healthy, nếu unhealthy nó sẽ dừng gửi request
cho đến khi server healthy trở lại

loadbalance -> [center, ser1, ser2,ser3,ser4....] center quản lý các server

set expire redis

load balancer
get healthcheck on redis, dont get to center

HAProxy
Nginx

PORT Redis:

- server :
  1 - 6739
  2 - 6781
- center : 6780

nginx_upstream_check_module
https://github.com/desbouis/nginx-redis-proxy

domain tong -> lb -> server
domain -> server

tạo 1 con load balance

lấy healthcheck từ con redis server 1 : stop server 1 -> error
pm2 monit
