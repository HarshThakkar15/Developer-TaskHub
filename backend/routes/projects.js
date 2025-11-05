// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const { createProject, getProjects, getProjectById, updateProject, deleteProject, uploadProjectImage, getPublishedByUsername } = require('../controllers/projectController');

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

router.get('/public/:username', getPublishedByUsername);

router.get('/public/project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { _id, title, description, tags, tech,  repoUrl, liveUrl, link, createdAt, updatedAt } = project;

    return res.json({ _id, title, description, tags, tech,  repoUrl, liveUrl, link, createdAt, updatedAt });
  } catch (err) {
    console.error('Public project fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;