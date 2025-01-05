require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require('express-session');

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Configure Express app 
// app.set(...)

// Mount Middleware
// app.use(...)
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.renderWithLayout = (view, options = {}) => {
    // Render the route-specific view first
    res.render(view, options, (err, html) => {
      if (err) return next(err); // Handle errors
      // Inject the rendered HTML into the layout
      options.body = html; // Pass the rendered content as 'body'
      res.render('layout', options); // Render the layout with the injected body
    });
  };
  next();
});

// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Static middleware for returning static assets to the browser
app.use(express.static('public'));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Add the user (if logged in) to req.user & res.locals
app.use(require('./middleware/add-user-to-locals-and-req'));

// Routes

// GET /  (home page functionality)
app.get('/', (req, res) => {
  res.renderWithLayout('home.ejs', { title: 'Home Page' });
});

// '/auth' is the "starts with" path that the request must match
// The "starts with" path is pre-pended to the paths
// defined in the router module
app.use('/auth', require('./controllers/auth'));
app.use('/', require('./controllers/recos'));
app.use('/users', require('./controllers/users'));
app.use('/movies', require('./controllers/movies'));

// Any requests that get this far must have a signed in 
// user thanks to ensureSignedIn middleware
app.use(require('./middleware/ensure-signed-in'));
// Any controller/routes mounted below here will have
// ALL routes protected by the ensureSignedIn middleware



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
