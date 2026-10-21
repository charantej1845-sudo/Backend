const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGOProfile = require('../models/NGOProfile');
const VolunteerProfile = require('../models/VolunteerProfile');
const Event = require('../models/Event');
const Skill = require('../models/Skill');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/stats/overview
// @desc    Public platform metrics
// @access  Public
router.get('/overview', async (req, res, next) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer', isActive: true });
    const totalNGOs = await User.countDocuments({ role: 'ngo', isActive: true });
    const totalEvents = await Event.countDocuments({ status: { $ne: 'Cancelled' } });
    const totalSkills = await Skill.countDocuments();

    // Sum total hours logged across all volunteer profiles
    const hourAgg = await VolunteerProfile.aggregate([
      { $group: { _id: null, totalHours: { $sum: '$totalHoursLogged' } } },
    ]);
    const totalHoursLogged = hourAgg.length > 0 ? hourAgg[0].totalHours : 0;

    res.json({
      success: true,
      data: {
        totalVolunteers,
        totalNGOs,
        totalEvents,
        totalSkills,
        totalHoursLogged,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/stats/volunteer
// @desc    Volunteer personal statistics
// @access  Private (Volunteer)
router.get('/volunteer', protect, authorize('volunteer', 'admin'), async (req, res, next) => {
  try {
    const profile = await VolunteerProfile.findOne({ user: req.user._id });
    const totalApplications = await Application.countDocuments({ volunteer: req.user._id });
    const approvedCount = await Application.countDocuments({ volunteer: req.user._id, status: 'approved' });
    const pendingCount = await Application.countDocuments({ volunteer: req.user._id, status: 'pending' });
    const attendedCount = await Application.countDocuments({ volunteer: req.user._id, status: 'attended' });

    res.json({
      success: true,
      data: {
        totalHoursLogged: profile?.totalHoursLogged || 0,
        eventsAttendedCount: profile?.eventsAttendedCount || attendedCount,
        totalApplications,
        approvedCount,
        pendingCount,
        skillsCount: profile?.skills?.length || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/stats/ngo
// @desc    NGO organization statistics
// @access  Private (NGO)
router.get('/ngo', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments({ ngo: req.user._id });
    const activeEvents = await Event.countDocuments({ ngo: req.user._id, status: 'Active' });
    const upcomingEvents = await Event.countDocuments({ ngo: req.user._id, status: 'Upcoming' });

    const totalApplications = await Application.countDocuments({ ngo: req.user._id });
    const pendingApplications = await Application.countDocuments({ ngo: req.user._id, status: 'pending' });
    const approvedApplications = await Application.countDocuments({ ngo: req.user._id, status: 'approved' });
    const attendedApplications = await Application.countDocuments({ ngo: req.user._id, status: 'attended' });

    const hoursAgg = await Application.aggregate([
      { $match: { ngo: req.user._id, status: 'attended' } },
      { $group: { _id: null, hours: { $sum: '$hoursLogged' } } },
    ]);
    const hoursDelivered = hoursAgg.length > 0 ? hoursAgg[0].hours : 0;

    res.json({
      success: true,
      data: {
        totalEvents,
        activeEvents,
        upcomingEvents,
        totalApplications,
        pendingApplications,
        approvedApplications,
        attendedApplications,
        hoursDelivered,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/stats/admin
// @desc    Admin comprehensive overview
// @access  Private (Admin)
router.get('/admin', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalEvents = await Event.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalApplications = await Application.countDocuments();

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVolunteers,
        totalNGOs,
        totalEvents,
        totalSkills,
        totalApplications,
        eventsByCategory,
        recentUsers: users,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
