const mongoose = require('mongoose');

const candidateExperienceSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  company_name: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Please add position'],
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  start_date: {
    type: Date,
    required: [true, 'Please add start date']
  },
  end_date: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.start_date;
      },
      message: 'End date must be after start date'
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  is_current: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for candidate experiences
candidateExperienceSchema.index({ candidate_id: 1, start_date: -1 });

module.exports = mongoose.model('CandidateExperience', candidateExperienceSchema);
