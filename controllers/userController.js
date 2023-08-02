const bcrypt = require('bcrypt');
const User = require("../models/userModel");

const insertStudent = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const result = await user.save();

    res.redirect('/');
  } catch (error) {
    res.render('signup', { error: 'Invalid input data.' });
  }
};

module.exports = { insertStudent };
