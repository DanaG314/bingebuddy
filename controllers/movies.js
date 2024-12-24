const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Media = require('../models/media');
const Recommendation = require('../models/recommendation');
const ensureSignedIn = require('../middleware/ensure-signed-in');

// GET /recommendations/movies (index func) PROTECTED - only signed in users can access
router.get('/', ensureSignedIn, (req, res) => {
    res.render('movies/index.ejs', {recommendations: []});
  });



  module.exports = router;