const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: [
        'Environment & Climate',
        'Education & Literacy',
        'Healthcare & Mental Health',
        'Animal Welfare',
        'Disaster Relief & Aid',
        'Community Development',
        'Arts & Culture',
        'Other',
      ],
      default: 'Community Development',
    },
    locationType: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      default: 'In-Person',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    startTime: {
      type: String,
      default: '09:00',
    },
    endTime: {
      type: String,
      default: '17:00',
    },
    requiredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    volunteersNeeded: {
      type: Number,
      required: [true, 'Number of volunteers needed is required'],
      min: 1,
      default: 5,
    },
    volunteersRegisteredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    certificateProvided: {
      type: Boolean,
      default: true,
    },
    hoursCredit: {
      type: Number,
      default: 4,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
