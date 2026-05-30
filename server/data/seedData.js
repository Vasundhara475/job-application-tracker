// 🌱 Seed Sample Data Script
// Run: node data/seedData.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Application = require('../models/Application');
const Task = require('../models/Task');

const sampleApplications = [
  {
    companyName: '🏢 Google',
    roleTitle: 'Software Engineer (L3)',
    location: 'Bangalore, India',
    source: 'LinkedIn',
    status: 'Interview',
    salaryNote: '₹25-35 LPA',
    jobUrl: 'https://careers.google.com',
    notes: 'Phone screen passed! Technical interview scheduled for next week.',
    skills: ['Python', 'Data Structures', 'System Design', 'LeetCode'],
    priority: 'High',
    contactName: 'Priya Sharma',
    contactEmail: 'priya.rec@google.com',
    appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🛒 Flipkart',
    roleTitle: 'Full Stack Developer',
    location: 'Bangalore, India',
    source: 'Company Website',
    status: 'OA',
    salaryNote: '₹18-22 LPA',
    jobUrl: 'https://www.flipkartcareers.com',
    notes: 'Online assessment scheduled. Mostly DSA + JavaScript questions expected.',
    skills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript'],
    priority: 'High',
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🏦 Paytm',
    roleTitle: 'Backend Developer',
    location: 'Noida, India',
    source: 'Naukri',
    status: 'Applied',
    salaryNote: '₹15-20 LPA',
    notes: 'Submitted resume via Naukri. Waiting for response.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    priority: 'Medium',
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🚀 Razorpay',
    roleTitle: 'MERN Stack Developer',
    location: 'Bangalore, India',
    source: 'Referral',
    status: 'Screening',
    salaryNote: '₹20-28 LPA',
    notes: 'Got referral from college senior Rahul. HR call scheduled.',
    skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    priority: 'High',
    contactName: 'Rahul Verma',
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🌐 Infosys',
    roleTitle: 'Systems Engineer',
    location: 'Pune, India',
    source: 'Campus',
    status: 'Offer',
    salaryNote: '₹7.5 LPA',
    notes: 'Offer letter received! Package: 7.5 LPA. Comparing with other offers.',
    skills: ['Java', 'SQL', 'Manual Testing'],
    priority: 'Low',
    appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '💻 TCS',
    roleTitle: 'Software Developer',
    location: 'Mumbai, India',
    source: 'Campus',
    status: 'Rejected',
    salaryNote: '₹7 LPA',
    notes: 'Rejected after final round. Need to improve communication skills.',
    skills: ['Java', 'Python', 'SQL'],
    priority: 'Low',
    appliedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🎯 Zomato',
    roleTitle: 'React Developer',
    location: 'Gurugram, India',
    source: 'LinkedIn',
    status: 'Applied',
    salaryNote: '₹12-16 LPA',
    notes: 'Just applied. Profile matches JD well. Fingers crossed! 🤞',
    skills: ['React.js', 'TypeScript', 'Redux', 'CSS'],
    priority: 'Medium',
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: '🏠 Swiggy',
    roleTitle: 'Node.js Backend Developer',
    location: 'Bangalore, India',
    source: 'Indeed',
    status: 'Saved',
    salaryNote: '₹14-18 LPA',
    notes: 'Interested role. Need to tailor resume before applying.',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    priority: 'Medium',
    appliedDate: new Date(),
  },
];

const sampleTasks = [
  {
    title: '📝 Practice System Design (LLD + HLD)',
    priority: 'High',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    done: false,
  },
  {
    title: '💻 Solve 5 LeetCode Medium problems',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    done: false,
  },
  {
    title: '📧 Send thank-you email to HR',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    done: true,
  },
  {
    title: '📚 Revise MongoDB aggregations',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    done: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Application.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ✅ Plain password — Mongoose pre-save hook handles hashing
    const user = await User.create({
      name: '🎓 Demo Student',
      email: 'demo@jobtracker.com',
      password: 'password123',
    });
    console.log('👤 Demo user created: demo@jobtracker.com / password123');

    // Create applications
    const appDocs = await Application.insertMany(
      sampleApplications.map((app) => ({ ...app, user: user._id }))
    );
    console.log(`📋 Created ${appDocs.length} sample applications`);

    // Create tasks for first application (Google)
    await Task.insertMany(
      sampleTasks.map((task) => ({
        ...task,
        application: appDocs[0]._id,
        user: user._id,
      }))
    );
    console.log(`✅ Created ${sampleTasks.length} sample tasks`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Login: demo@jobtracker.com');
    console.log('🔑 Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();