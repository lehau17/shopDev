PV :
1. tại sao sử dụng message Queue ?
2. ưu điểm và nhược điểm của message Queue ?
3. Nếu các anh chị biết nhiều về ms queue thì đưa ra từng tình huống ?
*** kafka , RabbitMQ , active, rocket
Trả lời
1. 
- Tách ra thành 1 service riêng để hạn chế  tải cho 1 service
- Xử lý không đồng bộ 
- Nếu có quá nhiều request mỗi giây, cùng 1 lúc đẩy vào database thì sẽ sập server
- nên là sử dụng message queue để hạn chế request đến mức tối thiểu server có thể xử lý tại cùng lúc
- tuy nhiên nếu có nhiều yêu cầu tồn động xử lý như nào ?  cứ cho nó tồn động, hết thời gian cao điểm sẽ trở lại bình thường thôi
- Nhược điểm : 
    + Hệ thống càng lớn thì càng phụ thuộc party bên ngoài
    + Tăng độ phức tạp của hệ thống
    + Miss tin nhắn
    + Tính nhất quán của hệ thống

2 chức nawhg chính của rabbitMQ là cơ chê ngang hàng và Publish, subscribe,
- chế độ ngang hàng: 1  
VD : 1 ti nhắn có thể sử dụng 1 khách hàng, 1 tin nhắn cũng có thể sử dụng nhiều khách hàng
nhiều producter có thể gửi thư vào hàng đợi

- Mô hình pub/sub : 1 tn có thể có nhiều ng đk nhận tn đó (xử lý đồng thời), có 2 loại đăng kts là đăng ký tamh thời và đăng ký lâu dài
- producer kết nối với máy chủ và mở 1 kênh kết nối và tạo 1 (channel) 
- client muốn nhận thông báo thì phải kết nối với server và đồng ý tạo kênh
- nếu không có exchange thì sẽ đi thanwrn vào queue
- exchange là bộ định tuyến, phân message vào các quêu

tham số khi tạo queue:
durable: false : khi server chếtor rabbitMQ crash, thì dữ liệu trong hàng đợi mất
noAck: false : chưa xử lý, chưa nhận được
persistent : true tin nhắn này xử lý liên tục đc lưu vào ổ đĩa hay cache, nếu cache có vấn đề thì lấy ổ đĩa ra chạy
tại sao là Buffer: 
Buffer là gì : là 1 vận chuyển dữ liệu bằng byte, mà byte hay bit thì tốc độ vận chyển data nhanh hơn các kiểu object bình thường
- Ly do sử dụng Buffer : tốc độ nhanh trong không gian mạng. Mã hõa thông điệp thành byte và buffer hỗ trợ

- xử lý message bị lỗi
+ cang thiệp bằng thủ công
+ xây dựng hệ thống tự xử lý
- làm cách nào để xử lý các message bị lỗi 1 cách tự động
   + Dead Letter Exchange : thư hỏng, không được gửi
   + Lý do khiến mes thành rác : notify bị chết như amazon trả về, .. 2. Hết hạn, 3. Hàng đợi đạt limit, thư đến sau thành thư chết