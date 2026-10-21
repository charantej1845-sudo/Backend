const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/skills
// @desc    Get all skills with optional search or category filter
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ name: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private (Admin or NGO)
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, category, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existingSkill) {
      return res.status(400).json({ success: false, message: 'Skill already exists' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category: category || 'General & Community',
      description: description || '',
    });

    res.status(201).json({ success: true, data: skill, message: 'Skill created successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, data: skill, message: 'Skill updated successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
