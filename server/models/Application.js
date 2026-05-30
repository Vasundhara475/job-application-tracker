// 📋 Job Application Model
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    roleTitle: {
      type: String,
      required: [true, 'Role/Job title is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    jobUrl: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Campus', 'Other'],
      default: 'LinkedIn',
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'OA', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Accepted'],
      default: 'Applied',
    },
    salaryNote: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    contactName: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for fast queries
ApplicationSchema.index({ user: 1, status: 1 });
ApplicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);