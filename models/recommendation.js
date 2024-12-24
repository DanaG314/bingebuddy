const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');
const Media = require('../models/media');

const recommendationSchema = new Schema ({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    note: {
      type: String
    }
  });

  module.exports = mongoose.model('Recommendation', recommendationSchema);