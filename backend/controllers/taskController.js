// backend/controllers/taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { project, title, description } = req.body;
    // ensure project belongs to user
    const ownerProject = await Project.findById(project);
    if (!ownerProject || ownerProject.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const task = new Task({ project, title, description: description || '', status: 'todo' });
    await task.save();
    ownerProject.tasks.push(task._id);
    await ownerProject.save();
    res.json(task);
  } catch (err) {
    console.error('createTask error', err);
    res.status(500).send('Server error');
  }
};

exports.getTasksForProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error('getTasksForProject error', err);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.title !== undefined) allowed.title = req.body.title;
    if (req.body.description !== undefined) allowed.description = req.body.description;
    if (req.body.status !== undefined) allowed.status = req.body.status;
    if (req.body.assignee !== undefined) allowed.assignee = req.body.assignee;

    const task = await Task.findByIdAndUpdate(req.params.id, allowed, { new: true });
    res.json(task);
  } catch (err) {
    console.error('updateTask error', err);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteTask error', err);
    res.status(500).send('Server error');
  }
};