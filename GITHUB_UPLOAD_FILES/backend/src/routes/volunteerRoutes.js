const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const Availability = require('../models/Availability');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/volunteers
// @desc    Get all volunteers with profiles & availability (NGO/Admin can browse)
// @access  Private (NGO or Admin)
router.get('/', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const { skill, search, city } = req.query;

    let userQuery = { role: 'volunteer', isActive: true };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(userQuery).select('-password');
    const userIds = users.map((u) => u._id);

    let profileQuery = { user: { $in: userIds } };
    if (skill) {
      profileQuery.skills = skill;
    }
    if (city) {
      profileQuery['location.city'] = { $regex: city, $options: 'i' };
    }

    const profiles = await VolunteerProfile.find(profileQuery)
      .populate('user', 'name email phone avatar createdAt')
      .populate('skills', 'name category');

    // Attach availability
    const volunteersWithAvailability = await Promise.all(
      profiles.map(async (p) => {
        const availability = await Availability.findOne({ volunteer: p.user?._id });
        const pObj = p.toObject();
        pObj.availability = availability;
        return pObj;
      })
    );

    res.json({
      success: true,
      count: volunteersWithAvailability.length,
      data: volunteersWithAvailability,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/volunteers/profile/me
// @desc    Get current volunteer's profile & availability
// @access  Private (Volunteer)
router.get('/profile/me', protect, authorize('volunteer', 'admin'), async (req, res, next) => {
  try {
    let profile = await VolunteerProfile.findOne({ user: req.user._id }).populate('skills');
    if (!profile) {
      profile = await VolunteerProfile.create({ user: req.user._id });
    }

    let availability = await Availability.findOne({ volunteer: req.user._id });
    if (!availability) {
      availability = await Availability.create({ volunteer: req.user._id });
    }

    res.json({
      success: true,
      profile,
      availability,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/volunteers/profile/me
// @desc    Update current volunteer profile
// @access  Private (Volunteer)
router.put('/profile/me', protect, authorize('volunteer', 'admin'), async (req, res, next) => {
  try {
    const { bio, skills, interests, location, emergencyContact } = req.body;

    let profile = await VolunteerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new VolunteerProfile({ user: req.user._id });
    }

    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (interests !== undefined) profile.interests = interests;
    if (location !== undefined) profile.location = location;
    if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;

    await profile.save();

    const populatedProfile = await VolunteerProfile.findById(profile._id).populate('skills');

    res.json({
      success: true,
      message: 'Volunteer profile updated successfully',
      profile: populatedProfile,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/volunteers/:id
// @desc    Get volunteer by User ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role !== 'volunteer') {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    const profile = await VolunteerProfile.findOne({ user: user._id }).populate('skills');
    const availability = await Availability.findOne({ volunteer: user._id });

    res.json({
      success: true,
      data: {
        user,
        profile,
        availability,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
