const mongoose = require("mongoose");
// Shortcut variable
const Schema = mongoose.Schema;

const recommendationSchema = require('../models/recommendation');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  recommendations: [{
    type: Schema.Types.ObjectId,
    ref: 'Recommendation'
  }],
});

module.exports = mongoose.model("User", userSchema);
