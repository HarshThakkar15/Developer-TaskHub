// backend/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  tags: [String],
  repoUrl: String,
  liveUrl: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: { type: String, enum: ['ongoing','completed'], default: 'ongoing' },
  published: { type: Boolean, default: true } // auto included in portfolio
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);