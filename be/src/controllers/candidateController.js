const Candidate = require('../models/Candidate');

// @desc    Get all candidates
// @route   GET /api/v1/candidates
// @access  Private
exports.getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find()
      .populate('experiences educations')
      .sort('-created_at');
    
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single candidate
// @route   GET /api/v1/candidates/:id
// @access  Private
exports.getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('experiences educations applications');
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create candidate
// @route   POST /api/v1/candidates
// @access  Private
exports.createCandidate = async (req, res, next) => {
  try {
    // Add user ID from authenticated user
    req.body.user_id = req.user.id;
    
    const candidate = await Candidate.create(req.body);
    
    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate
// @route   PUT /api/v1/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res, next) => {
  try {
    let candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Make sure user is candidate owner
    if (candidate.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this candidate'
      });
    }
    
    candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete candidate
// @route   DELETE /api/v1/candidates/:id
// @access  Private
exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Make sure user is candidate owner
    if (candidate.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this candidate'
      });
    }
    
    await candidate.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
