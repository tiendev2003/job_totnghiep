// User & Authentication Models
const User = require('./User');
const UserVerification = require('./UserVerification');

// Candidate Models
const Candidate = require('./Candidate');
const CandidateExperience = require('./CandidateExperience');
const CandidateEducation = require('./CandidateEducation');
const CandidateSkill = require('./CandidateSkill');

// Recruiter Models
const Recruiter = require('./Recruiter');
const RecruiterSubscription = require('./RecruiterSubscription');

// Job Models
const Job = require('./Job');
const JobCategory = require('./JobCategory');

// Application Models
const Application = require('./Application');
const ApplicationStatusHistory = require('./ApplicationStatusHistory');

// Interview Models
const Interview = require('./Interview');
const InterviewFeedback = require('./InterviewFeedback');

// AI & Recommendation Models
const AIJobRecommendation = require('./AIJobRecommendation');
const AICandidateRecommendation = require('./AICandidateRecommendation');
const AIUserPreferences = require('./AIUserPreferences');
const AIFeedback = require('./AIFeedback');

// Communication Models
const Notification = require('./Notification');
const Message = require('./Message');
const EmailTemplate = require('./EmailTemplate');

// Admin & Report Models
const Report = require('./Report');

// Payment Models
const Payment = require('./Payment');

// System Models
const FileUpload = require('./FileUpload');
const UserActivity = require('./UserActivity');

module.exports = {
  // User & Authentication
  User,
  UserVerification,
  
  // Candidate
  Candidate,
  CandidateExperience,
  CandidateEducation,
  CandidateSkill,
  
  // Recruiter
  Recruiter,
  RecruiterSubscription,
  
  // Job
  Job,
  JobCategory,
  
  // Application
  Application,
  ApplicationStatusHistory,
  
  // Interview
  Interview,
  InterviewFeedback,
  
  // AI & Recommendations
  AIJobRecommendation,
  AICandidateRecommendation,
  AIUserPreferences,
  AIFeedback,
  
  // Communication
  Notification,
  Message,
  EmailTemplate,
  
  // Admin & Reports
  Report,
  
  // Payment
  Payment,
  
  // System
  FileUpload,
  UserActivity
};
