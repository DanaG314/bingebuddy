const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // res.render('index.ejs');
    res.renderWithLayout('home', { title: 'Home Page' });
});

module.exports = router;