const Application = require('../models/Application');

// @desc    Get all applications
// @route   GET /api/v1/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
  try {
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'candidate') {
      const candidate = await require('../models/Candidate').findOne({ user_id: req.user.id });
      if (candidate) {
        query.candidate_id = candidate._id;
      }
    } else if (req.user.role === 'recruiter') {
      const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
      if (recruiter) {
        const jobs = await require('../models/Job').find({ recruiter_id: recruiter._id }).select('_id');
        query.job_id = { $in: jobs.map(job => job._id) };
      }
    }
    
    const applications = await Application.find(query).sort('-applied_at');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/v1/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('status_history interviews');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create application
// @route   POST /api/v1/applications
// @access  Private/Candidate
exports.createApplication = async (req, res, next) => {
  try {
    // Get candidate
    const candidate = await require('../models/Candidate').findOne({ user_id: req.user.id });
    
    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: 'User is not a candidate'
      });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job_id: req.body.job_id,
      candidate_id: candidate._id
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    req.body.candidate_id = candidate._id;
    
    const application = await Application.create(req.body);
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/v1/applications/:id/status
// @access  Private/Recruiter
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Create status history record
    const oldStatus = application.application_status;
    const newStatus = req.body.application_status;
    
    if (oldStatus !== newStatus) {
      await require('../models/ApplicationStatusHistory').create({
        application_id: application._id,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by: req.user.id,
        change_reason: req.body.change_reason
      });
    }
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id, 
      {
        application_status: newStatus,
        reviewed_at: new Date(),
        interviewer_notes: req.body.interviewer_notes,
        rejection_reason: req.body.rejection_reason
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
// @access  Private/Candidate
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Get candidate
    const candidate = await require('../models/Candidate').findOne({ user_id: req.user.id });
    
    // Make sure user is application owner
    if (application.candidate_id.toString() !== candidate._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }
    
    await application.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
