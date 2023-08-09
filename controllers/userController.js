const bcrypt = require('bcrypt');
const User = require("../models/userModel");

const insertStudent = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
      firstname: name,
      email: email,
      username: username,
      password: hashedPassword,
      admin: false
    });

    const result = await user.save();
    res.redirect('/admin');

  } catch (error) {
    res.redirect('/')
    console.log(error.message);
  }
};

module.exports = { insertStudent };