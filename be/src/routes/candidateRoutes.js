const express = require('express');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes below require authentication

router
  .route('/')
  .get(authorize('recruiter', 'admin'), getCandidates)
  .post(authorize('candidate'), createCandidate);

router
  .route('/:id')
  .get(getCandidate)
  .put(authorize('candidate', 'admin'), updateCandidate)
  .delete(authorize('candidate', 'admin'), deleteCandidate);

module.exports = router;
