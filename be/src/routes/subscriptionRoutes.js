const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const RecruiterSubscription = require('../models/RecruiterSubscription');
const ServicePlan = require('../models/ServicePlan');
const Recruiter = require('../models/Recruiter');

const router = express.Router();

router.use(protect); // All routes below require authentication

// @desc    Get recruiter's subscriptions
// @route   GET /api/subscriptions
// @access  Private/Recruiter
router.get('/', authorize('recruiter'), async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    const subscriptions = await RecruiterSubscription.find({ 
      recruiter_id: recruiter._id 
    }).sort({ created_at: -1 });
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current active subscription
// @route   GET /api/subscriptions/current
// @access  Private/Recruiter
router.get('/current', authorize('recruiter'), async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    const currentSubscription = await RecruiterSubscription.findOne({ 
      recruiter_id: recruiter._id,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    }).sort({ end_date: -1 });
    
    res.status(200).json({
      success: true,
      data: currentSubscription
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private/Recruiter
router.post('/', authorize('recruiter'), async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    const { plan_id } = req.body;
    
    // Get service plan details
    const servicePlan = await ServicePlan.findById(plan_id);
    
    if (!servicePlan || !servicePlan.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found or inactive'
      });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + servicePlan.duration_days * 24 * 60 * 60 * 1000);

    const subscriptionData = {
      recruiter_id: recruiter._id,
      plan_type: servicePlan.plan_type,
      start_date: startDate,
      end_date: endDate,
      price: servicePlan.price,
      features: servicePlan.features,
      payment_status: 'pending'
    };

    const subscription = await RecruiterSubscription.create(subscriptionData);
    
    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update subscription payment status (for payment gateway callback)
// @route   PUT /api/subscriptions/:id/payment
// @access  Private/Recruiter
router.put('/:id/payment', authorize('recruiter'), async (req, res, next) => {
  try {
    const { payment_status, transaction_id } = req.body;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    const subscription = await RecruiterSubscription.findOne({
      _id: req.params.id,
      recruiter_id: recruiter._id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.payment_status = payment_status;
    if (transaction_id) subscription.transaction_id = transaction_id;
    
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
