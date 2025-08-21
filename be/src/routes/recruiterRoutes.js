const express = require('express');
const {
  getRecruiters,
  getRecruiter,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter
} = require('../controllers/recruiterController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getRecruiters)
  .post(protect, authorize('recruiter'), createRecruiter);

router
  .route('/:id')
  .get(getRecruiter)
  .put(protect, authorize('recruiter', 'admin'), updateRecruiter)
  .delete(protect, authorize('recruiter', 'admin'), deleteRecruiter);

module.exports = router;
