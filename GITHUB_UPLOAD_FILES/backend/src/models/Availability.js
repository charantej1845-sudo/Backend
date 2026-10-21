const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    daysOfWeek: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Saturday', 'Sunday'],
    },
    timeSlots: {
      type: [String],
      enum: [
        'Morning (8AM - 12PM)',
        'Afternoon (12PM - 5PM)',
        'Evening (5PM - 9PM)',
        'Flexible / Any Time',
      ],
      default: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)'],
    },
    maxHoursPerWeek: {
      type: Number,
      default: 10,
      min: 1,
      max: 60,
    },
    preferredLocationType: {
      type: String,
      enum: ['In-Person', 'Remote', 'Any'],
      default: 'Any',
    },
    notes: {
      type: String,
      default: '',
    },
    specificDatesAvailable: [
      {
        type: Date,
      },
    ],
    specificDatesUnavailable: [
      {
        type: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
