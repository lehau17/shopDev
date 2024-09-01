### session 6: API key
- Mục đích : kiểm tra xe client có đang sử dụng phiên bản API của mình hay không
- check API Key xem nó có tồn tại không
- nếu chó check quyền xem nó có quyền truy cập không


### set redis (Không có thứ thứ tự)
```
SADD
SPOP 
sismember
israndmember 
smembers
scard
srem=
```
 * Kịch bản sử dụng : quản lý like trong twitter


### Zset redis (Bộ sưu tập có thứ tự)
```
zadd
zrevrange withscores
zrange
zrem
zcard 
zrangebyscore
zscore 

```
  * kịch bản sử dụng: bản xếp hạng thành tích


### transaction trong redis
 - Khái niệm: là tập hợp của của các lệnh 1 là thành công, 2 là null. hỗ trợ làm nhiều lệnh cùng lúc, và các lệnh tròng transaction dược tuần tự hóa
 - các trans không đảm bảo tinh nguyên tử, nêu 1 lệnh k thực hiện, các lệnh khác vẫn oke
 ``` watch : giám sát 1 key, nếu 1 key được watch 

 khi 1 lệnh bị lỗi, thì khi gọi exec sẽ không chay 

### pub/sub
  - pub/sub có phải là hệ thống message queue không? không. Không đúng theo nghĩa truyền thống, vì nó có thể sử dụng message parrtern, nhưng nó không có các tính năng thường có của 1 meessage queue. redis thì theo mô hình gọi là tới, trong đó các mes được public tới các kênh, nhnugw nó không đảm bảo kh có nhận hay không, nó không có hàng đợi và tin nhắn

  - đảm bảo lưu trữ, sắp xếp, thông báo bên kia có nhận được tin nhắn hay không
  - cơ chế của resis. 
  lênh của redis
  ```
  
  ```



### kiến trúc notify
 - Khắc phục tốc độ khi noti quá lớn : index, phân trang, sharding, cache, bất đồng bộ, 
 - câu hỏi ? 

 - push : là dữ liêu thông báo tách biệt cả 2 , hạn chế : trễ, nếu số lượng user lớn thì sẽ rất nặng server
 - pull: đăng nhập thì tự lấy, chủ nhận thông báo khi người dùng muốn, hạn chế: dữ liệu và user lưu chung cái schema, thêm 1 cái req lhi người dùng đănh nhập

 - data structer