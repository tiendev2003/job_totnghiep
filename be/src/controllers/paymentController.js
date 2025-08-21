const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
  try {
    let query = {};
    
    // Filter by recruiter if not admin
    if (req.user.role === 'recruiter') {
      const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
      if (recruiter) {
        query.recruiter_id = recruiter._id;
      }
    }
    
    // Filter by status if provided
    if (req.query.payment_status) {
      query.payment_status = req.query.payment_status;
    }
    
    const payments = await Payment.find(query).sort('-created_at');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin') {
      const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
      if (!recruiter || payment.recruiter_id.toString() !== recruiter._id.toString()) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this payment'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment
// @route   POST /api/v1/payments
// @access  Private/Recruiter
exports.createPayment = async (req, res, next) => {
  try {
    // Get recruiter
    const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter'
      });
    }
    
    req.body.recruiter_id = recruiter._id;
    req.body.transaction_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = await Payment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/v1/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { payment_status, gateway_response, failed_reason } = req.body;
    
    const updateData = {
      payment_status
    };
    
    if (payment_status === 'completed') {
      updateData.processed_at = new Date();
    }
    
    if (payment_status === 'failed' && failed_reason) {
      updateData.failed_reason = failed_reason;
    }
    
    if (gateway_response) {
      updateData.gateway_response = gateway_response;
    }
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   PUT /api/v1/payments/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res, next) => {
  try {
    const { refund_amount } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.payment_status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }
    
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        payment_status: 'refunded',
        refund_amount: refund_amount || payment.amount,
        refunded_at: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: updatedPayment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment
// @route   DELETE /api/v1/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    await payment.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
