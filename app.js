const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const userController = require('./controllers/userController');

const app = express();
const PORT = 4000;


// Middleware to prevent caching of certain pages
app.use((req, res, next) => {
  if (req.path === '/home') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'LearnSmartKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);


// Middleware to check if the user is logged in
const checkLoggedIn = async (req, res, next) => {
  if (req.session.user && req.cookies.username) {
    next();
  } else {
    res.redirect('/');
  }
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/admin', checkAdmin, async (req, res) => {
  // Fetch and pass admin-specific data if needed
  try {
    const users = await User.find();
    res.render('adminhome', { users });
  } catch (error) {
    res.render('adminhome', { error: 'Error fetching user data.' });
  }
});

app.post('/admin/create', checkAdmin, async (req, res) => {
  // Logic to create a new user (student or admin) and save to the database
  res.redirect('/admin');
});

// Implement similar routes for edit, update, and delete

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/', (req, res) => {
  res.setHeader("Cache-Control","no-store");
  if (req.session.user) {
    res.render('userhome');
  }
    else{
  res.render('login');
}});

app.get('/home', checkLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.user.username });
    res.render('userhome', { user });
  } catch (error) {
    res.render('userhome', { error: 'Error fetching user data.' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.post('/', async (req, res) => {
  const { username, password, flexRadioDefault } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('login', { error: 'Incorrect username or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.render('login', { error: 'Incorrect username or password.' });
    }

    req.session.user = { username, role: flexRadioDefault }; // Store user role in session
    res.cookie("username",username)
    res.redirect('/home');
  } catch (error) {
    res.render('login', { error: 'An error occurred during login.' });
  }
});

app.post('/signup', userController.insertStudent);

app.listen(PORT, () => {
  console.log(`Server launched on port ${PORT}`);
});
