const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { 
  createRide, 
  listRides, 
  joinRide, 
  updateRide, 
  deleteRide 
} = require('../controllers/rideController');

// @route   POST api/rides
// @desc    Create a ride
// @access  Private
router.post('/', auth, [
  body('origin').notEmpty(),
  body('destination').notEmpty(),
  body('time').isISO8601(),
  body('seatsAvailable').isInt({ min: 1 })
], createRide);

// @route   GET api/rides
// @desc    Get all rides
// @access  Public
router.get('/', listRides);

// @route   POST api/rides/:id/join
// @desc    Join a ride
// @access  Private
router.post('/:id/join', auth, joinRide);

// @route   PUT api/rides/:id
// @desc    Update a ride
// @access  Private
router.put('/:id', auth, updateRide);

// @route   DELETE api/rides/:id
// @desc    Delete a ride
// @access  Private
router.delete('/:id', auth, deleteRide);

module.exports = router; 