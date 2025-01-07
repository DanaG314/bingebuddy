const express = require('express');
const ensureSignedIn = require('../middleware/ensure-signed-in');
const router = express.Router();

router.get('/', ensureSignedIn, (req, res) => {
    res.render('home.ejs');
});

module.exports = router;