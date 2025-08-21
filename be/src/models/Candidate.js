const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  date_of_birth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: null
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City cannot be more than 50 characters']
  },
  education_level: {
    type: String,
    enum: ['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other'],
    default: null
  },
  experience_years: {
    type: Number,
    min: [0, 'Experience years cannot be negative'],
    max: [50, 'Experience years cannot be more than 50']
  },
  skills: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  cv_url: {
    type: String,
    default: null
  },
  linkedin_url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v);
      },
      message: 'Please provide a valid LinkedIn URL'
    }
  },
  github_url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?github\.com\//.test(v);
      },
      message: 'Please provide a valid GitHub URL'
    }
  },
  portfolio_url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\//.test(v);
      },
      message: 'Please provide a valid portfolio URL'
    }
  },
  salary_expectation: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      enum: ['VND', 'USD', 'EUR'],
      default: 'VND'
    }
  },
  job_status: {
    type: String,
    enum: ['seeking', 'employed', 'not_seeking'],
    default: 'seeking'
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Populate user data when querying candidate
candidateSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user_id',
    select: 'username email full_name phone avatar_url is_verified is_active'
  });
  next();
});

// Virtual for full candidate profile
candidateSchema.virtual('experiences', {
  ref: 'CandidateExperience',
  localField: '_id',
  foreignField: 'candidate_id'
});

candidateSchema.virtual('educations', {
  ref: 'CandidateEducation',
  localField: '_id',
  foreignField: 'candidate_id'
});

candidateSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'candidate_id'
});

// Ensure virtual fields are serialized
candidateSchema.set('toJSON', { virtuals: true });
candidateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Candidate', candidateSchema);
