const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Media = require('../models/media')
// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/unicorns'

// GET /recommendations (index functionality) UN-PROTECTED - all users can access
router.get('/users/:userId/recommendations', ensureSignedIn, async (req, res) => {
  console.log('Route hit: /users/:userId/recommendations/movies');
  try {
    const recommendations = req.user.recommendations;
    res.render('users/show.ejs', { recommendations, title: 'My Recommendations' });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
});






module.exports = router;