const mongoose = require('mongoose');

const candidateSkillSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  skill_name: {
    type: String,
    required: [true, 'Please add skill name'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  skill_level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Please specify skill level']
  },
  years_of_experience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot be more than 50'],
    default: 0
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound index to prevent duplicate skills for same candidate
candidateSkillSchema.index({ candidate_id: 1, skill_name: 1 }, { unique: true });

module.exports = mongoose.model('CandidateSkill', candidateSkillSchema);
