const bcrypt = require('bcrypt');
const User = require("../models/adminModel");

const iAdmin = async (req, res) => {
  try {
    const { name, email, username, password, adminpower } = req.body;

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
