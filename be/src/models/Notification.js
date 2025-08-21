const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add notification title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add notification message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  notification_type: {
    type: String,
    enum: ['application_update', 'interview_reminder', 'job_recommendation', 'candidate_recommendation', 'system_announcement', 'payment_reminder'],
    required: [true, 'Please specify notification type']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  related_entity_type: {
    type: String,
    enum: ['Job', 'Application', 'Interview', 'AIJobRecommendation', 'AICandidateRecommendation', 'Payment'],
    default: null
  },
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  action_url: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read_at: {
    type: Date,
    default: null
  },
  expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for notification queries
notificationSchema.index({ user_id: 1, created_at: -1 });
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ notification_type: 1 });
notificationSchema.index({ expires_at: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
