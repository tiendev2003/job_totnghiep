const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const RecruiterSubscription = require('../models/RecruiterSubscription');
const { getPaginationParams, buildPaginationResponse, applyPagination, getSearchParams, getDateRangeFilter } = require('../utils/pagination');
const { getSubscriptionStatus } = require('../middleware/subscription');

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

// @desc    Get recruiter profile (own profile)
// @route   GET /api/recruiters/profile
// @access  Private/Recruiter
exports.getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate('user_id', 'username email full_name phone avatar_url is_verified is_active')
      .populate('jobs')
      .populate('subscriptions');
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
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

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private/Recruiter
exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    recruiter = await Recruiter.findByIdAndUpdate(recruiter._id, req.body, {
      new: true,
      runValidators: true
    }).populate('user_id', 'username email full_name phone avatar_url is_verified is_active');
    
    res.status(200).json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/recruiters/jobs
// @access  Private/Recruiter
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);
    const { status, is_active } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const query = { 
      recruiter_id: recruiter._id,
      ...searchFilters 
    };
    
    if (status) query.status = status;
    if (is_active !== undefined) query.is_active = is_active === 'true';
    
    const jobsQuery = Job.find(query)
      .populate('category_id', 'name')
      .populate({
        path: 'applications',
        select: 'candidate_id application_status created_at',
        populate: {
          path: 'candidate_id',
          select: 'full_name email'
        }
      });
    
    const jobs = await applyPagination(jobsQuery, page, limit, skip);
    const total = await Job.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(jobs, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's applications
// @route   GET /api/recruiters/applications
// @access  Private/Recruiter
exports.getRecruiterApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Get all jobs by this recruiter
    const jobs = await Job.find({ recruiter_id: recruiter._id }).select('_id');
    const jobIds = jobs.map(job => job._id);
    
    const query = { job_id: { $in: jobIds } };
    if (status) query.application_status = status;
    
    const applicationsQuery = Application.find(query)
      .populate('job_id', 'title')
      .populate('candidate_id', 'full_name email phone')
      .populate({
        path: 'candidate_id',
        populate: {
          path: 'user_id',
          select: 'avatar_url'
        }
      })
      .sort('-created_at');
    
    const applications = await applyPagination(applicationsQuery, page, limit, skip);
    const total = await Application.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(applications, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's interviews
// @route   GET /api/recruiters/interviews
// @access  Private/Recruiter
exports.getRecruiterInterviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const dateFilters = getDateRangeFilter(req);
    const { status } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const query = { 
      recruiter_id: recruiter._id,
      ...dateFilters 
    };
    
    if (status) query.interview_status = status;
    
    const interviewsQuery = Interview.find(query)
      .populate('application_id')
      .populate('candidate_id', 'full_name email phone')
      .populate('job_id', 'title')
      .sort('interview_date');
    
    const interviews = await applyPagination(interviewsQuery, page, limit, skip);
    const total = await Interview.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(interviews, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter dashboard statistics
// @route   GET /api/recruiters/dashboard
// @access  Private/Recruiter
exports.getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Get basic stats
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalInterviews,
      upcomingInterviews
    ] = await Promise.all([
      Job.countDocuments({ recruiter_id: recruiter._id }),
      Job.countDocuments({ recruiter_id: recruiter._id, is_active: true, status: 'approved' }),
      Application.countDocuments({ 
        job_id: { $in: await Job.find({ recruiter_id: recruiter._id }).select('_id') }
      }),
      Application.countDocuments({ 
        job_id: { $in: await Job.find({ recruiter_id: recruiter._id }).select('_id') },
        application_status: 'pending'
      }),
      Interview.countDocuments({ recruiter_id: recruiter._id }),
      Interview.countDocuments({ 
        recruiter_id: recruiter._id,
        interview_date: { $gte: new Date() },
        interview_status: 'scheduled'
      })
    ]);
    
    // Get recent applications
    const jobIds = await Job.find({ recruiter_id: recruiter._id }).select('_id');
    const recentApplications = await Application.find({ 
      job_id: { $in: jobIds }
    })
    .populate('job_id', 'title')
    .populate('candidate_id', 'full_name email')
    .sort('-created_at')
    .limit(5);
    
    // Get subscription status
    const subscriptionStatus = await getSubscriptionStatus(recruiter._id);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          totalInterviews,
          upcomingInterviews
        },
        recentApplications,
        subscription: subscriptionStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's notifications
// @route   GET /api/recruiters/notifications
// @access  Private/Recruiter
exports.getRecruiterNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { is_read } = req.query;
    
    const query = { user_id: req.user.id };
    if (is_read !== undefined) query.is_read = is_read === 'true';
    
    const notificationsQuery = Notification.find(query)
      .sort('-created_at');
    
    const notifications = await applyPagination(notificationsQuery, page, limit, skip);
    const total = await Notification.countDocuments(query);
    
    // Mark as read if requested
    if (req.query.mark_as_read === 'true') {
      await Notification.updateMany(
        { user_id: req.user.id, is_read: false },
        { is_read: true, read_at: new Date() }
      );
    }
    
    res.status(200).json(buildPaginationResponse(notifications, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's subscription history
// @route   GET /api/recruiters/subscriptions
// @access  Private/Recruiter
exports.getRecruiterSubscriptions = async (req, res, next) => {
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
    }).sort('-created_at');
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter analytics
// @route   GET /api/recruiters/analytics
// @access  Private/Recruiter
exports.getRecruiterAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const jobIds = await Job.find({ recruiter_id: recruiter._id }).select('_id');
    
    // Applications over time
    const applicationTrend = await Application.aggregate([
      {
        $match: {
          job_id: { $in: jobIds },
          created_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    
    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $match: { job_id: { $in: jobIds } }
      },
      {
        $group: {
          _id: '$application_status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top performing jobs
    const topJobs = await Job.aggregate([
      {
        $match: { recruiter_id: recruiter._id }
      },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job_id',
          as: 'applications'
        }
      },
      {
        $project: {
          title: 1,
          applicationCount: { $size: '$applications' },
          views_count: 1
        }
      },
      {
        $sort: { applicationCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        period: `${period} days`,
        applicationTrend,
        applicationsByStatus,
        topJobs
      }
    });
  } catch (error) {
    next(error);
  }
};
