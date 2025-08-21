const Recruiter = require('../models/Recruiter');

// @desc    Get all recruiters
// @route   GET /api/v1/recruiters
// @access  Private/Admin
exports.getRecruiters = async (req, res, next) => {
  try {
    const recruiters = await Recruiter.find()
      .populate('jobs subscriptions')
      .sort('-created_at');
    
    res.status(200).json({
      success: true,
      count: recruiters.length,
      data: recruiters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recruiter
// @route   GET /api/v1/recruiters/:id
// @access  Public
exports.getRecruiter = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .populate('jobs');
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create recruiter
// @route   POST /api/v1/recruiters
// @access  Private
exports.createRecruiter = async (req, res, next) => {
  try {
    // Add user ID from authenticated user
    req.body.user_id = req.user.id;
    
    const recruiter = await Recruiter.create(req.body);
    
    res.status(201).json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter
// @route   PUT /api/v1/recruiters/:id
// @access  Private
exports.updateRecruiter = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findById(req.params.id);
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    // Make sure user is recruiter owner
    if (recruiter.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this recruiter'
      });
    }
    
    recruiter = await Recruiter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recruiter
// @route   DELETE /api/v1/recruiters/:id
// @access  Private
exports.deleteRecruiter = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    // Make sure user is recruiter owner
    if (recruiter.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this recruiter'
      });
    }
    
    await recruiter.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
