const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a university name'],
    default: 'Indian Institute of Technology Bombay',
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Please add a university code'],
    default: 'IITB',
    trim: true,
    uppercase: true,
    maxlength: [10, 'Code cannot be more than 10 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    default: 'Mumbai, Maharashtra',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one university document exists
UniversitySchema.statics.initializeUniversity = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.create({
      name: 'Indian Institute of Technology Bombay',
      code: 'IITB',
      location: 'Mumbai, Maharashtra'
    });
  }
};

module.exports = mongoose.model('University', UniversitySchema); 