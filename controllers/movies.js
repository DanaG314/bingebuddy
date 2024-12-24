const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Media = require('../models/media');
const Recommendation = require('../models/recommendation');
const ensureSignedIn = require('../middleware/ensure-signed-in');

// GET /movies (index func) PROTECTED - only signed in users can access
router.get('/', ensureSignedIn, (req, res) => {
    res.render('movies/index.ejs', {recommendations: []});
  });

router.get('/new', ensureSignedIn, async (req, res) => {
    const recommendations = await Recommendation.find({ owner: req.session.user });
    res.render('movies/new.ejs', { title: 'Add Movie Recommendation', recommendations });
});

router.post('/new', ensureSignedIn, async (req, res) => {});

  module.exports = router;