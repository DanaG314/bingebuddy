const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Movie = require('../models/movies');

// const Recommendation = require('../models/recommendation');
const ensureSignedIn = require('../middleware/ensure-signed-in');

// GET /movies (index func) PROTECTED - only signed in users can access (for all users)
router.get('/', ensureSignedIn, async (req, res) => {
    try {
        const movies = await Movie.find({}).populate('movie');
        console.log('Movies', movies);
        res.render('movies/index.ejs', {movies});
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
  });

router.get('/user-movies', ensureSignedIn, async (req, res) => {
    const movies = await  Movie.find({ owner: req.user._id }).populate('owner');
    res.render('users/movies/index.ejs',{ title: 'My Movies', movies });
});


router.get('/new', ensureSignedIn, async (req, res) => {
    const recommendations = await Recommendation.find({ owner: req.session.user });
    const contentTypes = Media.schema.path('contentType').enumValues;
    res.render('movies/new.ejs', { title: 'Add Movie Recommendation', recommendations, contentTypes });
});

router.get('/user-movies/new', ensureSignedIn, async (req, res) => {
    const movies = await Movie.find({}).populate('owner');
    res.render('users/movies/new.ejs', { title: 'Create New Movie', movies });
});

router.get('/user-movies/:movieId', ensureSignedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        res.render('users/movies/show.ejs', { title: movie.title, movie });
    } catch (e) {
        console.log(e);
        res.redirect('/movies/user-movies');
    }
});

router.get('/user-movies/:movieId/edit', ensureSignedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        res.render('users/movies/edit.ejs', { title: 'Edit Movie', movie });
    } catch (e) {
        console.log(e);
        res.redirect('/movies/user-movies');
    }
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

router.post('/user-movies/new', ensureSignedIn, async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        newMovie.owner = req.user;
        await newMovie.save();
        res.redirect('/movies/user-movies');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

router.put('/user-movies/:movieId', ensureSignedIn, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.movieId, req.body);
        movie.set(req.body);
        await req.user.save();
        res.redirect(`/movies/user-movies/${movie._id}`);
    } catch(e) {
        console.log(e);
        res.redirect('/movies/user-movies');
    }
});

router.delete('/user-movies/:movieId', ensureSignedIn, async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const movie = await Movie.findById(req.params.movieId);
        await movie.deleteOne();
        res.redirect('/movies/user-movies');
    } catch (e) {
        console.log(e);
        res.redirect('/movies/user-movies');
    }
});

  module.exports = router;