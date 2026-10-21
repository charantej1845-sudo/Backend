const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'attended', 'cancelled'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
    },
    hoursLogged: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same event by the same volunteer
applicationSchema.index({ event: 1, volunteer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
