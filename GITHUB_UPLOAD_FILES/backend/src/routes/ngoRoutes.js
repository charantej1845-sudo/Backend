const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGOProfile = require('../models/NGOProfile');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/ngos
// @desc    Get all NGOs with search and filters
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, causeCategory, city } = req.query;

    let query = {};
    if (causeCategory && causeCategory !== 'All') {
      query.causeCategory = causeCategory;
    }
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { mission: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const ngos = await NGOProfile.find(query).populate('user', 'name email phone avatar');

    // Attach event counts
    const ngosWithCounts = await Promise.all(
      ngos.map(async (ngo) => {
        const eventsCount = await Event.countDocuments({ ngo: ngo.user?._id });
        const ngoObj = ngo.toObject();
        ngoObj.eventsCount = eventsCount;
        return ngoObj;
      })
    );

    res.json({ success: true, count: ngosWithCounts.length, data: ngosWithCounts });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/ngos/profile/me
// @desc    Get current NGO profile
// @access  Private (NGO)
router.get('/profile/me', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    let profile = await NGOProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await NGOProfile.create({
        user: req.user._id,
        organizationName: req.user.name,
      });
    }

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/ngos/profile/me
// @desc    Update current NGO profile
// @access  Private (NGO)
router.put('/profile/me', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const {
      organizationName,
      registrationNumber,
      causeCategory,
      mission,
      description,
      website,
      contactPerson,
      contactPhone,
      address,
      logo,
    } = req.body;

    let profile = await NGOProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new NGOProfile({ user: req.user._id });
    }

    if (organizationName) profile.organizationName = organizationName;
    if (registrationNumber !== undefined) profile.registrationNumber = registrationNumber;
    if (causeCategory) profile.causeCategory = causeCategory;
    if (mission !== undefined) profile.mission = mission;
    if (description !== undefined) profile.description = description;
    if (website !== undefined) profile.website = website;
    if (contactPerson !== undefined) profile.contactPerson = contactPerson;
    if (contactPhone !== undefined) profile.contactPhone = contactPhone;
    if (address !== undefined) profile.address = address;
    if (logo !== undefined) profile.logo = logo;

    await profile.save();

    res.json({
      success: true,
      message: 'NGO profile updated successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/ngos/:id
// @desc    Get single NGO by ID with their active events
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const ngo = await NGOProfile.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    const events = await Event.find({ ngo: ngo.user?._id, status: { $ne: 'Cancelled' } }).sort({ startDate: 1 });

    res.json({
      success: true,
      data: {
        ngo,
        events,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
