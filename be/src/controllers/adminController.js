const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Report = require('../models/Report');
const Payment = require('../models/Payment');
const EmailTemplate = require('../models/EmailTemplate');
const Notification = require('../models/Notification');
const JobCategory = require('../models/JobCategory');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const UserActivity = require('../models/UserActivity');
const ServicePlan = require('../models/ServicePlan');
const RecruiterSubscription = require('../models/RecruiterSubscription');
const { generateSystemReport, sendBulkEmails, cleanupOldData, backupCollections } = require('../utils/adminUtils');
const { getPaginationParams, buildPaginationResponse, applyPagination, getSearchParams, getDateRangeFilter } = require('../utils/pagination');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Payment.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments({ status: 'pending' })
    ]);

    const [
      totalUsers,
      totalJobs,
      totalApplications,
      pendingReports,
      totalPayments,
      totalCandidates,
      totalRecruiters,
      activeJobs,
      pendingApplications
    ] = stats;

    // Get recent activities
    const recentActivities = await UserActivity.find()
      .populate('user_id', 'email role')
      .sort('-created_at')
      .limit(10);

    // Get monthly stats for charts
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    const monthlyStats = await Promise.all([
      User.countDocuments({ created_at: { $gte: lastMonth } }),
      Job.countDocuments({ created_at: { $gte: lastMonth } }),
      Application.countDocuments({ created_at: { $gte: lastMonth } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalJobs,
          totalApplications,
          pendingReports,
          totalPayments,
          totalCandidates,
          totalRecruiters,
          activeJobs,
          pendingApplications
        },
        monthly: {
          newUsers: monthlyStats[0],
          newJobs: monthlyStats[1],
          newApplications: monthlyStats[2]
        },
        recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);
    const { role, status } = req.query;
    
    const query = { ...searchFilters };

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by status
    if (status) {
      query.is_active = status === 'active';
    }

    const usersQuery = User.find(query)
      .select('-password')
      .populate('candidate_profile')
      .populate('recruiter_profile');

    const users = await applyPagination(usersQuery, page, limit, skip);
    const totalUsers = await User.countDocuments(query);

    res.status(200).json(buildPaginationResponse(users, totalUsers, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Generate system reports
// @route   GET /api/admin/reports/system/:type
// @access  Private/Admin
exports.generateReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { period = 30 } = req.query;

    const reportData = await generateSystemReport(type, parseInt(period));

    res.status(200).json({
      success: true,
      data: {
        type,
        period: `${period} days`,
        generated_at: new Date(),
        ...reportData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send bulk emails
// @route   POST /api/admin/emails/bulk
// @access  Private/Admin
exports.sendBulkEmails = async (req, res, next) => {
  try {
    const { template_name, target_role, custom_recipients, variables } = req.body;

    let recipients = [];

    if (custom_recipients && custom_recipients.length > 0) {
      recipients = custom_recipients;
    } else if (target_role) {
      const users = await User.find({ role: target_role, is_active: true })
        .select('email full_name');
      recipients = users;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please specify either target_role or custom_recipients'
      });
    }

    const result = await sendBulkEmails(template_name, recipients, variables);

    res.status(200).json({
      success: true,
      message: 'Bulk email sending completed',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clean up old data
// @route   POST /api/admin/maintenance/cleanup
// @access  Private/Admin
exports.cleanupSystem = async (req, res, next) => {
  try {
    const { days_to_keep = 365 } = req.body;

    const result = await cleanupOldData(parseInt(days_to_keep));

    res.status(200).json({
      success: true,
      message: 'System cleanup completed',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Backup system data
// @route   POST /api/admin/maintenance/backup
// @access  Private/Admin
exports.backupSystem = async (req, res, next) => {
  try {
    const { collections } = req.body;

    const result = await backupCollections(collections);

    res.status(200).json({
      success: true,
      message: 'System backup completed',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activities
// @route   GET /api/admin/activities
// @access  Private/Admin
exports.getUserActivities = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const dateFilters = getDateRangeFilter(req);
    const { user_id, activity_type } = req.query;
    
    const query = { ...dateFilters };
    if (user_id) query.user_id = user_id;
    if (activity_type) query.activity_type = activity_type;

    const activitiesQuery = UserActivity.find(query)
      .populate('user_id', 'email full_name role');

    const activities = await applyPagination(activitiesQuery, page, limit, skip);
    const totalActivities = await UserActivity.countDocuments(query);

    res.status(200).json(buildPaginationResponse(activities, totalActivities, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get system health check
// @route   GET /api/admin/health
// @access  Private/Admin
exports.getSystemHealth = async (req, res, next) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      database: 'connected',
      services: {},
      metrics: {}
    };

    // Check database connectivity
    try {
      await User.findOne().limit(1);
      health.database = 'connected';
    } catch (error) {
      health.database = 'disconnected';
      health.status = 'unhealthy';
    }

    // Get basic metrics
    health.metrics = {
      totalUsers: await User.countDocuments(),
      totalJobs: await Job.countDocuments(),
      totalApplications: await Application.countDocuments(),
      pendingReports: await Report.countDocuments({ status: 'pending' }),
      activeUsers: await User.countDocuments({ is_active: true }),
      activeJobs: await Job.countDocuments({ status: 'approved', is_active: true })
    };

    // Check for any critical issues
    const criticalIssues = [];
    
    if (health.metrics.pendingReports > 50) {
      criticalIssues.push('High number of pending reports');
    }

    if (health.metrics.activeJobs === 0) {
      criticalIssues.push('No active jobs in system');
    }

    if (criticalIssues.length > 0) {
      health.status = 'warning';
      health.issues = criticalIssues;
    }

    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject user account
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // status: 'approved', 'rejected', 'suspended'
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user status
    user.is_active = status === 'approved';
    user.account_status = status;
    user.status_reason = reason || '';
    user.status_updated_by = req.user.id;
    user.status_updated_at = new Date();

    await user.save();

    // Log activity
    await UserActivity.create({
      user_id: req.user.id,
      activity_type: 'admin_action',
      description: `${status} user account: ${user.email}`,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Send notification to user
    await Notification.create({
      user_id: user._id,
      title: `Account ${status}`,
      message: reason ? `Your account has been ${status}. Reason: ${reason}` : `Your account has been ${status}.`,
      type: 'account_status',
      created_by: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `User account ${status} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin management
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);
    const { status } = req.query;
    
    const query = { ...searchFilters };

    // Filter by status
    if (status) {
      query.status = status;
    }

    const jobsQuery = Job.find(query)
      .populate('recruiter_id', 'company_name email')
      .populate('category_id', 'name');

    const jobs = await applyPagination(jobsQuery, page, limit, skip);
    const totalJobs = await Job.countDocuments(query);

    res.status(200).json(buildPaginationResponse(jobs, totalJobs, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject job posting
// @route   PUT /api/admin/jobs/:id/status
// @access  Private/Admin
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // status: 'approved', 'rejected', 'suspended'
    
    const job = await Job.findById(req.params.id).populate('recruiter_id');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.status = status;
    job.admin_notes = reason || '';
    job.reviewed_by = req.user.id;
    job.reviewed_at = new Date();

    await job.save();

    // Send notification to recruiter
    await Notification.create({
      user_id: job.recruiter_id.user_id,
      title: `Job Posting ${status}`,
      message: `Your job posting "${job.title}" has been ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'job_status',
      created_by: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `Job ${status} successfully`,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports for admin
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, priority } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const reportsQuery = Report.find(query)
      .populate('reporter_id', 'email first_name last_name')
      .populate('reported_user_id', 'email first_name last_name')
      .populate('resolved_by', 'email first_name last_name');

    const reports = await applyPagination(reportsQuery, page, limit, skip);
    const totalReports = await Report.countDocuments(query);

    res.status(200).json(buildPaginationResponse(reports, totalReports, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private/Admin
exports.resolveReport = async (req, res, next) => {
  try {
    const { resolution_action, admin_notes } = req.body;
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = 'resolved';
    report.resolution_action = resolution_action;
    report.admin_notes = admin_notes;
    report.resolved_by = req.user.id;
    report.resolved_at = new Date();

    await report.save();

    // If action is to suspend user, update user status
    if (resolution_action === 'suspend_user' && report.reported_user_id) {
      await User.findByIdAndUpdate(report.reported_user_id, {
        is_active: false,
        account_status: 'suspended',
        status_reason: `Suspended due to report: ${report.report_type}`,
        status_updated_by: req.user.id,
        status_updated_at: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report resolved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status, payment_method } = req.query;
    
    const query = {};
    if (status) query.payment_status = status;
    if (payment_method) query.payment_method = payment_method;

    const paymentsQuery = Payment.find(query)
      .populate('user_id', 'email first_name last_name')
      .populate('subscription_id');

    const payments = await applyPagination(paymentsQuery, page, limit, skip);
    const totalPayments = await Payment.countDocuments(query);

    // Calculate total revenue
    const revenueStats = await Payment.aggregate([
      { $match: { payment_status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const response = buildPaginationResponse(payments, totalPayments, page, limit);
    response.revenue = revenueStats[0] || { totalRevenue: 0, count: 0 };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all email templates
// @route   GET /api/admin/email-templates
// @access  Private/Admin
exports.getEmailTemplates = async (req, res, next) => {
  try {
    const { template_type, is_active } = req.query;
    const query = {};

    if (template_type) query.template_type = template_type;
    if (is_active !== undefined) query.is_active = is_active === 'true';

    const templates = await EmailTemplate.find(query)
      .populate('created_by', 'email first_name last_name')
      .populate('last_modified_by', 'email first_name last_name')
      .sort('-updated_at');

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create email template
// @route   POST /api/admin/email-templates
// @access  Private/Admin
exports.createEmailTemplate = async (req, res, next) => {
  try {
    req.body.created_by = req.user.id;
    req.body.last_modified_by = req.user.id;

    const template = await EmailTemplate.create(req.body);

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update email template
// @route   PUT /api/admin/email-templates/:id
// @access  Private/Admin
exports.updateEmailTemplate = async (req, res, next) => {
  try {
    req.body.last_modified_by = req.user.id;

    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete email template
// @route   DELETE /api/admin/email-templates/:id
// @access  Private/Admin
exports.deleteEmailTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send system notification to all users or specific role
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type, target_role } = req.body;
    
    // Get target users
    const query = target_role ? { role: target_role } : {};
    const users = await User.find(query).select('_id');

    // Create notifications for all target users
    const notifications = users.map(user => ({
      user_id: user._id,
      title,
      message,
      type: type || 'system',
      created_by: req.user.id
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: {
        title,
        message,
        target_count: users.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // User registrations over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          created_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    // Job postings over time
    const jobPostings = await Job.aggregate([
      {
        $match: {
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

    // Applications over time
    const applications = await Application.aggregate([
      {
        $match: {
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

    // Top job categories
    const topCategories = await Job.aggregate([
      {
        $group: {
          _id: "$category_id",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobcategories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          name: "$category.name",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userRegistrations,
        jobPostings,
        applications,
        topCategories,
        period: `${period} days`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export users data
// @route   GET /api/admin/export/users
// @access  Private/Admin
exports.exportUsers = async (req, res, next) => {
  try {
    const { role, format = 'json' } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-password')
      .populate('candidate_profile')
      .populate('recruiter_profile')
      .lean();

    if (format === 'csv') {
      // Convert to CSV format
      const csv = users.map(user => ({
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        is_active: user.is_active,
        created_at: user.created_at,
        last_login: user.last_login
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      
      // Simple CSV conversion (in production, use a proper CSV library)
      const csvContent = [
        Object.keys(csv[0]).join(','),
        ...csv.map(row => Object.values(row).join(','))
      ].join('\n');

      res.send(csvContent);
    } else {
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all service plans
// @route   GET /api/admin/service-plans
// @access  Private/Admin
exports.getServicePlans = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { is_active, plan_type } = req.query;
    
    const query = {};
    if (is_active !== undefined) query.is_active = is_active === 'true';
    if (plan_type) query.plan_type = plan_type;

    const totalPlans = await ServicePlan.countDocuments(query);
    const plans = await ServicePlan.find(query)
      .sort({ sort_order: 1, created_at: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(page, limit, totalPlans);

    res.status(200).json({
      success: true,
      count: plans.length,
      pagination,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service plan
// @route   POST /api/admin/service-plans
// @access  Private/Admin
exports.createServicePlan = async (req, res, next) => {
  try {
    const plan = await ServicePlan.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Service plan created successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service plan
// @route   PUT /api/admin/service-plans/:id
// @access  Private/Admin
exports.updateServicePlan = async (req, res, next) => {
  try {
    const plan = await ServicePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service plan updated successfully',
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service plan
// @route   DELETE /api/admin/service-plans/:id
// @access  Private/Admin
exports.deleteServicePlan = async (req, res, next) => {
  try {
    const plan = await ServicePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found'
      });
    }

    // Check if plan is being used by any active subscriptions
    const activeSubscriptions = await RecruiterSubscription.countDocuments({
      plan_type: plan.plan_type,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    });

    if (activeSubscriptions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan. ${activeSubscriptions} active subscriptions are using this plan.`
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle service plan status
// @route   PUT /api/admin/service-plans/:id/toggle-status
// @access  Private/Admin
exports.toggleServicePlanStatus = async (req, res, next) => {
  try {
    const plan = await ServicePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Service plan not found'
      });
    }

    plan.is_active = !plan.is_active;
    await plan.save();

    res.status(200).json({
      success: true,
      message: `Service plan ${plan.is_active ? 'activated' : 'deactivated'} successfully`,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
exports.getSubscriptions = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { payment_status, plan_type, search } = req.query;
    
    const query = {};
    if (payment_status) query.payment_status = payment_status;
    if (plan_type) query.plan_type = plan_type;

    // Search by recruiter company name or email
    if (search) {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
        ]
      }).select('_id');
      
      const recruiters = await Recruiter.find({
        $or: [
          { company_name: { $regex: search, $options: 'i' } },
          { user_id: { $in: users.map(u => u._id) } }
        ]
      }).select('_id');

      if (recruiters.length > 0) {
        query.recruiter_id = { $in: recruiters.map(r => r._id) };
      } else {
        query.recruiter_id = null; // No results
      }
    }

    const totalSubscriptions = await RecruiterSubscription.countDocuments(query);
    const subscriptions = await RecruiterSubscription.find(query)
      .populate({
        path: 'recruiter_id',
        populate: {
          path: 'user_id',
          select: 'email phone'
        }
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(page, limit, totalSubscriptions);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      pagination,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscription status
// @route   PUT /api/admin/subscriptions/:id/status
// @access  Private/Admin
exports.updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { payment_status, admin_notes } = req.body;
    
    const subscription = await RecruiterSubscription.findById(req.params.id)
      .populate('recruiter_id');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.payment_status = payment_status;
    if (admin_notes) subscription.admin_notes = admin_notes;
    
    await subscription.save();

    // Send notification to recruiter
    await Notification.create({
      user_id: subscription.recruiter_id.user_id,
      title: `Subscription ${payment_status}`,
      message: `Your ${subscription.plan_type} subscription status has been updated to ${payment_status}.`,
      type: 'subscription_status',
      created_by: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Subscription status updated successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription statistics
// @route   GET /api/admin/subscriptions/stats
// @access  Private/Admin
exports.getSubscriptionStats = async (req, res, next) => {
  try {
    const stats = await Promise.all([
      RecruiterSubscription.countDocuments(),
      RecruiterSubscription.countDocuments({ payment_status: 'paid' }),
      RecruiterSubscription.countDocuments({ payment_status: 'pending' }),
      RecruiterSubscription.countDocuments({ payment_status: 'failed' }),
      RecruiterSubscription.countDocuments({ 
        payment_status: 'paid',
        end_date: { $gt: new Date() }
      }),
      RecruiterSubscription.countDocuments({ 
        payment_status: 'paid',
        end_date: { $lt: new Date() }
      })
    ]);

    const [
      totalSubscriptions,
      paidSubscriptions,
      pendingSubscriptions,
      failedSubscriptions,
      activeSubscriptions,
      expiredSubscriptions
    ] = stats;

    // Get revenue statistics
    const revenueStats = await RecruiterSubscription.aggregate([
      {
        $match: { payment_status: 'paid' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);

    // Get subscriptions by plan type
    const planTypeStats = await RecruiterSubscription.aggregate([
      {
        $group: {
          _id: '$plan_type',
          count: { $sum: 1 },
          revenue: { 
            $sum: { 
              $cond: [{ $eq: ['$payment_status', 'paid'] }, '$price', 0] 
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalSubscriptions,
          paidSubscriptions,
          pendingSubscriptions,
          failedSubscriptions,
          activeSubscriptions,
          expiredSubscriptions
        },
        revenue: revenueStats[0] || { totalRevenue: 0, averagePrice: 0 },
        planTypes: planTypeStats
      }
    });
  } catch (error) {
    next(error);
  }
};
