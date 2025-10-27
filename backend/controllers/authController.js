
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`--- Login attempt for email: ${email} ---`);

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found in database:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isMatch}`);

    if (!isMatch) {
      console.log('Login failed: Incorrect password.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    console.log('JWT payload:', payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        console.log('--- Login successful ---');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error during login:', err.message);
    res.status(500).send('Server error');
  }
};
