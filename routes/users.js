const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/userController');

// @route   GET api/users/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, getProfile);

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, updateProfile);

// @route   DELETE api/users/me
// @desc    Delete user profile
// @access  Private
router.delete('/me', auth, deleteProfile);

module.exports = router; 