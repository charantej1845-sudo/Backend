const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    causeCategory: {
      type: String,
      required: [true, 'Cause category is required'],
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
    mission: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    contactPerson: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    logo: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected'],
      default: 'verified',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NGOProfile', ngoProfileSchema);
