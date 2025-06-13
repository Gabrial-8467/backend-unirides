const Ride = require('../models/Ride');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a ride
// @route   POST /api/rides
// @access  Private (Driver only)
exports.createRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      origin,
      destination,
      departureTime,
      seatsAvailable,
      price,
      vehicleDetails
    } = req.body;

    // Create new ride
    const ride = new Ride({
      driver: req.user.id,
      origin,
      destination,
      departureTime,
      seatsAvailable,
      price,
      vehicleDetails,
      university: req.user.university
    });

    await ride.save();

    res.status(201).json({
      success: true,
      ride
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all rides for a university
// @route   GET /api/rides
// @access  Public
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ university: req.user.university })
      .populate('driver', 'name rating')
      .populate('passengers.user', 'name')
      .sort({ departureTime: 1 });

    res.json({
      success: true,
      rides
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Join a ride
// @route   POST /api/rides/:id/join
// @access  Private
exports.joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if ride is from same university
    if (ride.university.toString() !== req.user.university.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to join this ride'
      });
    }

    // Check if ride is full
    if (ride.passengers.length >= ride.seatsAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Ride is full'
      });
    }

    // Check if user is already a passenger
    const isPassenger = ride.passengers.some(
      passenger => passenger.user.toString() === req.user.id
    );

    if (isPassenger) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this ride'
      });
    }

    // Add user to passengers
    ride.passengers.push({
      user: req.user.id,
      pickupLocation: req.body.pickupLocation
    });

    await ride.save();

    res.json({
      success: true,
      ride
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private (Driver only)
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ride'
      });
    }

    ride.status = status;
    await ride.save();

    res.json({
      success: true,
      ride
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel ride
// @route   DELETE /api/rides/:id
// @access  Private (Driver only)
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ride'
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.json({
      success: true,
      message: 'Ride cancelled successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 