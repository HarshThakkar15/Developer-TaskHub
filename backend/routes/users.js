// backend/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { getPublicProfile, updateProfile, uploadAvatar, publishPortfolio } = require('../controllers/userController');

router.put('/me', auth, updateProfile);
router.put('/me/publish', auth, publishPortfolio);

router.get('/public/:username', getPublicProfile);

module.exports = router;