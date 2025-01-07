const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Show = require('../models/tvshows')

// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');



router.get('/user-shows', ensureSignedIn, async (req, res) => {
  try {
    const shows = await Show.find({}).populate('owner');
    res.render('users/shows/index.ejs', { title: 'My Shows', shows })
  } catch (e) {
    console.log(e);
    res.redirect('/')
  }
});


router.get('/user-shows/new', ensureSignedIn, async (req, res) => {
  const shows = await Show.find({}).populate('owner');
  res.render('users/shows/new.ejs', { title: 'Create New Show', shows })
});

router.get('/user-shows/:showId', ensureSignedIn, async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId);
    res.render('users/shows/show.ejs', { title: show.title, show });
  } catch (e) {
    console.log(e);
    res.redirect('/shows/user-shows');
  }
});

router.get('/user-shows/:showId/edit', ensureSignedIn, async (req, res) => {
    try {
        const show = await Show.findById(req.params.showId);
        res.render('users/shows/edit.ejs', { title: 'Edit Show', show });
    } catch (e) {
        console.log(e);
        res.redirect('/shows/user-shows');
    }
});


router.get('/users/:userId/recommendations/shows/:mediaId', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.params.userId).populate('recommendations.media');
  const recommendation = user.recommendations.find((rec) => rec.media?._id.toString() === req.params.mediaId);
  const media = await Media.findById(req.params.mediaId).populate('show');
  res.render('users/shows/show.ejs', { show: media?.show, media, recommendation });
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


router.post('/user-shows/new', ensureSignedIn, async (req, res) => {
  try {
    const newShow = new Show(req.body);
    newShow.owner = req.user;
    await newShow.save();
    res.redirect('/user-shows')
  } catch(e) {
    console.log(e);
    res.redirect('/');
  }
});



router.put('/user-shows/:showId', ensureSignedIn, async (req, res) => {
    try {
        const show = await Show.findByIdAndUpdate(req.params.showId, req.body);
        show.set(req.body);
        await req.user.save();
        res.redirect(`/shows/user-shows/${show._id}`);
    } catch(e) {
        console.log(e);
        res.redirect('/shows/user-shows');
    }
});

router.delete('/user-shows/:showId', ensureSignedIn, async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const show = await Show.findById(req.params.showId);
        await show.deleteOne();
        res.redirect('/shows/user-shows');
    } catch (e) {
        console.log(e);
        res.redirect('/shows/user-shows');
    }
});


module.exports = router;