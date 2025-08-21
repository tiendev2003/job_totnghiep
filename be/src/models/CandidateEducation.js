const mongoose = require('mongoose');

const candidateEducationSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  school_name: {
    type: String,
    required: [true, 'Please add school name'],
    trim: true,
    maxlength: [150, 'School name cannot be more than 150 characters']
  },
  degree: {
    type: String,
    required: [true, 'Please add degree'],
    trim: true,
    maxlength: [100, 'Degree cannot be more than 100 characters']
  },
  major: {
    type: String,
    required: [true, 'Please add major'],
    trim: true,
    maxlength: [100, 'Major cannot be more than 100 characters']
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
  gpa: {
    type: Number,
    min: [0, 'GPA cannot be negative'],
    max: [4.0, 'GPA cannot be more than 4.0']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for candidate educations
candidateEducationSchema.index({ candidate_id: 1, end_date: -1 });

module.exports = mongoose.model('CandidateEducation', candidateEducationSchema);
