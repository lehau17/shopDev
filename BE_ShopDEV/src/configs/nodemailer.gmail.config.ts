import nodemailer from 'nodemailer'

// Tạo transporter với cấu hình SMTP của Google
const transporter = nodemailer.createTransport({
  service: 'gmail', // Sử dụng dịch vụ Gmail
  auth: {
    user: 'hau17131203@gmail.com', // Thay bằng email Gmail của bạn
    pass: 'quup slyz pzwp ifog' // Thay bằng mật khẩu ứng dụng bạn đã tạo
  }
})

export default transporter
