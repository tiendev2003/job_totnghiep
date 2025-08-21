const mongoose = require('mongoose');

const jobCategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, 'Please add category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  parent_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory',
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  sort_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Virtual for subcategories
jobCategorySchema.virtual('subcategories', {
  ref: 'JobCategory',
  localField: '_id',
  foreignField: 'parent_category_id'
});

// Virtual for jobs count
jobCategorySchema.virtual('jobs_count', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'categories',
  count: true
});

// Ensure virtual fields are serialized
jobCategorySchema.set('toJSON', { virtuals: true });
jobCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('JobCategory', jobCategorySchema);
