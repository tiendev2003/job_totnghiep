const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const UserVerification = require('../models/UserVerification');
const { sendOTPEmail } = require('../utils/emailService');
const { generateSecureOTP, isValidOTP, createExpiryTime } = require('../utils/otpService');
const { getClientIP } = require('../utils/adminUtils');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, full_name, phone } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username đã được sử dụng'
      });
    }
    
    // Tạo user với trạng thái is_active = false
    const user = await User.create({
      username,
      email,
      password,
      role,
      full_name,
      phone,
      is_active: false
    });
    
    // Tạo role-specific profile
    if (role === 'candidate') {
      await Candidate.create({
        user_id: user._id
      });
    } else if (role === 'recruiter') {
      await Recruiter.create({
        user_id: user._id,
        company_name: req.body.company_name || 'Not specified',
        industry: req.body.industry || 'Technology'
      });
    }

    // Tạo OTP và gửi email xác thực
    const otp = generateSecureOTP();
    console.log(`Generated OTP for ${email}: ${otp} -- ip : ${req.ip} -- user agent: ${req.get('User-Agent')}`);
    
    // Xóa các verification cũ chưa sử dụng
    await UserVerification.deleteMany({
      user_id: user._id,
      verification_type: 'email_verification',
      is_used: false
    });
 
    // Tạo verification record mới
    await UserVerification.create({
      user_id: user._id,
      verification_type: 'email_verification',
      verification_code: otp,
      expires_at: createExpiryTime(15),
      ip_address: getClientIP(req),
      user_agent: req.get('User-Agent')
    });

    // Gửi OTP qua email
    await sendOTPEmail(email, otp, 'verification');
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      data: {
        user_id: user._id,
        email: email,
        message: 'Mã OTP đã được gửi đến email của bạn'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for email verification
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mã OTP'
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ'
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra xem tài khoản đã được kích hoạt chưa
    if (user.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được kích hoạt'
      });
    }

    // Tìm verification record
    const verification = await UserVerification.findOne({
      user_id: user._id,
      verification_type: 'email_verification',
      verification_code: otp,
      is_used: false,
      expires_at: { $gt: new Date() }
    });

    if (!verification) {
      // Tăng số lần thử
      await UserVerification.updateOne(
        {
          user_id: user._id,
          verification_type: 'email_verification',
          is_used: false
        },
        { $inc: { attempts: 1 } }
      );

      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ hoặc đã hết hạn'
      });
    }

    // Kiểm tra số lần thử
    if (verification.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Đã vượt quá số lần thử cho phép. Vui lòng yêu cầu mã OTP mới.'
      });
    }

    // Cập nhật trạng thái verification
    verification.is_used = true;
    verification.used_at = new Date();
    await verification.save();

    // Kích hoạt tài khoản
    user.is_active = true;
    user.is_verified = true;
    await user.save();

    // Trả về token sau khi xác thực thành công
    sendTokenResponse(user, 200, res, 'Xác thực thành công! Tài khoản đã được kích hoạt.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mật khẩu'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Kiểm tra tài khoản đã được kích hoạt
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.',
        data: {
          email: user.email,
          need_verification: true
        }
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }
    
    sendTokenResponse(user, 200, res, 'Đăng nhập thành công');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email'
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng với email này'
      });
    }

    // Kiểm tra tài khoản có được kích hoạt không
    if (!user.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản chưa được kích hoạt'
      });
    }

    // Tạo OTP
    const otp = generateSecureOTP();
    
    // Xóa các verification cũ chưa sử dụng
    await UserVerification.deleteMany({
      user_id: user._id,
      verification_type: 'password_reset',
      is_used: false
    });

    // Tạo verification record mới
    await UserVerification.create({
      user_id: user._id,
      verification_type: 'password_reset',
      verification_code: otp,
      expires_at: createExpiryTime(15),
      ip_address: getClientIP(req),
      user_agent: req.get('User-Agent')
    });

    // Gửi OTP qua email
    await sendOTPEmail(email, otp, 'password_reset');
    
    res.status(200).json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
      data: {
        email: email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email, mã OTP và mật khẩu mới'
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Tìm verification record
    const verification = await UserVerification.findOne({
      user_id: user._id,
      verification_type: 'password_reset',
      verification_code: otp,
      is_used: false,
      expires_at: { $gt: new Date() }
    });

    if (!verification) {
      // Tăng số lần thử
      await UserVerification.updateOne(
        {
          user_id: user._id,
          verification_type: 'password_reset',
          is_used: false
        },
        { $inc: { attempts: 1 } }
      );

      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ hoặc đã hết hạn'
      });
    }

    // Kiểm tra số lần thử
    if (verification.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Đã vượt quá số lần thử cho phép. Vui lòng yêu cầu mã OTP mới.'
      });
    }

    // Cập nhật trạng thái verification
    verification.is_used = true;
    verification.used_at = new Date();
    await verification.save();

    // Cập nhật mật khẩu
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { email, type = 'email_verification' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email'
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra type
    if (!['email_verification', 'password_reset'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Loại xác thực không hợp lệ'
      });
    }

    // Với email_verification, chỉ gửi nếu tài khoản chưa active
    if (type === 'email_verification' && user.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được kích hoạt'
      });
    }

    // Với password_reset, chỉ gửi nếu tài khoản đã active
    if (type === 'password_reset' && !user.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản chưa được kích hoạt'
      });
    }

    // Tạo OTP mới
    const otp = generateSecureOTP();
    
    // Xóa các verification cũ chưa sử dụng
    await UserVerification.deleteMany({
      user_id: user._id,
      verification_type: type,
      is_used: false
    });

    // Tạo verification record mới
    await UserVerification.create({
      user_id: user._id,
      verification_type: type,
      verification_code: otp,
      expires_at: createExpiryTime(15),
      ip_address: getClientIP(req),
      user_agent: req.get('User-Agent')
    });

    // Gửi OTP qua email
    const emailType = type === 'email_verification' ? 'verification' : 'password_reset';
    await sendOTPEmail(email, otp, emailType);
    
    res.status(200).json({
      success: true,
      message: 'Mã OTP mới đã được gửi đến email của bạn',
      data: {
        email: email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    let profile = null;
    
    // Get role-specific profile
    if (user.role === 'candidate') {
      profile = await Candidate.findOne({ user_id: user._id });
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ user_id: user._id });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      full_name: req.body.full_name,
      phone: req.body.phone,
      email: req.body.email
    };
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }
    
    user.password = req.body.newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message = 'Thành công') => {
  // Create token
  const token = user.getSignedJwtToken();
  
  // Default to 7 days if JWT_COOKIE_EXPIRE is not set
  const cookieExpireDays = process.env.JWT_COOKIE_EXPIRE || 7;
  
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        is_verified: user.is_verified,
        is_active: user.is_active
      }
    });
};
