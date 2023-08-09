// IMPORTS MONGOOSE
const mongoose = require('mongoose');

// DEFINES USER SCHEMA FOR THE USER MODEL
const user= mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  }
});

// CREATES USER MODEL & EXPORTS IT
const User = mongoose.model('usercollection', user);
module.exports = User;