const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true },
  date: { type: String, required: true },
  eventName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Calendar', eventSchema);