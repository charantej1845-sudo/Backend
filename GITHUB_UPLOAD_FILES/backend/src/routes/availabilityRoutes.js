const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/availability/me
// @desc    Get current volunteer's availability
// @access  Private (Volunteer)
router.get('/me', protect, authorize('volunteer', 'admin'), async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ volunteer: req.user._id });

    if (!availability) {
      availability = await Availability.create({
        volunteer: req.user._id,
        daysOfWeek: ['Saturday', 'Sunday'],
        timeSlots: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)'],
        maxHoursPerWeek: 10,
      });
    }

    res.json({ success: true, availability });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/availability/me
// @desc    Update volunteer availability schedule
// @access  Private (Volunteer)
router.put('/me', protect, authorize('volunteer', 'admin'), async (req, res, next) => {
  try {
    const {
      daysOfWeek,
      timeSlots,
      maxHoursPerWeek,
      preferredLocationType,
      notes,
      specificDatesAvailable,
      specificDatesUnavailable,
    } = req.body;

    let availability = await Availability.findOne({ volunteer: req.user._id });

    if (!availability) {
      availability = new Availability({ volunteer: req.user._id });
    }

    if (daysOfWeek !== undefined) availability.daysOfWeek = daysOfWeek;
    if (timeSlots !== undefined) availability.timeSlots = timeSlots;
    if (maxHoursPerWeek !== undefined) availability.maxHoursPerWeek = maxHoursPerWeek;
    if (preferredLocationType !== undefined) availability.preferredLocationType = preferredLocationType;
    if (notes !== undefined) availability.notes = notes;
    if (specificDatesAvailable !== undefined) availability.specificDatesAvailable = specificDatesAvailable;
    if (specificDatesUnavailable !== undefined) availability.specificDatesUnavailable = specificDatesUnavailable;

    await availability.save();

    res.json({
      success: true,
      message: 'Availability schedule updated successfully',
      availability,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/availability/volunteer/:volunteerId
// @desc    Get availability by volunteer User ID
// @access  Private (NGO or Admin)
router.get('/volunteer/:volunteerId', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const availability = await Availability.findOne({ volunteer: req.params.volunteerId });

    if (!availability) {
      return res.status(404).json({ success: false, message: 'Availability not configured for this volunteer' });
    }

    res.json({ success: true, availability });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
