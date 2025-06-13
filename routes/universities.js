const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  addUniversity,
  getUniversities,
  getUniversityByCode
} = require('../controllers/universityController');

// @route   POST /api/universities
// @desc    Add a new university
// @access  Private (Admin only)
router.post(
  '/',
  [
    check('name', 'University name is required').not().isEmpty(),
    check('code', 'University code is required').not().isEmpty(),
    check('code', 'University code must be between 2 and 10 characters').isLength({ min: 2, max: 10 }),
    check('location', 'Location is required').not().isEmpty()
  ],
  addUniversity
);

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', getUniversities);

// @route   GET /api/universities/:code
// @desc    Get university by code
// @access  Public
router.get('/:code', getUniversityByCode);

module.exports = router; 