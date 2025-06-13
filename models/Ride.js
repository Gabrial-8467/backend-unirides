const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver is required']
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  seatsAvailable: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'At least one seat must be available'],
    max: [7, 'Maximum 7 seats allowed']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pickupLocation: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University is required']
  },
  vehicleDetails: {
    type: {
      type: String,
      enum: ['car', 'bike'],
      required: [true, 'Vehicle type is required']
    },
    model: String,
    color: String,
    number: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
RideSchema.index({ driver: 1 });
RideSchema.index({ university: 1 });
RideSchema.index({ departureTime: 1 });
RideSchema.index({ status: 1 });

module.exports = mongoose.model('Ride', RideSchema); 