const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, isDriver } = require('../middleware/auth');
const {
  createRide,
  getRides,
  joinRide,
  updateRideStatus,
  cancelRide
} = require('../controllers/rideController');

// @route   POST /api/rides
// @desc    Create a ride
// @access  Private (Driver only)
router.post('/', [
  auth,
  isDriver,
  body('origin').notEmpty().withMessage('Origin is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('seatsAvailable').isInt({ min: 1, max: 7 }).withMessage('Seats must be between 1 and 7'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('vehicleDetails.type').isIn(['car', 'bike']).withMessage('Vehicle type must be car or bike')
], createRide);

// @route   GET /api/rides
// @desc    Get all rides for a university
// @access  Public
router.get('/', auth, getRides);

// @route   POST /api/rides/:id/join
// @desc    Join a ride
// @access  Private
router.post('/:id/join', [
  auth,
  body('pickupLocation').notEmpty().withMessage('Pickup location is required')
], joinRide);

// @route   PUT /api/rides/:id/status
// @desc    Update ride status
// @access  Private (Driver only)
router.put('/:id/status', [
  auth,
  isDriver,
  body('status').isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], updateRideStatus);

// @route   DELETE /api/rides/:id
// @desc    Cancel ride
// @access  Private (Driver only)
router.delete('/:id', [auth, isDriver], cancelRide);

module.exports = router; 