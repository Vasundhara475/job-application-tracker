// 📋 Application Controller
const Application = require('../models/Application');

// @desc    Get all applications for logged in user
// @route   GET /api/jobs
// @access  Private
const getApplications = async (req, res) => {
  try {
    const { status, search, sort = '-createdAt' } = req.query;

    // Build query
    let query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { roleTitle: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .sort(sort)
      .lean();

    res.json({ count: applications.length, applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: '💥 Error fetching applications' });
  }
};

// @desc    Get single application
// @route   GET /api/jobs/:id
// @access  Private
const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: '❌ Application not found' });
    }

    res.json({ application });
  } catch (error) {
    res.status(500).json({ message: '💥 Error fetching application' });
  }
};

// @desc    Create new application
// @route   POST /api/jobs
// @access  Private
const createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      message: '🎉 Application added successfully!',
      application,
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(400).json({ message: error.message || '💥 Error creating application' });
  }
};

// @desc    Update application
// @route   PUT /api/jobs/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: '❌ Application not found' });
    }

    res.json({ message: '✅ Application updated!', application });
  } catch (error) {
    res.status(400).json({ message: error.message || '💥 Error updating application' });
  }
};

// @desc    Delete application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: '❌ Application not found' });
    }

    res.json({ message: '🗑️ Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: '💥 Error deleting application' });
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};