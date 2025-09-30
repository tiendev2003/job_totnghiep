require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Import seeders
const userSeeder = require('./userSeeder');
const jobCategorySeeder = require('./jobCategorySeeder');
const candidateSeeder = require('./candidateSeeder');
const recruiterSeeder = require('./recruiterSeeder');
const jobSeeder = require('./jobSeeder');
const applicationSeeder = require('./applicationSeeder');
const interviewSeeder = require('./interviewSeeder');
const notificationSeeder = require('./notificationSeeder');
const messageSeeder = require('./messageSeeder');
const servicePlanSeeder = require('./servicePlanSeeder');

async function runSeeders() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database successfully');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await clearDatabase();

    // Run seeders in order (due to dependencies)
    console.log('🌱 Starting to seed database...\n');

    // 1. Seed Users first (required for other entities)
    await userSeeder();
    console.log('✅ Users seeded successfully\n');

    // 2. Seed Job Categories (independent)
    await jobCategorySeeder();
    console.log('✅ Job Categories seeded successfully\n');

    // 3. Seed Service Plans (independent)
    await servicePlanSeeder();
    console.log('✅ Service Plans seeded successfully\n');

    // 4. Seed Candidates (depends on Users)
    await candidateSeeder();
    console.log('✅ Candidates seeded successfully\n');

    // 5. Seed Recruiters (depends on Users)
    await recruiterSeeder();
    console.log('✅ Recruiters seeded successfully\n');

    // 6. Seed Jobs (depends on Recruiters and Job Categories)
    await jobSeeder();
    console.log('✅ Jobs seeded successfully\n');

    // 7. Seed Applications (depends on Candidates and Jobs)
    await applicationSeeder();
    console.log('✅ Applications seeded successfully\n');

    // 8. Seed Interviews (depends on Applications)
    await interviewSeeder();
    console.log('✅ Interviews seeded successfully\n');

    // 9. Seed Notifications (depends on Users)
    await notificationSeeder();
    console.log('✅ Notifications seeded successfully\n');

    // 10. Seed Messages (depends on Users)
    await messageSeeder();
    console.log('✅ Messages seeded successfully\n');

    console.log('🎉 All seeders completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    console.log('🧹 Clearing existing data...');
    
    const collections = [
      'users',
      'candidates', 
      'recruiters',
      'jobs',
      'jobcategories',
      'applications',
      'interviews',
      'notifications',
      'messages',
      'serviceplans',
      'candidateexperiences',
      'candidateeducations',
      'candidateskills',
      'recruitersubscriptions',
      'applicationstatushistories',
      'interviewfeedbacks'
    ];

    for (const collection of collections) {
      if (mongoose.connection.db) {
        await mongoose.connection.db.collection(collection).deleteMany({});
      }
    }
    
    console.log('✅ Database cleared successfully\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

// Run seeders
runSeeders();
