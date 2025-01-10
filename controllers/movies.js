const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Movie = require('../models/movies');

// const Recommendation = require('../models/recommendation');
const ensureSignedIn = require('../middleware/ensure-signed-in');


router.get('/user-movies', ensureSignedIn, async (req, res) => {
    const movies = await  Movie.find({ owner: req.user._id }).populate('owner');
    res.render('users/movies/index.ejs',{ title: 'My Movies', movies });
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