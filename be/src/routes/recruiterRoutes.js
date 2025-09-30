const express = require('express');
const {
  getRecruiters,
  getRecruiter,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiterJobs,
  getRecruiterApplications,
  getRecruiterInterviews,
  getRecruiterDashboard,
  getRecruiterNotifications,
  getRecruiterSubscriptions,
  getCurrentSubscription,
  upgradeSubscription,
  cancelSubscription,
  getRecruiterAnalytics
} = require('../controllers/recruiterController');

 
const { protect, authorize } = require('../middleware/auth');
const { checkCandidateSearchPermission, checkCVDownloadPermission } = require('../middleware/subscription');
const { searchCandidates, getCandidateProfile, downloadCandidateCV } = require('../controllers/candidateSearchController.js');
   
const router = express.Router();

// Recruiter-specific routes (for own data only) - must come before parameterized routes
router.get('/profile', protect, authorize('recruiter'), getRecruiterProfile);
router.put('/profile', protect, authorize('recruiter'), updateRecruiterProfile);
router.get('/jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.get('/applications', protect, authorize('recruiter'), getRecruiterApplications);
router.get('/interviews', protect, authorize('recruiter'), getRecruiterInterviews);
router.get('/dashboard', protect, authorize('recruiter'), getRecruiterDashboard);
router.get('/notifications', protect, authorize('recruiter'), getRecruiterNotifications);
router.get('/subscriptions', protect, authorize('recruiter'), getRecruiterSubscriptions);
router.get('/subscription/current', protect, authorize('recruiter'), getCurrentSubscription);
router.put('/subscription/upgrade', protect, authorize('recruiter'), upgradeSubscription);
router.put('/subscription/cancel', protect, authorize('recruiter'), cancelSubscription);
router.get('/analytics', protect, authorize('recruiter'), getRecruiterAnalytics);

// Candidate search routes (Premium features)
router.get('/candidates/search', protect, authorize('recruiter'), checkCandidateSearchPermission, searchCandidates);
router.get('/candidates/:id', protect, authorize('recruiter'), checkCandidateSearchPermission, getCandidateProfile);
router.get('/candidates/:id/cv', protect, authorize('recruiter'), checkCVDownloadPermission, downloadCandidateCV);

// General routes
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
