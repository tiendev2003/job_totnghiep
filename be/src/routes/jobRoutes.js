const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(optionalAuth, getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

router
  .route('/:id')
  .get(optionalAuth, getJob)
  .put(protect, authorize('recruiter', 'admin'), updateJob)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
