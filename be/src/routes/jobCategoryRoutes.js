const express = require('express');
const {
  getJobCategories,
  getJobCategory,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory
} = require('../controllers/jobCategoryController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getJobCategories)
  .post(protect, authorize('admin'), createJobCategory);

router
  .route('/:id')
  .get(getJobCategory)
  .put(protect, authorize('admin'), updateJobCategory)
  .delete(protect, authorize('admin'), deleteJobCategory);

module.exports = router;
