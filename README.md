
# Hệ thống Việc Làm IT

## Giới thiệu
Hệ thống Việc Làm IT là nền tảng kết nối giữa ứng viên, nhà tuyển dụng, hệ thống AI, quản trị viên và khách truy cập. Hệ thống hỗ trợ các chức năng tìm việc, quản lý tuyển dụng, gợi ý thông minh từ AI, và quản trị hệ thống.

## Sơ đồ Use Case
Sơ đồ use case chi tiết các chức năng và mối quan hệ giữa các đối tượng trong hệ thống được trình bày trong file `image.png`.

## Chức năng chính

### Ứng viên (Candidate)
- **Quản lý tài khoản:** Đăng ký, đăng nhập, xác minh thông tin, quên mật khẩu
- **Quản lý hồ sơ:** Tạo/cập nhật thông tin cá nhân, kinh nghiệm làm việc, học vấn, kỹ năng
- **Quản lý CV:** Đính kèm, cập nhật CV
- **Ứng tuyển:** Nộp đơn ứng tuyển, theo dõi trạng thái ứng tuyển
- **Tìm kiếm việc làm:** Tìm kiếm theo từ khóa, danh mục, địa điểm
- **Phỏng vấn:** Nhận lời mời phỏng vấn, sắp lịch phỏng vấn, xem lịch phỏng vấn
- **Nhận phản hồi:** Xem đánh giá sau phỏng vấn
- **AI hỗ trợ:** Nhận gợi ý công việc phù hợp từ AI
- **Thông báo:** Nhận thông báo về trạng thái ứng tuyển, lịch phỏng vấn
- **Tin nhắn:** Trao đổi với nhà tuyển dụng

### Nhà tuyển dụng (Recruiter)
- **Quản lý tài khoản:** Đăng ký, đăng nhập, xác minh thông tin doanh nghiệp
- **Quản lý tin tuyển dụng:** Tạo, sửa, xóa, tìm kiếm tin tuyển dụng
- **Gói dịch vụ:** Đăng ký gói Premium, quản lý subscription
- **Quản lý ứng viên:** Xem hồ sơ ứng viên, duyệt đơn ứng tuyển
- **Phỏng vấn:** Tạo lịch phỏng vấn, gửi lời mời, quản lý lịch phỏng vấn
- **Đánh giá ứng viên:** Tạo phản hồi sau phỏng vấn
- **AI hỗ trợ:** Nhận gợi ý ứng viên phù hợp từ AI
- **Thanh toán:** Quản lý thanh toán cho các gói dịch vụ
- **Thông báo:** Nhận thông báo về đơn ứng tuyển mới
- **Tin nhắn:** Trao đổi với ứng viên
- **Báo cáo:** Xem thống kê tuyển dụng

### Hệ thống AI
- **Gợi ý công việc:** Phân tích hồ sơ ứng viên và đề xuất công việc phù hợp
- **Gợi ý ứng viên:** Phân tích yêu cầu công việc và đề xuất ứng viên phù hợp
- **Học tùy chọn người dùng:** Lưu trữ và phân tích preferences của người dùng
- **Phản hồi AI:** Cung cấp feedback thông minh cho quá trình tuyển dụng

### Quản trị viên (Admin)
- **Quản lý người dùng:** Duyệt, khóa/mở khóa tài khoản ứng viên và nhà tuyển dụng
- **Quản lý tin tuyển dụng:** Duyệt, ẩn/hiện tin tuyển dụng
- **Quản lý danh mục công việc:** Thêm, sửa, xóa danh mục việc làm
- **Xử lý báo cáo:** Xem và xử lý báo cáo vi phạm từ người dùng
- **Thống kê hệ thống:** Xem báo cáo tổng quan về hoạt động hệ thống
- **Quản lý thanh toán:** Theo dõi các giao dịch thanh toán
- **Quản lý template email:** Tạo và chỉnh sửa mẫu email tự động
- **Quản lý thông báo:** Gửi thông báo hệ thống

### Khách truy cập (Visitor)
- **Xem tin tuyển dụng:** Duyệt các tin tuyển dụng công khai
- **Tìm kiếm công việc:** Tìm kiếm việc làm theo từ khóa
- **Xem thông tin doanh nghiệp:** Xem profile các công ty tuyển dụng

## Công nghệ sử dụng
- **Frontend:** ReactJS, React Redux, React Router, Vite, TailwindCSS
- **Backend:** NodeJS (Express), RESTful API
- **AI:** Python (Machine Learning, gợi ý công việc/ứng viên)
- **Database:** MongoDB
- **Authentication:** JWT Token
- **File Upload:** Multer
- **Email Service:** NodeMailer
- **Payment:**  Momo

## Cấu trúc thư mục

```text
job_totnghiep/
├── fe/                    # ReactJS Frontend
│   ├── src/
│   │   ├── components/    # Các component UI
│   │   ├── pages/         # Các trang chính (admin, auth, candidate, recruiter, jobs)
│   │   ├── services/      # API calls
│   │   ├── store/         # Redux store và slices
│   │   ├── router/        # React Router config
│   │   └── utils/         # Utility functions
│   └── public/
├── be/                    # NodeJS Backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Authentication, error handling
│   │   ├── config/        # Database config
│   │   └── utils/         # Email, OTP services
│   └── public/uploads/    # File uploads
├── ai/                    # Python AI/ML (chưa implement)
├── image.png             # Sơ đồ use case
└── README.md
```

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone <repo_url>
cd job_totnghiep
```

### 2. Cài đặt dependencies

#### Frontend
```bash
cd fe
npm install
```

#### Backend
```bash
cd be
npm install
```

#### AI (sẽ được phát triển)
```bash
cd ai
pip install -r requirements.txt
```

### 3. Cấu hình environment
- Tạo file `.env` trong thư mục `be/` với các biến:
  ```env
  NODE_ENV=development
  PORT=5000
  DB_CONNECTION_STRING=mongodb://localhost:27017/job_platform
  JWT_SECRET=your_jwt_secret
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASSWORD=your_email_password
  ```

- Tạo file `.env` trong thư mục `fe/` nếu cần:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 4. Khởi tạo database
```bash
cd be
npm run seed  # Nếu có seed script
```

### 5. Chạy ứng dụng

#### Chạy Backend (Port 5000)
```bash
cd be
npm start
# hoặc npm run dev (development mode)
```

#### Chạy Frontend (Port 3000/5173)
```bash
cd fe
npm run dev
```

### 6. Truy cập ứng dụng
- Frontend: http://localhost:5173 (Vite) hoặc http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (nếu có Swagger)

## API Endpoints chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/verify-email` - Xác minh email
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Jobs
- `GET /api/jobs` - Danh sách việc làm
- `POST /api/jobs` - Tạo tin tuyển dụng (Recruiter)
- `GET /api/jobs/:id` - Chi tiết việc làm

### Applications
- `POST /api/applications` - Nộp đơn ứng tuyển
- `GET /api/applications` - Danh sách đơn ứng tuyển

### Candidates & Recruiters
- `GET /api/candidates/profile` - Hồ sơ ứng viên
- `PUT /api/recruiters/profile` - Cập nhật hồ sơ nhà tuyển dụng

### Admin
- `GET /api/admin/users` - Quản lý người dùng
- `POST /api/admin/job-categories` - Quản lý danh mục công việc

## Tính năng nổi bật

### 🤖 AI Integration
- Gợi ý công việc thông minh cho ứng viên
- Gợi ý ứng viên phù hợp cho nhà tuyển dụng
- Phân tích tương thích dựa trên skills và kinh nghiệm

### 💼 Quản lý toàn diện
- Dashboard riêng cho từng loại người dùng
- Hệ thống thông báo real-time
- Quản lý lịch phỏng vấn tích hợp

### 💰 Monetization
- Gói Premium cho nhà tuyển dụng
- Tích hợp payment gateway
- Subscription management

### 📊 Analytics & Reporting
- Thống kê chi tiết cho admin
- Báo cáo hiệu suất tuyển dụng
- Tracking user activity

## Roadmap phát triển

### Phase 1 ✅ (Hoàn thành)
- [x] Authentication system
- [x] Basic job posting & application
- [x] User profiles
- [x] Admin panel

### Phase 2 🔄 (Đang phát triển)
- [ ] AI recommendation system
- [ ] Real-time messaging
- [ ] Interview scheduling
- [ ] Payment integration

### Phase 3 📋 (Sắp tới)
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Video interview integration
- [ ] Company verification system

## Contributing

### Commit Convention
- `feat:` Tính năng mới
- `fix:` Sửa lỗi
- `docs:` Cập nhật documentation
- `refactor:` Refactor code
- `test:` Thêm test
- `chore:` Maintenance

### Pull Request
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License
MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Contact
- Email: contact@jobplatform.com
- Documentation: [Link to detailed docs]
- Bug Reports: [GitHub Issues]

---
*Dự án này được phát triển như một hệ thống việc làm IT toàn diện với tích hợp AI thông minh.*
