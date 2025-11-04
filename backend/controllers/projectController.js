// backend/controllers/projectController.js
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, repoUrl, liveUrl, status } = req.body;
        const project = new Project({
            owner: req.user.id,
            title,
            description,
            tags: technologies || [],
            repoUrl: repoUrl || '',
            liveUrl: liveUrl || '',
            status: status || 'ongoing',
            published: true 
        });
        await project.save();
        res.json(project);
    } catch (err) {
        console.error('createProject error', err);
        res.status(500).send('Server error');
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.id }).populate('tasks').lean();
        res.json(projects);
    } catch (err) {
        console.error('getProjects error', err);
        res.status(500).send('Server error');
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('tasks').lean();
        if (!project) return res.status(404).json({ message: 'Not found' });
        if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        res.json(project);
    } catch (err) {
        console.error('getProjectById error', err);
        res.status(500).send('Server error');
    }
};

exports.updateProject = async (req, res) => {
    try {
        const data = req.body;
        const allowed = {};
        ['title','description','tags','repoUrl','liveUrl','status'].forEach(f => { if (data[f] !== undefined) allowed[f] = data[f]; });
        const project = await Project.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, allowed, { new: true }).populate('tasks').lean();
        if (!project) return res.status(404).json({ message: 'Not found or unauthorized' });
        res.json(project);
    } catch (err) {
        console.error('updateProject error', err);
        res.status(500).send('Server error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!project) return res.status(404).json({ message: 'Not found or unauthorized' });
        await Task.deleteMany({ project: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('deleteProject error', err);
        res.status(500).send('Server error');
    }
};

exports.getPublishedByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username }).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    // respect user's published flag
    if (!user.published) return res.status(403).json({ message: 'Portfolio not published' });

    const projects = await Project.find({ owner: user._id, published: true }).populate('tasks').lean();

    const normalized = projects.map(p => ({
      ...p,
      tags: p.tags || p.technologies || [],
      repoUrl: p.repoUrl || '',
      liveUrl: p.liveUrl || '',
    }));

    res.json({
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        location: user.location || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        skills: user.skills || [],
        education: user.education || '',
      },
      projects: normalized
    });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.togglePortfolioPublic = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isPublic = !user.isPublic;
        await user.save();
        // Return only the isPublic flag and message
        res.json({ isPublic: user.isPublic, message: `Portfolio is now ${user.isPublic ? 'public' : 'private'}` });
    } catch (err) {
        console.error('togglePortfolioPublic error', err);
        res.status(500).send('Server error');
    }
};