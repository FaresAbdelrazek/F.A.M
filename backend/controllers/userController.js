
const User   = require('../models/User');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');


function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}


exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.status(201).json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.getProfile = (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true
    }).select('-password');

    res.json({ user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
