require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes.js');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes.js');
const jobCategoryRoutes = require('./routes/jobCategoryRoutes');
const applicationRoutes = require('./routes/applicationRoutes.js');
const interviewRoutes = require('./routes/interviewRoutes');
const interviewFeedbackRoutes = require('./routes/interviewFeedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('public/uploads'));

// API Routes
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/users`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/candidates`, candidateRoutes);
app.use(`/api/${process.env.API_VERSION}/recruiters`, recruiterRoutes);
app.use(`/api/${process.env.API_VERSION}/jobs`, jobRoutes);
app.use(`/api/${process.env.API_VERSION}/job-categories`, jobCategoryRoutes);
app.use(`/api/${process.env.API_VERSION}/applications`, applicationRoutes);
app.use(`/api/${process.env.API_VERSION}/interviews`, interviewRoutes);
app.use(`/api/${process.env.API_VERSION}/interview-feedbacks`, interviewFeedbackRoutes);
app.use(`/api/${process.env.API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${process.env.API_VERSION}/messages`, messageRoutes);
app.use(`/api/${process.env.API_VERSION}/reports`, reportRoutes);
app.use(`/api/${process.env.API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${process.env.API_VERSION}/ai`, aiRoutes);
app.use(`/api/${process.env.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${process.env.API_VERSION}/upload`, uploadRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Job Portal API',
    version: process.env.API_VERSION,
    documentation: '/api/docs'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.get(/(.*)/, (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
