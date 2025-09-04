// controllers/exerciseController.js
const Exercise = require('../model/model');

// GET all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new exercise
exports.createExercise = async (req, res) => {
  const newEx = new Exercise({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    duration: req.body.duration
  });

  try {
    const savedEx = await newEx.save();
    res.status(201).json(savedEx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE exercise by ID
exports.deleteExercise = async (req, res) => {
  try {
    const result = await Exercise.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
