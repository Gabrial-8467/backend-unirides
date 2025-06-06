const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, university } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    if (name) user.name = name;
    if (university) user.university = university;
    
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    await user.deleteOne();
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
}; 