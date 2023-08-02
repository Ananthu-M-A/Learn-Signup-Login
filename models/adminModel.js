// IMPORTS MONGOOSE
const mongoose = require('mongoose');

// DEFINES USER SCHEMA FOR THE ADMIN MODEL
const admin= mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
    flexRadioDefault: {
    type: String,
    required:true,
  },
});

// CREATES ADMIN MODEL & EXPORTS IT
const Admin = mongoose.model('admincollection', admin);
module.exports = Admin;