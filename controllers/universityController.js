const University = require('../models/University');
const { validationResult } = require('express-validator');

// @desc    Add a new university
// @route   POST /api/universities
// @access  Private (Admin only)
exports.addUniversity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, code, location } = req.body;

    // Check if university already exists
    let university = await University.findOne({ 
      $or: [{ name }, { code }] 
    });

    if (university) {
      return res.status(400).json({
        success: false,
        message: 'University with this name or code already exists'
      });
    }

    // Create new university
    university = new University({
      name,
      code,
      location
    });

    await university.save();

    res.status(201).json({
      success: true,
      university
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
exports.getUniversities = async (req, res) => {
  try {
    const universities = await University.find({ isActive: true })
      .select('name code location')
      .sort({ name: 1 });

    res.json({
      success: true,
      universities
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get university by code
// @route   GET /api/universities/:code
// @access  Public
exports.getUniversityByCode = async (req, res) => {
  try {
    const university = await University.findOne({ 
      code: req.params.code,
      isActive: true 
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    res.json({
      success: true,
      university
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 