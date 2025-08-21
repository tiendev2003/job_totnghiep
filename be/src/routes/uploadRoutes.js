const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes below require authentication

// Upload file endpoint
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'File upload endpoint',
    data: {
      url: '/uploads/sample-file.pdf',
      filename: 'sample-file.pdf'
    }
  });
});

// Get uploaded files
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User uploaded files',
    data: []
  });
});

module.exports = router;
