const mongoose = require('mongoose');

const recruiterSubscriptionSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  plan_type: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: [true, 'Please specify plan type']
  },
  start_date: {
    type: Date,
    required: [true, 'Please add start date'],
    default: Date.now
  },
  end_date: {
    type: Date,
    required: [true, 'Please add end date']
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: [0, 'Price cannot be negative']
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  features: {
    job_posts_limit: {
      type: Number,
      default: 5
    },
    featured_jobs: {
      type: Number,
      default: 0
    },
    candidate_search: {
      type: Boolean,
      default: false
    },
    advanced_analytics: {
      type: Boolean,
      default: false
    },
    priority_support: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for subscription queries
recruiterSubscriptionSchema.index({ recruiter_id: 1, end_date: -1 });
recruiterSubscriptionSchema.index({ payment_status: 1 });

module.exports = mongoose.model('RecruiterSubscription', recruiterSubscriptionSchema);
