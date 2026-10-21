const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Application = require('../models/Application');
const NGOProfile = require('../models/NGOProfile');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events with filters
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, category, locationType, city, skill, status } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    } else {
      // By default exclude cancelled unless specified
      query.status = { $ne: 'Cancelled' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (locationType && locationType !== 'All') {
      query.locationType = locationType;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (skill) {
      query.requiredSkills = skill;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('ngo', 'name email phone avatar')
      .populate('requiredSkills', 'name category')
      .sort({ startDate: 1 });

    // Also populate NGOProfile for organizationName
    const eventsWithNgoProfile = await Promise.all(
      events.map(async (ev) => {
        const ngoProfile = await NGOProfile.findOne({ user: ev.ngo?._id });
        const evObj = ev.toObject();
        evObj.ngoProfile = ngoProfile;
        return evObj;
      })
    );

    res.json({ success: true, count: eventsWithNgoProfile.length, data: eventsWithNgoProfile });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/ngo/my-events
// @desc    Get all events created by logged-in NGO
// @access  Private (NGO)
router.get('/ngo/my-events', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'ngo') {
      query.ngo = req.user._id;
    }

    const events = await Event.find(query)
      .populate('requiredSkills', 'name category')
      .sort({ createdAt: -1 });

    // Get applicant counts per event
    const eventsWithStats = await Promise.all(
      events.map(async (ev) => {
        const evObj = ev.toObject();
        const pendingCount = await Application.countDocuments({ event: ev._id, status: 'pending' });
        const approvedCount = await Application.countDocuments({ event: ev._id, status: 'approved' });
        const attendedCount = await Application.countDocuments({ event: ev._id, status: 'attended' });
        evObj.pendingApplicants = pendingCount;
        evObj.approvedApplicants = approvedCount;
        evObj.attendedApplicants = attendedCount;
        return evObj;
      })
    );

    res.json({ success: true, count: eventsWithStats.length, data: eventsWithStats });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('ngo', 'name email phone avatar')
      .populate('requiredSkills', 'name category description');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const ngoProfile = await NGOProfile.findOne({ user: event.ngo?._id });
    const eventObj = event.toObject();
    eventObj.ngoProfile = ngoProfile;

    // Applications count
    const approvedCount = await Application.countDocuments({ event: event._id, status: 'approved' });
    const pendingCount = await Application.countDocuments({ event: event._id, status: 'pending' });
    eventObj.approvedCount = approvedCount;
    eventObj.pendingCount = pendingCount;

    res.json({ success: true, data: eventObj });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (NGO or Admin)
router.post('/', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      locationType,
      address,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      requiredSkills,
      volunteersNeeded,
      bannerImage,
      certificateProvided,
      hoursCredit,
    } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const event = await Event.create({
      title,
      ngo: req.user._id,
      description,
      category: category || 'Community Development',
      locationType: locationType || 'In-Person',
      address: address || '',
      city: city || '',
      startDate,
      endDate,
      startTime: startTime || '09:00',
      endTime: endTime || '17:00',
      requiredSkills: requiredSkills || [],
      volunteersNeeded: volunteersNeeded || 5,
      bannerImage: bannerImage || '',
      certificateProvided: certificateProvided !== undefined ? certificateProvided : true,
      hoursCredit: hoursCredit || 4,
      status: 'Upcoming',
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('requiredSkills', 'name category')
      .populate('ngo', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent,
      message: 'Event created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (NGO owner or Admin)
router.put('/:id', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership unless admin
    if (req.user.role !== 'admin' && event.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('requiredSkills', 'name category');

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (NGO owner or Admin)
router.delete('/:id', protect, authorize('ngo', 'admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    // Delete associated applications
    await Application.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Event and associated records deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
