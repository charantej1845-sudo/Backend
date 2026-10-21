const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const NGOProfile = require('../models/NGOProfile');
const Availability = require('../models/Availability');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_volunteer_mgmt_2026_xyz', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (volunteer or ngo)
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone, organizationName, causeCategory, mission } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = role === 'ngo' ? 'ngo' : role === 'admin' ? 'admin' : 'volunteer';

    // Create base user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
    });

    // Create role-specific profile
    if (assignedRole === 'volunteer') {
      await VolunteerProfile.create({
        user: user._id,
        bio: '',
        skills: [],
        interests: [],
      });
      // Create initial availability record
      await Availability.create({
        volunteer: user._id,
        daysOfWeek: ['Saturday', 'Sunday'],
        timeSlots: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)'],
        maxHoursPerWeek: 10,
      });
    } else if (assignedRole === 'ngo') {
      await NGOProfile.create({
        user: user._id,
        organizationName: organizationName || name,
        causeCategory: causeCategory || 'Community Development',
        mission: mission || '',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    }

    const token = generateToken(user._id);

    // Fetch profile
    let profile = null;
    if (user.role === 'volunteer') {
      profile = await VolunteerProfile.findOne({ user: user._id }).populate('skills');
    } else if (user.role === 'ngo') {
      profile = await NGOProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user & profile
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let profile = null;
    let availability = null;

    if (user.role === 'volunteer') {
      profile = await VolunteerProfile.findOne({ user: user._id }).populate('skills');
      availability = await Availability.findOne({ volunteer: user._id });
    } else if (user.role === 'ngo') {
      profile = await NGOProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
      },
      profile,
      availability,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user basic info
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
