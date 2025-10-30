const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTask, getTasksForProject, updateTask, deleteTask } = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/:projectId', auth, getTasksForProject);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;