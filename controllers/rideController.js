const Ride = require('../models/Ride');
const { validationResult } = require('express-validator');

exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { origin, destination, time, seatsAvailable } = req.body;
  try {
    const ride = new Ride({
      driver: req.user.id,
      origin,
      destination,
      time,
      seatsAvailable,
      passengers: []
    });
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.listRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('driver', 'name university');
    res.json(rides);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.seatsAvailable <= ride.passengers.length)
      return res.status(400).json({ msg: 'No seats available' });
    if (ride.passengers.includes(req.user.id))
      return res.status(400).json({ msg: 'Already joined' });
    ride.passengers.push(req.user.id);
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });
    const updates = (({ origin, destination, time, seatsAvailable }) => ({ origin, destination, time, seatsAvailable }))(req.body);
    Object.assign(ride, updates);
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.driver.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });
    await ride.deleteOne();
    res.json({ msg: 'Ride deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
}; 