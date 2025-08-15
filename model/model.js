
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  description: String,
  duration: Number
});

module.exports = mongoose.model('Exercise', exerciseSchema);
