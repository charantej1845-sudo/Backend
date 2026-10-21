const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Event = require('../models/Event');
const VolunteerProfile = require('../models/VolunteerProfile');
const Availability = require('../models/Availability');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/applications/apply/:eventId
// @desc    Volunteer applies to an event
// @access  Private (Volunteer)
router.post('/apply/:eventId', protect, authorize('volunteer'), async (req, res, next) => {
  try {
    const { message } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'Cancelled' || event.status === 'Completed') {
      return res.status(400).json({ success: false, message: `Cannot apply to ${event.status.toLowerCase()} event` });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      event: event._id,
      volunteer: req.user._id,
    });

    if (existingApp) {
      if (existingApp.status === 'cancelled') {
        // Re-open cancelled application
        existingApp.status = 'pending';
        existingApp.message = message || existingApp.message;
        existingApp.appliedAt = new Date();
        await existingApp.save();
        return res.json({ success: true, message: 'Application re-submitted successfully', data: existingApp });
      }
      return res.status(400).json({ success: false, message: `You have already applied for this event (status: ${existingApp.status})` });
    }

    const application = await Application.create({
      event: event._id,
      volunteer: req.user._id,
      ngo: event.ngo,
      message: message || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! The NGO will review your application.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get all applications submitted by the logged-in volunteer
// @access  Private (Volunteer)
router.get('/my-applications', protect, authorize('volunteer'), async (req, res, next) => {
  try {
    const applications = await Application.find({ volunteer: req.user._id })
      .populate({
        path: 'event',
        select: 'title description startDate endDate startTime endTime locationType address city status bannerImage hoursCredit',
        populate: { path: 'ngo', select: 'name email phone' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/applications/:id/cancel
// @desc    Cancel an application
// @access  Private (Volunteer)
router.delete('/:id/cancel', protect, authorize('volunteer'), async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      volunteer: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status === 'attended') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an event you have already attended' });
    }

    const wasApproved = application.status === 'approved';
    application.status = 'cancelled';
    await application.save();

    // If it was approved, decrement the registered count
    if (wasApproved) {
      await Event.findByIdAndUpdate(application.event, {
        $inc: { volunteersRegisteredCount: -1 },
      });
    }

    res.json({ success: true, message: 'Application cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/event/:eventId
// @desc    Get all applications for a specific event
// @access  Private (NGO or Admin)
router.get('/event/:eventId', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this event' });
    }

    const applications = await Application.find({ event: event._id })
      .populate('volunteer', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 });

    // Populate volunteer profile & availability for each application
    const detailedApplications = await Promise.all(
      applications.map(async (app) => {
        const profile = await VolunteerProfile.findOne({ user: app.volunteer?._id }).populate('skills', 'name category');
        const availability = await Availability.findOne({ volunteer: app.volunteer?._id });
        const appObj = app.toObject();
        appObj.volunteerProfile = profile;
        appObj.volunteerAvailability = availability;
        return appObj;
      })
    );

    res.json({ success: true, count: detailedApplications.length, data: detailedApplications });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/ngo/all
// @desc    Get all applications across all events owned by the NGO
// @access  Private (NGO)
router.get('/ngo/all', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'ngo') {
      query.ngo = req.user._id;
    }

    const applications = await Application.find(query)
      .populate('event', 'title startDate endDate status locationType city hoursCredit')
      .populate('volunteer', 'name email phone avatar')
      .sort({ createdAt: -1 });

    const detailed = await Promise.all(
      applications.map(async (app) => {
        const profile = await VolunteerProfile.findOne({ user: app.volunteer?._id }).populate('skills', 'name');
        const appObj = app.toObject();
        appObj.volunteerProfile = profile;
        return appObj;
      })
    );

    res.json({ success: true, count: detailed.length, data: detailed });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (approve, reject, mark attended, feedback)
// @access  Private (NGO or Admin)
router.put('/:id/status', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const { status, hoursLogged, feedback, rating } = req.body;

    const application = await Application.findById(req.params.id).populate('event');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (
      req.user.role !== 'admin' &&
      application.ngo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this application' });
    }

    const previousStatus = application.status;
    application.status = status;
    application.reviewedAt = new Date();

    if (feedback !== undefined) application.feedback = feedback;
    if (rating !== undefined) application.rating = rating;

    // Handle registered count changes
    if (status === 'approved' && previousStatus !== 'approved' && previousStatus !== 'attended') {
      await Event.findByIdAndUpdate(application.event._id, {
        $inc: { volunteersRegisteredCount: 1 },
      });
    } else if (previousStatus === 'approved' && (status === 'rejected' || status === 'cancelled')) {
      await Event.findByIdAndUpdate(application.event._id, {
        $inc: { volunteersRegisteredCount: -1 },
      });
    }

    // Handle attendance and hours logged
    if (status === 'attended') {
      const hours = hoursLogged !== undefined ? Number(hoursLogged) : (application.event.hoursCredit || 4);
      application.hoursLogged = hours;

      if (previousStatus !== 'attended') {
        // Increment volunteer profile stats
        await VolunteerProfile.findOneAndUpdate(
          { user: application.volunteer },
          {
            $inc: {
              totalHoursLogged: hours,
              eventsAttendedCount: 1,
            },
          }
        );
      }
    }

    await application.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
