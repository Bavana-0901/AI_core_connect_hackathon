const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed, // Can be string or object
    required: true,
  },
  icon: {
    type: String, // URL to icon
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Badge', badgeSchema);