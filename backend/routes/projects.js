// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createProject, getProjects, getProjectById, updateProject, deleteProject, uploadProjectImage, getPublishedByUsername } = require('../controllers/projectController');

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

router.get('/public/:username', getPublishedByUsername);

module.exports = router;