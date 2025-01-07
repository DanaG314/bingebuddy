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