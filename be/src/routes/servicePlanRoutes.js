const express = require('express');
const ServicePlan = require('../models/ServicePlan');

const router = express.Router();

// @desc    Get all active service plans (public)
// @route   GET /api/service-plans
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const plans = await ServicePlan.find({ is_active: true })
      .sort({ sort_order: 1, price: 1 })
      .select('-created_at -updated_at');
    
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single service plan (public)
// @route   GET /api/service-plans/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const plan = await ServicePlan.findOne({ 
      _id: req.params.id, 
      is_active: true 
    }).select('-created_at -updated_at');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
