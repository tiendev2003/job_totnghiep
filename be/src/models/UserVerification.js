const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verification_type: {
    type: String,
    enum: ['email_verification', 'phone_verification', 'password_reset', 'account_recovery'],
    required: [true, 'Please specify verification type']
  },
  verification_code: {
    type: String,
    required: [true, 'Please add verification code'],
    trim: true
  },
  expires_at: {
    type: Date,
    required: [true, 'Please add expiration date'],
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  },
  is_used: {
    type: Boolean,
    default: false
  },
  used_at: {
    type: Date,
    default: null
  },
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Maximum 5 attempts allowed']
  },
  ip_address: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
      },
      message: 'Please provide a valid IP address'
    }
  },
  user_agent: {
    type: String,
    trim: true
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound index to prevent duplicate active verifications
userVerificationSchema.index({ 
  user_id: 1, 
  verification_type: 1, 
  is_used: 1 
}, { 
  unique: true,
  partialFilterExpression: { is_used: false }
});

// TTL index to automatically delete expired verifications
userVerificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('UserVerification', userVerificationSchema);
