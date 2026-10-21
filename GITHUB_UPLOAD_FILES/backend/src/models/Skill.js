const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Technical & IT',
        'Teaching & Mentoring',
        'Healthcare & First Aid',
        'Logistics & Events',
        'Media, Content & Design',
        'Environment & Conservation',
        'General & Community',
      ],
      default: 'General & Community',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
