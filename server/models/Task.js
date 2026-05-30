const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    done: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);