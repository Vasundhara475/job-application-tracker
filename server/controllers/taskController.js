// ✅ Task Controller
const Task = require('../models/Task');
const Application = require('../models/Application');

// @desc    Get tasks for an application
// @route   GET /api/tasks/:jobId
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      application: req.params.jobId,
      user: req.user._id,
    }).sort('dueDate');

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: '💥 Error fetching tasks' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { applicationId, title, dueDate, priority } = req.body;

    // Verify application belongs to user
    const app = await Application.findOne({ _id: applicationId, user: req.user._id });
    if (!app) return res.status(404).json({ message: '❌ Application not found' });

    const task = await Task.create({
      application: applicationId,
      user: req.user._id,
      title,
      dueDate,
      priority,
    });

    res.status(201).json({ message: '✅ Task created!', task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task (toggle done, etc.)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: '❌ Task not found' });
    res.json({ task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: '🗑️ Task deleted' });
  } catch (error) {
    res.status(500).json({ message: '💥 Error deleting task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };