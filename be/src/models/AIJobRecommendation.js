const mongoose = require('mongoose');

const aiJobRecommendationSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [1, 'Score cannot exceed 1'],
    required: [true, 'Please provide recommendation score']
  },
  algorithm_version: {
    type: String,
    required: [true, 'Please specify algorithm version'],
    default: 'v1.0'
  },
  reasons: [{
    factor: {
      type: String,
      enum: ['skills_match', 'experience_match', 'location_match', 'salary_match', 'education_match', 'industry_match'],
      required: true
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      max: [1, 'Weight cannot exceed 1'],
      required: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters']
    }
  }],
  is_viewed: {
    type: Boolean,
    default: false
  },
  is_applied: {
    type: Boolean,
    default: false
  },
  viewed_at: {
    type: Date,
    default: null
  },
  applied_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound index to prevent duplicate recommendations
aiJobRecommendationSchema.index({ candidate_id: 1, job_id: 1 }, { unique: true });

// Index for recommendation queries
aiJobRecommendationSchema.index({ candidate_id: 1, score: -1 });
aiJobRecommendationSchema.index({ created_at: -1 });

// Populate job and candidate data
aiJobRecommendationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'job_id',
    select: 'title company_name location job_type salary_min salary_max'
  }).populate({
    path: 'candidate_id',
    select: 'user_id skills experience_years',
    populate: {
      path: 'user_id',
      select: 'full_name email'
    }
  });
  next();
});

module.exports = mongoose.model('AIJobRecommendation', aiJobRecommendationSchema);
