const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company_name: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  company_description: {
    type: String,
    maxlength: [2000, 'Company description cannot be more than 2000 characters']
  },
  company_size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: null
  },
  industry: {
    type: String,
    required: [true, 'Please add industry'],
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\//.test(v);
      },
      message: 'Please provide a valid website URL'
    }
  },
  tax_id: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  company_address: {
    type: String,
    trim: true,
    maxlength: [200, 'Company address cannot be more than 200 characters']
  },
  company_logo_url: {
    type: String,
    default: null
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  subscription_plan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  plan_expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Populate user data when querying recruiter
recruiterSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user_id',
    select: 'username email full_name phone avatar_url is_verified is_active'
  });
  next();
});

// Virtual for jobs posted
recruiterSchema.virtual('jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'recruiter_id'
});

// Virtual for subscriptions
recruiterSchema.virtual('subscriptions', {
  ref: 'RecruiterSubscription',
  localField: '_id',
  foreignField: 'recruiter_id'
});

// Ensure virtual fields are serialized
recruiterSchema.set('toJSON', { virtuals: true });
recruiterSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Recruiter', recruiterSchema);
