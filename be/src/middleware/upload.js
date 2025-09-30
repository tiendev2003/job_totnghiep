const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
// Ensure upload directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create subdirectories based on upload purpose
    let subDir = 'general';
    if (req.body.upload_purpose) {
      subDir = req.body.upload_purpose;
    } else {
      // Determine file type based on mimetype if no purpose specified
      if (file.mimetype.startsWith('image/')) {
        subDir = 'images';
      } else if (file.mimetype === 'application/pdf') {
        subDir = 'documents';
      } else if (file.mimetype.includes('word') || file.mimetype.includes('document')) {
        subDir = 'documents';
      }
    }

    const fullPath = path.join(uploadDir, subDir);
    
    // Create subdirectory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    
    // Create safe base name from original filename
    const baseName = path.basename(file.originalname, fileExtension);
    const safeBaseName = slugify(baseName, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g 
    }) || 'file'; // fallback if slugify returns empty
    
    const fileName = `${safeBaseName}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    
    // Spreadsheets
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // Presentations
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    
    // Text files
    'text/csv',
    'application/json'
  ];

  // Check file extension as additional validation
  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.txt',
    '.xls', '.xlsx', '.csv',
    '.ppt', '.pptx',
    '.zip', '.rar', '.7z',
    '.json'
  ];

  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    const error = new Error(`Loại file không được hỗ trợ: ${file.mimetype}. Chỉ cho phép: hình ảnh (JPG, PNG, GIF, WebP, SVG), tài liệu (PDF, DOC, DOCX, TXT), bảng tính (XLS, XLSX, CSV), thuyết trình (PPT, PPTX), và file nén (ZIP, RAR, 7Z).`);
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Single file upload
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa là 10MB.',
        message_en: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file. Chỉ cho phép upload 1 file.',
        message_en: 'Too many files. Only 1 file allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Tên field không đúng. Vui lòng sử dụng "file" làm tên field.',
        message_en: 'Unexpected field name. Use "file" as field name.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: 'Loại file không được hỗ trợ. Chỉ cho phép upload hình ảnh, tài liệu và file nén.',
      message_en: error.message
    });
  }

  if (error.message.includes('Invalid filename')) {
    return res.status(400).json({
      success: false,
      message: 'Tên file không hợp lệ. Vui lòng kiểm tra lại tên file.',
      message_en: error.message
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  handleMulterError
};
