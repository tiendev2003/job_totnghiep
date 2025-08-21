const mongoose = require('mongoose');

const aiCandidateRecommendationSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
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
      enum: ['skills_match', 'experience_match', 'education_match', 'portfolio_quality', 'past_performance', 'availability'],
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
  is_contacted: {
    type: Boolean,
    default: false
  },
  viewed_at: {
    type: Date,
    default: null
  },
  contacted_at: {
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
aiCandidateRecommendationSchema.index({ recruiter_id: 1, candidate_id: 1, job_id: 1 }, { unique: true });

// Index for recommendation queries
aiCandidateRecommendationSchema.index({ recruiter_id: 1, score: -1 });
aiCandidateRecommendationSchema.index({ job_id: 1, score: -1 });

// Populate related data
aiCandidateRecommendationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'candidate_id',
    select: 'user_id skills experience_years',
    populate: {
      path: 'user_id',
      select: 'full_name email avatar_url'
    }
  }).populate({
    path: 'job_id',
    select: 'title requirements'
  }).populate({
    path: 'recruiter_id',
    select: 'company_name'
  });
  next();
});

module.exports = mongoose.model('AICandidateRecommendation', aiCandidateRecommendationSchema);
