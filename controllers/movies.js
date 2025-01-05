const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Media = require('../models/media');
// const Recommendation = require('../models/recommendation');
const ensureSignedIn = require('../middleware/ensure-signed-in');

// GET /movies (index func) PROTECTED - only signed in users can access
router.get('/', ensureSignedIn, async (req, res) => {
    try {
        const movies = await Media.find({}).populate('movie');
        console.log('Movies', movies);
        res.render('movies/index.ejs', {movies});
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
  });

router.get('/new', ensureSignedIn, async (req, res) => {
    const recommendations = await Recommendation.find({ owner: req.session.user });
    const contentTypes = Media.schema.path('contentType').enumValues;
    res.render('movies/new.ejs', { title: 'Add Movie Recommendation', recommendations, contentTypes });
});

router.get('/:movieId', ensureSignedIn, async (req, res) => {
    const media = await Media.findById(req.params.movieId).populate('movie')

    res.render('movies/show.ejs', { movie: media.movie });
});


router.post('/new', ensureSignedIn, async (req, res) => {
    try {        
        const newMedia = new Media({ ...req.body, movie: req.body });
        await newMedia.save();    
        res.redirect('/movies');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

  module.exports = router;