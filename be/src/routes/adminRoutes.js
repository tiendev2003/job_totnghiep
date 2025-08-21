const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes below require authentication
router.use(authorize('admin')); // All routes require admin access

// Dashboard stats
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard stats',
    data: {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      pendingReports: 0
    }
  });
});

// System settings
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    message: 'System settings',
    data: {}
  });
});

module.exports = router;
