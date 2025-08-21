# API Authentication Guide

## Quy trình xác thực mới

### 1. Đăng ký tài khoản (Register)
**POST** `/api/v1/auth/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+84123456789",
  "role": "candidate", // "candidate" hoặc "recruiter"
  
  // Chỉ với role "recruiter"
  "company_name": "Tech Company",
  "industry": "Technology"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": {
    "user_id": "user_id_here",
    "email": "john@example.com",
    "message": "Mã OTP đã được gửi đến email của bạn"
  }
}
```

### 2. Xác thực OTP (Verify OTP)
**POST** `/api/v1/auth/verify-otp`

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xác thực thành công! Tài khoản đã được kích hoạt.",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "candidate",
    "full_name": "John Doe",
    "is_verified": true,
    "is_active": true
  }
}
```

### 3. Đăng nhập (Login)
**POST** `/api/v1/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "candidate",
    "full_name": "John Doe",
    "is_verified": true,
    "is_active": true
  }
}
```

**Response khi tài khoản chưa kích hoạt:**
```json
{
  "success": false,
  "message": "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": {
    "email": "john@example.com",
    "need_verification": true
  }
}
```

### 4. Quên mật khẩu (Forgot Password)
**POST** `/api/v1/auth/forgot-password`

```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mã OTP đã được gửi đến email của bạn",
  "data": {
    "email": "john@example.com"
  }
}
```

### 5. Đặt lại mật khẩu (Reset Password)
**POST** `/api/v1/auth/reset-password`

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công"
}
```

### 6. Gửi lại OTP (Resend OTP)
**POST** `/api/v1/auth/resend-otp`

```json
{
  "email": "john@example.com",
  "type": "email_verification" // hoặc "password_reset"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mã OTP mới đã được gửi đến email của bạn",
  "data": {
    "email": "john@example.com"
  }
}
```

### 7. Lấy thông tin người dùng hiện tại (Get Me)
**GET** `/api/v1/auth/me`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "candidate",
      "full_name": "John Doe",
      "is_verified": true,
      "is_active": true
    },
    "profile": {
      // Profile data theo role
    }
  }
}
```

## Lưu ý quan trọng

1. **OTP có hiệu lực 15 phút**
2. **Tối đa 5 lần thử OTP sai**
3. **Tài khoản mặc định `is_active = false` khi đăng ký**
4. **Phải xác thực OTP để `is_active = true`**
5. **Chỉ tài khoản `is_active = true` mới đăng nhập được**
6. **JWT token được lưu trong cookie và response**

## Cấu hình Email

Cần cấu hình các biến môi trường sau trong file `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Để sử dụng Gmail, bạn cần:
1. Bật 2FA cho tài khoản Gmail
2. Tạo App Password cho ứng dụng
3. Sử dụng App Password thay vì mật khẩu thường

## Error Codes

- **400**: Bad Request (thiếu thông tin, định dạng sai)
- **401**: Unauthorized (chưa đăng nhập, token sai)
- **404**: Not Found (không tìm thấy user)
- **429**: Too Many Requests (quá nhiều lần thử OTP)
- **500**: Internal Server Error
