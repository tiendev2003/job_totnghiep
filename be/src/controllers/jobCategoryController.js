const JobCategory = require('../models/JobCategory');

// @desc    Get all job categories
// @route   GET /api/v1/job-categories
// @access  Public
exports.getJobCategories = async (req, res, next) => {
  try {
    const categories = await JobCategory.find({ is_active: true })
      .populate('subcategories')
      .sort('sort_order');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job category
// @route   GET /api/v1/job-categories/:id
// @access  Public
exports.getJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findById(req.params.id)
      .populate('subcategories jobs_count');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job category
// @route   POST /api/v1/job-categories
// @access  Private/Admin
exports.createJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job category
// @route   PUT /api/v1/job-categories/:id
// @access  Private/Admin
exports.updateJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job category
// @route   DELETE /api/v1/job-categories/:id
// @access  Private/Admin
exports.deleteJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    // Check if category has subcategories
    const subcategories = await JobCategory.find({ parent_category_id: category._id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }
    
    await category.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
