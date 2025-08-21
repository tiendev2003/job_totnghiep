const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    // Build query
    let query = Job.find({ is_active: true });
    
    // Filtering
    if (req.query.location) {
      query = query.find({ 'location.city': new RegExp(req.query.location, 'i') });
    }
    
    if (req.query.job_type) {
      query = query.find({ job_type: req.query.job_type });
    }
    
    if (req.query.work_location) {
      query = query.find({ work_location: req.query.work_location });
    }
    
    // Salary range
    if (req.query.salary_min) {
      query = query.find({ salary_min: { $gte: req.query.salary_min } });
    }
    
    if (req.query.salary_max) {
      query = query.find({ salary_max: { $lte: req.query.salary_max } });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit).sort('-created_at');
    
    const jobs = await query;
    const total = await Job.countDocuments({ is_active: true });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Increment view count
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views_count: 1 } });
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/v1/jobs
// @access  Private/Recruiter
exports.createJob = async (req, res, next) => {
  try {
    // Add recruiter ID from authenticated user
    const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter'
      });
    }
    
    req.body.recruiter_id = recruiter._id;
    
    const job = await Job.create(req.body);
    
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private/Recruiter
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Get recruiter
    const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
    
    // Make sure user is job owner
    if (job.recruiter_id.toString() !== recruiter._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }
    
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private/Recruiter
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Get recruiter
    const recruiter = await require('../models/Recruiter').findOne({ user_id: req.user.id });
    
    // Make sure user is job owner
    if (job.recruiter_id.toString() !== recruiter._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }
    
    await job.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
