const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Media = require('../models/media')
// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');



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
  const user = await User.findById(req.params.userId).populate('recommendations.media');
  console.log("user: ", user);
  const newLink = `/users/${req.params.userId}/recommendations/movies/new`;
  const movieRecommendations = user.recommendations.filter((r) => r.media?.contentType == "movie");
  console.log("Movie Rec: ",movieRecommendations);
  res.render('users/movies.ejs',{ movieRecommendations, newLink });
});

router.get('/users/:userId/recommendations/shows', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.params.userId).populate('recommendations.media');
  const newLink = `/users/${req.params.userId}/recommendations/shows/new`;
  const showRecommendations = user.recommendations.filter((r) => r.media?.contentType == "show");
  
  res.render('users/shows.ejs',{ showRecommendations, newLink });
});

// GET request .. new functionality 
router.get('/users/:userId/recommendations/movies/new', ensureSignedIn, async (req, res) => {
  const movies = await Media.find({ contentType: 'movie' }).populate('movie');
  console.log('movies: ', movies);
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
  const user = await User.findById(req.params.userId).populate('recommendations.media');
  const recommendation = user.recommendations.find((rec) => rec.media?._id.toString() === req.params.mediaId);
  const media = await Media.findById(req.params.mediaId).populate('movie');
  res.render('users/movies/show.ejs', { movie: media?.movie, media, recommendation });
});

router.get('/users/:userId/recommendations/shows/:mediaId', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.params.userId).populate('recommendations.media');
  const recommendation = user.recommendations.find((rec) => rec.media?._id.toString() === req.params.mediaId);
  const media = await Media.findById(req.params.mediaId).populate('show');
  res.render('users/shows/show.ejs', { show: media?.show, media, recommendation });
});

// GET request to /users/:userId/recommendations/movies/:mediaId/edit Edit functionality
router.get('/users/:userId/recommendations/movies/:mediaId/edit', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('recommendations.media');
    const recommendation = user.recommendations.find((rec) => rec.media?._id.toString() === req.params.mediaId);
    const movies = await Media.find({ contentType: 'movie' });
    const curMedia = await Media.findById(req.params.mediaId).populate('movie');
    res.render('users/movies/edit.ejs', { curMedia, movies, recommendation });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  }
});

router.get('/users/:userId/recommendations/shows/:mediaId/edit', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('recommendations.media');
    const recommendation = user.recommendations.find((rec) => rec.media?._id.toString() === req.params.mediaId);
    const shows = await Media.find({ contentType: 'show' });
    const curMedia = await Media.findById(req.params.mediaId).populate('show');
    res.render('users/shows/edit.ejs', { curMedia, shows, recommendation });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
  }
});

router.delete('/users/:userId/recommendations/movies/:mediaId', ensureSignedIn, async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { recommendations: { media: req.params.mediaId } } },
        { new: true }
      );
      res.redirect(`/users/${req.params.userId}/recommendations/movies`);
    } catch (e) {
          // 1. return error
    console.log(e);
    // 2. redirect back
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
    }
});

router.delete('/users/:userId/recommendations/shows/:mediaId', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { recommendations: { media: req.params.mediaId } } },
      { new: true }
    );
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
    } catch(e) {
    // 1. return error
    console.log(e);
    // 2. redirect back
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
  }
});


router.post('/users/:userId/recommendations/movies/new', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const formData = req.body;
    let media;
    console.log("formdata.mediaid: ", formData.mediaId);
    if(formData.mediaId){ // for existing movies in DB
      media = await Media.findById(formData.mediaId);
      console.log("media: ", media);
      // const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData })  
      // reco.save();
    } else { // for new movies in DB
      media = new Media({ ownerId: req.params.userId, movie: formData});
      await media.save()
    }
    
    user.recommendations.push({ media: media, ...formData,});
    await user.save();
    console.log("user: ", user);
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  } catch(e) {
    console.log("Error: ", e)
  }
});

router.post('/users/:userId/recommendations/shows/new', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const formData = req.body;
    let media;
    console.log("formdata.mediaid: ", formData.mediaId);
    if(formData.mediaId){ // for existing movies in DB
      media = await Media.findById(formData.mediaId);
      console.log("media: ", media);
      // const reco = new Reco({ ownerId: req.params.userId, media: media, ...formData })  
      // reco.save();
    } else { // for new movies in DB
      media = new Media({ ownerId: req.params.userId, contentType: 'show', show: formData});
      await media.save()
      console.log("media: ", media);
    }
    
    user.recommendations.push({ media: media, ...formData,});
    await user.save();
    console.log("user: ", user);
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
  } catch(e) {
    console.log("Error: ", e)
  }
});

router.post('/users/:userId/recommendations/movies/:mediaId', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('movie');
    const recommendation = user.recommendations?.find((rec) => rec.media?._id.toString() === req.params.mediaId);
    if (!recommendation) {
      console.log('Recommendation not found');
      const newRecommendation = {
        media: req.params.mediaId,
        ...req.body,
      };
      user.recommendations.push(newRecommendation);
    } else {
      Object.assign(recommendation, req.body);
    }
    await user.save();
    // console.log('body: ', req.body)
    // console.log('recommendation: ', recommendation)
    // console.log('userrecommendations: ', user.recommendations);
    const media = await Media.findById(req.params.mediaId).populate('movie');
    Object.assign(media.movie, req.body);
    await media.save();
    
    res.render('users/movies/show.ejs', { movie: media?.movie, media, recommendation });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/movies`);
  }
  
});

router.post('/users/:userId/recommendations/shows/:mediaId', ensureSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const recommendation = user.recommendations.find((reco) => rec.media?._id.toString() === req.params.mediaId);
    Object.assign(recommendation, req.body);
    const media = await Media.findById(req.params.mediaId).populate('show');
    
    Object.assign(media.show, req.body);
    await media.save();
    await user.save();
    
    res.render('users/shows/show.ejs', { show: media?.show, media, recommendation });
  } catch (e) {
    console.log(e);
    res.redirect(`/users/${req.params.userId}/recommendations/shows`);
  }

});


// POST request.. create functionality 



module.exports = router;