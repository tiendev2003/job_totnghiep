const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  processRefund,
  deletePayment
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes below require authentication

router
  .route('/')
  .get(getPayments)
  .post(authorize('recruiter'), createPayment);

router
  .route('/:id')
  .get(getPayment)
  .delete(authorize('admin'), deletePayment);

router.put('/:id/status', authorize('admin'), updatePaymentStatus);
router.put('/:id/refund', authorize('admin'), processRefund);

module.exports = router;
