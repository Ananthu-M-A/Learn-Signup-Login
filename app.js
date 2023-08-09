const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const userController = require('./controllers/userController');

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  if (req.path === '/home' || req.path === '/admin') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');

const sessionConfig = {
  secret: 'LearnSmartKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
};

app.use(session(sessionConfig));

const requireLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/admin', requireLoggedIn, async (req, res) => {
  try {
    const users = await User.find();
    res.render('adminhome', { users });
  } catch (error) {
    res.render('adminhome', { error: 'Error fetching user data.' });
  }
});

app.get('/admin/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const users = await User.find({ username: { $regex: query, $options: 'i' } });
    res.render('adminhome', { users });
  } catch (error) {
    res.render('adminhome', { error: 'Error searching users.' });
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/admin/create', (req, res) => {
  res.redirect('/admin');
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login');
  }
});

app.get('/home', requireLoggedIn, async (req, res) => {
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
  try {
    const { username, password, flexRadioDefault } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.render('login', { error: 'Incorrect username or password.' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (passwordMatches && user.username === username) {
      const isAdmin = user.admin;
      if (isAdmin && flexRadioDefault === 'admin') {
        req.session.user = { username, role: 'admin' };
        res.redirect('/admin');
      } else if (!isAdmin && flexRadioDefault === 'student') {
        req.session.user = { username, role: 'student' };
        res.redirect('/home');
      } else {
        res.render('login', { error: 'Incorrect username or password.' });
      }
    } else {
      res.render('login', { error: 'Incorrect username or password.' });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.post('/signup', userController.insertStudent);
app.post('/admin/create', userController.insertStudent);

app.delete('/deleteUser/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    await User.deleteOne({ username });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});






app.put('/toggleAdmin', async (req, res) => {
  try {
    let result;
    const toggleDefault = await User.findOne( {_id:req.body.id },{admin:1,_id:0})
   if(toggleDefault.admin === true)
   {
      result = await User.findByIdAndUpdate(req.body.id, {admin : false} );
   }
   else
   {
     result = await User.findByIdAndUpdate(req.body.id, {admin : true} );
   }

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User admin status toggled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user admin status', error: error.message });
  }
});








app.put('/editUser', async (req, res) => {
  try { 
    const updateUser = {
      firstname: req.body.firstname,
      email: req.body.email,
    };
    const result = await User.updateOne({ _id: req.body.id }, { $set: updateUser });

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server launched on port ${PORT}`);
});

