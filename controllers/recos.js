const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Media = require('../models/media')
// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/unicorns'

// GET /recommendations (index functionality) UN-PROTECTED - all users can access
router.get('/', (req, res) => {
  res.render('home.ejs');
});






module.exports = router;