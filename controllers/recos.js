const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Reco = require('../models/recommendation');
const Media = require('../models/media')
// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');
const media = require('../models/media');

// All routes start with '/unicorns'

// GET /recommendations (index functionality) UN-PROTECTED - all users can access
router.get('/users/:userId/recommendations', ensureSignedIn, async (req, res) => {
  try {
    const recommendations = req.user.recommendations;
    const moviesLink = `/users/${req.params.userId}/recommendations/movies`;
    res.render('users/show.ejs', { recommendations, title: 'My Recommendations', moviesLink  });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
});

// GET request to /users/:userId/recommendations/movies index functionality 
router.get('/users/:userId/recommendations/movies', ensureSignedIn, async (req, res) => {
  const recommendations = await Reco.find({ owner: req.session.user }).populate('media');
  const newLink = `/users/${req.params.userId}/recommendations/movies/new`;
  const movieRecommendations = recommendations.filter((r) => r.media?.contentType == "movie");
  
  res.render('users/movies.ejs',{ movieRecommendations, newLink });
});

router.get('/users/:userId/recommendations/shows', ensureSignedIn, async (req, res) => {
  const recommendations = await Reco.find({ owner: req.session.user }).populate('media');
  const newLink = `/users/${req.params.userId}/recommendations/shows/new`;
  const showRecommendations = recommendations.filter((r) => r.media?.contentType == "show");
  
  res.render('users/shows.ejs',{ showRecommendations, newLink });
});

// GET request .. new functionality 
router.get('/users/:userId/recommendations/movies/new', ensureSignedIn, async (req, res) => {
  const movies = await Media.find({ contentType: 'movie' }).populate('movie');
  const actionLink = `/users/${req.params.userId}/recommendations/movies/new`;
  res.render('users/movies/new.ejs', { movies, actionLink })
});

router.get('/users/:userId/recommendations/shows/new', ensureSignedIn, async (req, res) => {
  const shows = await Media.find({ contentType: 'show' }).populate('show');
  const actionLink = `/users/${req.params.userId}/recommendations/shows/new`;
  res.render('users/shows/new.ejs', { shows, actionLink })
});

// GET request to /users/:userId/recommendations/movies/:mediaId  Show Functionality
router.get('/users/:userId/recommendations/movies/:mediaId', ensureSignedIn, async (req, res) => {
  const media = await Media.findById(req.params.mediaId).populate('movie');
  const recommendation = await Reco.findOne({ owner: req.session.user, media: req.params.mediaId }).populate('media');
  res.render('users/movies/show.ejs', { movie: media?.movie, media, recommendation });
});

router.get('/users/:userId/recommendations/shows/:mediaId', ensureSignedIn, async (req, res) => {
  const media = await Media.findById(req.params.mediaId).populate('show');
  const recommendation = await Reco.findOne({ owner: req.session.user, media: req.params.mediaId }).populate('media');
  res.render('users/shows/show.ejs', { show: media?.show, media, recommendation });
});

// GET request to /users/:userId/recommendations/movies/:mediaId/edit Edit functionality
router.get('/users/:userId/recommendations/movies/:mediaId/edit', ensureSignedIn, async (req, res) => {
  try {
    const movies = await Media.find({ contentType: 'movie' }).populate('movie');
    const curMedia = await Media.findById(req.params.mediaId).populate('movie');
    const reco = await Reco.findOne({ owner: req.session.user, media: curMedia._id});
    res.render('users/movies/edit.ejs', { curMedia, movies, reco });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  }
});

router.get('/users/:userId/recommendations/shows/:mediaId/edit', ensureSignedIn, async (req, res) => {
  try {
    const shows = await Media.find({ contentType: 'show' }).populate('show');
    const curMedia = await Media.findById(req.params.mediaId).populate('show');
    const reco = await Reco.findOne({ owner: req.session.user, media: curMedia._id});
    res.render('users/shows/edit.ejs', { curMedia, shows, reco });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
  }
});

router.delete('/users/:userId/recommendations/:recoId', ensureSignedIn, async (req, res) => {
  try {
    // 1. find the recommendation object using req.params.recoId
    const recommendation = await Reco.findById(req.params.recoId);
    // 2. delete record if found
    if (recommendation) {
      await recommendation.deleteOne();
      res.redirect(`/users/${req.params.userId}/recommendations/movies`);
    };
    // 3. redirect to /users/:userId/recommendations
  } catch(e) {
    // 1. return error
    console.log(e);
    // 2. redirect back
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  }
});

router.post('/users/:userId/recommendations/:recoId', ensureSignedIn, async (req, res) => {
  try {
    const recommendation = await Reco.findByIdAndUpdate(req.params.recoId, req.body);
    await recommendation.save();
    console.log("reco: ", recommendation);
    res.redirect(`/users/${req.params.userId}/recommendations/movies/${req.body.mediaId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  }

});


// POST request.. create functionality 
router.post('/users/:userId/recommendations/movies/new', ensureSignedIn, async (req, res) => {
  try {
    const formData = req.body;

    if(formData.mediaId){ // for existing movies in DB
      const media = await Media.findById(formData.mediaId);
      const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData })  
      reco.save();
    } else { // for new movies in DB
      const media = new Media({ ownerId: req.params.userId, movie: formData });
      await media.save()
      const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData });
      await reco.save()
    }

    res.redirect(`/users/${req.params.userId}/recommendations/movies`)
  } catch(e) {
    console.log("Error: ", e)
  }
});

router.post('/users/:userId/recommendations/shows/new', ensureSignedIn, async (req, res) => {
  try {
    const formData = req.body;
    console.log('form: ', formData);

    // if(formData.mediaId){ // for existing movies in DB
    //   const media = await Media.findById(formData.mediaId);
    //   const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData })  
    //   reco.save();
    // } else { // for new movies in DB
      const media = new Media({ ownerId: req.params.userId, show: formData, contentType: 'show' });
      await media.save()
      const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData });
      await reco.save()
      res.redirect(`/users/${req.params.userId}/recommendations/shows`)
    } catch(e) {
    console.log("Error: ", e)
  }
});


module.exports = router;